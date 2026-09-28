export const ACTION_EVENTS = {
  apply: "tsc_apply_click",
  whatsapp: "tsc_whatsapp_click",
  share: "tsc_share_complete",
  copy: "tsc_copy_link",
} as const;

export type Action = keyof typeof ACTION_EVENTS;
export type PageKind = "Home" | "Scholarships" | "Articles" | "Categories" | "Countries" | "Other";
export type PageStats = {
  path: string; kind: PageKind; views: number; visitors: number;
  apply: number; whatsapp: number; share: number; copy: number;
};
export type AnalyticsReport = {
  generatedAt: string; timeZone: string; rangeLabel: string;
  totals: { views: number; visitors: number; sessions: number };
  pages: PageStats[];
  daily: { date: string; views: number; visitors: number }[];
  sources: { source: string; sessions: number }[];
  warnings: string[];
};

export function isPublicPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") &&
    !/^\/(studio|admin|api|_next)(\/|$)/.test(path);
}

export function pageKind(path: string): PageKind {
  if (path === "/") return "Home";
  if (/^\/scholarships(?:\/|$)/.test(path)) return "Scholarships";
  if (/^\/blog(?:\/|$)/.test(path)) return "Articles";
  if (/^\/categories(?:\/|$)/.test(path)) return "Categories";
  if (/^\/countries(?:\/|$)/.test(path)) return "Countries";
  return "Other";
}
