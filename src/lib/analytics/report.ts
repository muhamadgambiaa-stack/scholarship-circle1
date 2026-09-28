import { ACTION_EVENTS, isPublicPath, pageKind, type AnalyticsReport, type PageStats } from "./shared";

export class AnalyticsError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export type ReportRange = { startDate: string; endDate: string; label: string };
export function parseRange(params: URLSearchParams): ReportRange {
  const start = params.get("start"), end = params.get("end");
  if (start !== null || end !== null) {
    const valid = (value: string | null): value is string => Boolean(value &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value);
    if (!valid(start) || !valid(end) || start > end ||
        Date.parse(end) - Date.parse(start) > 365 * 86400000 ||
        Date.parse(end) > Date.now() + 86400000) {
      throw new AnalyticsError(400, "Choose valid dates in order, up to 366 days, ending no later than today.");
    }
    return { startDate: start, endDate: end, label: `${start} to ${end}` };
  }
  const days = params.get("days") || "30";
  if (!["1", "7", "30", "90"].includes(days)) throw new AnalyticsError(400, "Choose 1, 7, 30, or 90 days.");
  return { startDate: `${Number(days) - 1}daysAgo`, endDate: "today", label: days === "1" ? "Today" : `Last ${days} days (including today)` };
}

export type GARow = { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] };
export type GAReport = {
  rows?: GARow[]; rowCount?: number;
  metadata?: { timeZone?: string; subjectToThresholding?: boolean; dataLossFromOtherRow?: boolean;
    samplingMetadatas?: unknown[] };
};
const dimension = (row: GARow, index: number) => row.dimensionValues?.[index]?.value || "";
const metric = (row: GARow | undefined, index: number) => {
  const n = Number(row?.metricValues?.[index]?.value || 0);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export function assembleReport(reports: GAReport[], range: ReportRange): AnalyticsReport {
  const [totals, pages, daily, sources, actions] = reports;
  const rows = new Map<string, PageStats>();
  const getPage = (path: string) => {
    let page = rows.get(path);
    if (!page) {
      page = { path, kind: pageKind(path), views: 0, visitors: 0, apply: 0, whatsapp: 0, share: 0, copy: 0 };
      rows.set(path, page);
    }
    return page;
  };
  for (const row of pages.rows || []) {
    const path = dimension(row, 0);
    if (!isPublicPath(path)) continue;
    const page = getPage(path);
    page.views = metric(row, 0);
    page.visitors = metric(row, 1);
  }
  for (const row of actions.rows || []) {
    const path = dimension(row, 0), event = dimension(row, 1);
    if (!isPublicPath(path)) continue;
    const action = (Object.keys(ACTION_EVENTS) as (keyof typeof ACTION_EVENTS)[]).find(key => ACTION_EVENTS[key] === event);
    if (action) getPage(path)[action] += metric(row, 0);
  }
  const warnings: string[] = [];
  if ([pages, actions].some(r => (r.rowCount || 0) > (r.rows?.length || 0))) {
    warnings.push("Page/action rows were limited to the top 10,000 per report. Site totals still cover the full date range.");
  }
  if (reports.some(r => r.metadata?.subjectToThresholding)) warnings.push("Google may withhold small counts for privacy (thresholding).");
  if (reports.some(r => r.metadata?.dataLossFromOtherRow)) warnings.push("Google grouped some high-cardinality data into an (other) row.");
  if (reports.some(r => r.metadata?.samplingMetadatas?.length)) warnings.push("Google sampled this report; counts are estimates.");
  return {
    generatedAt: new Date().toISOString(), timeZone: totals.metadata?.timeZone || "GA4 property timezone",
    rangeLabel: range.label,
    // Overall visitors come from GA directly, not the sum of visitors to each page.
    totals: { views: metric(totals.rows?.[0], 0), visitors: metric(totals.rows?.[0], 1), sessions: metric(totals.rows?.[0], 2) },
    pages: [...rows.values()].sort((a, b) => b.views - a.views || a.path.localeCompare(b.path)),
    daily: (daily.rows || []).map(row => ({ date: dimension(row, 0).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"), views: metric(row, 0), visitors: metric(row, 1) })),
    sources: (sources.rows || []).map(row => ({ source: dimension(row, 0), sessions: metric(row, 0) })),
    warnings,
  };
}
