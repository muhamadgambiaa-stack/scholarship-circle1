import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { AnalyticsError, assembleReport, parseRange, type GARow } from "../src/lib/analytics/report";
import { requireAnalyticsAdmin } from "../src/lib/analytics/server";
import { trackAction } from "../src/lib/analytics/track";
import { isPublicPath, pageKind } from "../src/lib/analytics/shared";
import { JWT } from "google-auth-library";
import { GET } from "../src/app/api/admin/analytics/route";

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; Reflect.deleteProperty(globalThis, "window"); });
const row = (dimensions: string[], metrics: number[]): GARow => ({ dimensionValues: dimensions.map(value => ({ value })), metricValues: metrics.map(value => ({ value: String(value) })) });
const status = (n: number) => (error: unknown) => error instanceof AnalyticsError && error.status === n;

test("ranges use GA property-relative days and reject malformed/unbounded input", () => {
  assert.deepEqual(parseRange(new URLSearchParams("days=7")), { startDate: "6daysAgo", endDate: "today", label: "Last 7 days (including today)" });
  for (const value of ["days=0", "days=999999", "start=2026-02-30&end=2026-03-01", "start=2026-04-02&end=2026-04-01", "start=2020-01-01&end=2026-01-01", "start=2026-01-01"]) {
    assert.throws(() => parseRange(new URLSearchParams(value)), status(400));
  }
});

test("reports join actions to the right page and do not sum overlapping visitors", () => {
  const result = assembleReport([
    { rows: [row([], [12, 4, 5])], metadata: { timeZone: "Africa/Banjul" } },
    { rows: [row(["/"], [7, 3]), row(["/scholarships/a"], [5, 3]), row(["/studio"], [100, 100])] },
    { rows: [row(["20260901"], [12, 4])] },
    { rows: [row(["google / organic"], [5])] },
    { rows: [row(["/scholarships/a", "tsc_apply_click"], [2]), row(["/blog/b", "tsc_copy_link"], [1]), row(["/", "unrelated"], [500])] },
  ], parseRange(new URLSearchParams()));
  assert.equal(result.totals.visitors, 4);
  assert.equal(result.pages.length, 3);
  assert.equal(result.pages.find(p => p.path === "/scholarships/a")?.apply, 2);
  assert.equal(result.pages.find(p => p.path === "/blog/b")?.copy, 1);
  assert.equal(result.daily[0].date, "2026-09-01");
  assert.equal(result.sources[0].sessions, 5);
});

test("empty and limited reports have honest zero counts and warnings", () => {
  const result = assembleReport([{}, { rowCount: 20000, metadata: { subjectToThresholding: true } }, {}, {}, {}], parseRange(new URLSearchParams()));
  assert.deepEqual(result.totals, { views: 0, visitors: 0, sessions: 0 });
  assert.deepEqual(result.pages, []);
  assert.equal(result.warnings.length, 2);
});

test("private paths and preview hosts never emit custom analytics", () => {
  for (const path of ["/studio", "/studio/analytics", "/admin/newsletter", "/api/a", "//evil.test"]) assert.equal(isPublicPath(path), false);
  assert.equal(pageKind("/categories/fully-funded"), "Categories");
  const fake = { location: { hostname: "preview.vercel.app", origin: "https://preview.vercel.app", pathname: "/" }, dataLayer: [] as unknown[] };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fake });
  trackAction("apply"); assert.equal(fake.dataLayer.length, 0);
  fake.location = { hostname: "thescholarshipcircle.com", origin: "https://thescholarshipcircle.com", pathname: "/studio/analytics" };
  trackAction("apply"); assert.equal(fake.dataLayer.length, 0);
  fake.location.pathname = "/scholarships/example";
  trackAction("apply");
  assert.deepEqual(fake.dataLayer[0], { event: "tsc_apply_click", page_location: "https://thescholarshipcircle.com/scholarships/example", page_path: "/scholarships/example" });
});

test("anonymous requests fail before contacting Sanity", async () => {
  let called = false;
  await assert.rejects(requireAnalyticsAdmin(new Request("https://example.test"), async () => { called = true; return new Response(); }), status(401));
  assert.equal(called, false);
});

test("unconfigured admin access fails closed", async () => {
  delete process.env.ANALYTICS_ADMIN_USER_IDS;
  await assert.rejects(requireAnalyticsAdmin(new Request("https://example.test", { headers: { authorization: "Bearer fake" } })), status(503));
});

test("identity must be verified upstream and explicitly allowlisted", async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproject";
  process.env.ANALYTICS_ADMIN_USER_IDS = "owner-id";
  const request = new Request("https://example.test?user=owner-id", { headers: { authorization: "Bearer fake", "x-user-id": "owner-id" } });
  await assert.rejects(requireAnalyticsAdmin(request, async () => new Response("", { status: 401 })), status(401));
  await assert.rejects(requireAnalyticsAdmin(request, async () => Response.json({ id: "someone-else" })), status(403));
  const id = await requireAnalyticsAdmin(request, async (url, options) => {
    assert.equal(String(url), "https://testproject.api.sanity.io/v2021-06-07/users/me");
    assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer fake");
    assert.equal(options?.cache, "no-store");
    return Response.json({ id: "owner-id" });
  });
  assert.equal(id, "owner-id");
});

test("report endpoint returns private unauthorized errors without fetching data", async () => {
  const response = await GET(new Request("https://example.test/api/admin/analytics"));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("vary"), "Authorization");
});

test("GA reports are filtered to public production pages and cache never bypasses authorization", async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproject";
  process.env.ANALYTICS_ADMIN_USER_IDS = "owner-id";
  process.env.GA4_PROPERTY_ID = "123456";
  process.env.GA4_CLIENT_EMAIL = "test@example.invalid";
  process.env.GA4_PRIVATE_KEY = "test-only-no-real-key";
  const originalFetch = globalThis.fetch;
  const originalAccessToken = JWT.prototype.getAccessToken;
  JWT.prototype.getAccessToken = (async () => ({ token: "fake-google-token" })) as typeof JWT.prototype.getAccessToken;
  let sanityCalls = 0, reportCalls = 0, allowed = true;
  globalThis.fetch = async (input, init) => {
    if (String(input).includes("sanity.io")) {
      sanityCalls++;
      return Response.json({ id: allowed ? "owner-id" : "other-id" });
    }
    reportCalls++;
    assert.equal(String(input), "https://analyticsdata.googleapis.com/v1beta/properties/123456:runReport");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.dateRanges[0].startDate, "29daysAgo");
    const filters = body.dimensionFilter.andGroup.expressions;
    assert.deepEqual(filters[0].filter.inListFilter.values, ["thescholarshipcircle.com", "www.thescholarshipcircle.com"]);
    assert.ok(filters[2].notExpression.filter.stringFilter.value.includes("studio|admin|api|_next"));
    if (body.metrics[0].name === "eventCount") assert.ok(filters[3].filter.inListFilter.values.includes("tsc_apply_click"));
    return Response.json({ rows: [], metadata: { timeZone: "Africa/Banjul" } });
  };
  try {
    const request = () => new Request("https://example.test/api/admin/analytics", { headers: { authorization: "Bearer fake-sanity-token" } });
    const first = await GET(request());
    assert.equal(first.status, 200);
    assert.equal((await first.json()).timeZone, "Africa/Banjul");
    assert.equal(reportCalls, 5);
    assert.equal((await GET(request())).status, 200);
    assert.equal(reportCalls, 5);
    allowed = false;
    assert.equal((await GET(request())).status, 403);
    assert.equal(sanityCalls, 3);
    assert.equal(reportCalls, 5);
  } finally {
    globalThis.fetch = originalFetch;
    JWT.prototype.getAccessToken = originalAccessToken;
  }
});
