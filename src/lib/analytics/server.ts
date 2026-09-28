import "server-only";
import { JWT } from "google-auth-library";
import { ACTION_EVENTS, type AnalyticsReport } from "./shared";
import { AnalyticsError, assembleReport, type GAReport, type ReportRange } from "./report";

/** Only verified Sanity users on the explicit server-side allowlist can read reports. */
export async function requireAnalyticsAdmin(request: Request, fetcher: typeof fetch = fetch) {
  const token = request.headers.get("authorization");
  if (!token || !/^Bearer [^\s]+$/.test(token) || token.length > 4096) {
    throw new AnalyticsError(401, "Sign in to Sanity Studio to view analytics.");
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const allowed = (process.env.ANALYTICS_ADMIN_USER_IDS || "").split(",").map(id => id.trim()).filter(Boolean);
  if (!projectId || !/^[a-z0-9-]+$/.test(projectId) || !allowed.length) {
    throw new AnalyticsError(503, "Analytics access is not configured. Add ANALYTICS_ADMIN_USER_IDS on the server using your Sanity user ID shown in this dashboard.");
  }
  let response: Response;
  try {
    response = await fetcher(`https://${projectId}.api.sanity.io/v2021-06-07/users/me`, {
      headers: { Authorization: token }, cache: "no-store", signal: AbortSignal.timeout(8000), redirect: "error",
    });
  } catch { throw new AnalyticsError(502, "Could not verify your Sanity session. Try again shortly."); }
  if (response.status === 401 || response.status === 403) throw new AnalyticsError(401, "Your Sanity session expired. Sign out and sign in again.");
  if (!response.ok) throw new AnalyticsError(502, "Sanity could not verify your session. Try again shortly.");
  const user = await response.json() as { id?: string };
  if (!user.id || !allowed.includes(user.id)) throw new AnalyticsError(403, "Your Sanity account is not approved to view analytics. Ask the site owner to add your user ID to ANALYTICS_ADMIN_USER_IDS.");
  return user.id;
}

const cache = new Map<string, { expires: number; report: AnalyticsReport }>();
const pending = new Map<string, Promise<AnalyticsReport>>();
let auth: JWT | undefined;

export async function getAnalyticsReport(range: ReportRange): Promise<AnalyticsReport> {
  const property = process.env.GA4_PROPERTY_ID;
  const email = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!property || !/^\d+$/.test(property) || !email || !privateKey) {
    throw new AnalyticsError(503, "Connect Google Analytics first: set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY on the server. See docs/analytics-setup.md.");
  }
  const key = `${property}:${range.startDate}:${range.endDate}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.report;
  const existing = pending.get(key);
  if (existing) return existing;
  if (pending.size >= 5) throw new AnalyticsError(429, "Several reports are loading. Please try again shortly.");

  const load = async () => {
    auth ||= new JWT({ email, key: privateKey, scopes: ["https://www.googleapis.com/auth/analytics.readonly"], transporterOptions: { timeout: 15000 } });
    const accessToken = await auth.getAccessToken();
    if (!accessToken.token) throw new AnalyticsError(502, "Google Analytics authentication failed. Check the service account credentials.");
    const filters = [
      { filter: { fieldName: "hostName", inListFilter: { values: ["thescholarshipcircle.com", "www.thescholarshipcircle.com"] } } },
      { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/" } } },
      { notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "FULL_REGEXP", value: "^/(studio|admin|api|_next)(/.*)?$" } } } },
    ];
    const specs = [
      { dimensions: [], metrics: ["screenPageViews", "totalUsers", "sessions"], limit: 1 },
      { dimensions: ["pagePath"], metrics: ["screenPageViews", "totalUsers"], limit: 10000, orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }] },
      { dimensions: ["date"], metrics: ["screenPageViews", "totalUsers"], limit: 366, orderBys: [{ dimension: { dimensionName: "date" } }] },
      { dimensions: ["sessionSourceMedium"], metrics: ["sessions"], limit: 20, orderBys: [{ metric: { metricName: "sessions" }, desc: true }] },
      { dimensions: ["pagePath", "eventName"], metrics: ["eventCount"], limit: 10000, orderBys: [{ metric: { metricName: "eventCount" }, desc: true }] },
    ];
    const reports = await Promise.all(specs.map(async (spec, index) => {
      const expressions: unknown[] = [...filters];
      if (index === 4) expressions.push({ filter: { fieldName: "eventName", inListFilter: { values: Object.values(ACTION_EVENTS) } } });
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, {
        method: "POST", cache: "no-store", signal: AbortSignal.timeout(20000),
        headers: { Authorization: `Bearer ${accessToken.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
          dimensions: spec.dimensions.map(name => ({ name })), metrics: spec.metrics.map(name => ({ name })),
          dimensionFilter: { andGroup: { expressions } }, limit: spec.limit, orderBys: spec.orderBys,
        }),
      });
      if (!response.ok) {
        if (response.status === 403) throw new AnalyticsError(502, "Google denied access. Enable the Google Analytics Data API and give the service account Viewer access to this GA4 property.");
        if (response.status === 429) throw new AnalyticsError(429, "Google Analytics report quota is temporarily exhausted. Try again later.");
        throw new AnalyticsError(502, "Google Analytics could not load this report. Check the property ID and try again.");
      }
      return await response.json() as GAReport;
    }));
    const report = assembleReport(reports, range);
    if (cache.size >= 20) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + 300000, report });
    return report;
  };
  const promise = load();
  pending.set(key, promise);
  try { return await promise; } finally { pending.delete(key); }
}
