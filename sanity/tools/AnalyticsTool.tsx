"use client";

import { useEffect, useMemo, useState } from "react";
import { useClient, useCurrentUser } from "sanity";
import type { AnalyticsReport, PageStats } from "../../src/lib/analytics/shared";
import styles from "./AnalyticsTool.module.css";

const number = (n: number) => n.toLocaleString();
const kinds = ["All pages", "Home", "Scholarships", "Articles", "Categories", "Countries", "Other"];
type Sort = "views" | "visitors" | "apply" | "whatsapp" | "share" | "copy";

export default function AnalyticsTool() {
  const client = useClient({ apiVersion: "2024-07-01" });
  const user = useCurrentUser();
  const [period, setPeriod] = useState("30");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [query, setQuery] = useState("days=30");
  const [refresh, setRefresh] = useState(0);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("All pages");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("views");
  const [page, setPage] = useState(0);
  const [titles, setTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setReport(null);
    async function load() {
      const token = client.config().token;
      if (!token) throw new Error("Please sign out of Sanity and sign in again to enable the secure analytics connection.");
      const response = await fetch(`/api/admin/analytics?${query}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load analytics.");
      if (!controller.signal.aborted) setReport(data);
    }
    load().catch(reason => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Unable to load analytics.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [client, query, refresh]);

  useEffect(() => { setPage(0); }, [kind, search, sort, report]);

  useEffect(() => {
    let active = true;
    // Reuse existing published Sanity content; analytics never writes to the CMS.
    client.fetch<{ _type: string; title?: string; name?: string; slug: string }[]>(
      '*[_type in ["scholarship", "post", "category", "country"] && !(_id in path("drafts.**")) && defined(slug.current)]{_type,title,name,"slug":slug.current}'
    ).then(items => {
      const names: Record<string, string> = { "/": "Home", "/scholarships": "All scholarships", "/blog": "Articles & guides", "/categories": "All categories", "/countries": "All countries" };
      const prefixes: Record<string, string> = { scholarship: "scholarships", post: "blog", category: "categories", country: "countries" };
      for (const item of items) names[`/${prefixes[item._type]}/${item.slug}`] = item.title || item.name || item.slug;
      if (active) setTitles(names);
    }).catch(() => { /* Paths remain readable if content titles are unavailable. */ });
    return () => { active = false; };
  }, [client]);

  const filtered = useMemo(() => (report?.pages || []).filter(row =>
    (kind === "All pages" || row.kind === kind) &&
    `${titles[row.path] || ""} ${row.path}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b[sort] - a[sort] || a.path.localeCompare(b.path)), [report, kind, search, sort, titles]);
  const visible = filtered.slice(page * 25, (page + 1) * 25);
  const pages = Math.max(1, Math.ceil(filtered.length / 25));
  const actions = report?.pages.reduce((sum, row) => ({ apply: sum.apply + row.apply, whatsapp: sum.whatsapp + row.whatsapp, share: sum.share + row.share, copy: sum.copy + row.copy }), { apply: 0, whatsapp: 0, share: 0, copy: 0 });
  const maxViews = Math.max(1, ...(report?.daily.map(row => row.views) || []));

  function exportCSV() {
    const safeCell = (value: string | number) => {
      const text = String(value);
      return `"${(/^(\s*[=+@\-]|[\t\r])/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
    };
    const rows = [["Page", "Path", "Type", "Views", "Visitors", "Apply clicks", "WhatsApp clicks", "Native share completions", "Copies"], ...filtered.map(row => [titles[row.path] || row.path, row.path, row.kind, row.views, row.visitors, row.apply, row.whatsapp, row.share, row.copy])];
    const url = URL.createObjectURL(new Blob([rows.map(row => row.map(safeCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "scholarship-circle-analytics.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className={styles.root}>
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}>THE SCHOLARSHIP CIRCLE · PRIVATE</p><h1>Website analytics</h1><p>See which opportunities readers discover and act on.</p></div>
      <button type="button" disabled={loading} onClick={() => setRefresh(n => n + 1)}>Refresh report</button>
    </header>

    <form className={styles.filters} onSubmit={event => {
      event.preventDefault();
      setQuery(period === "custom" ? new URLSearchParams({ start, end }).toString() : `days=${period}`);
      setRefresh(n => n + 1);
    }}>
      <label>Date range<select value={period} onChange={event => setPeriod(event.target.value)}>
        <option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="custom">Custom dates</option>
      </select></label>
      {period === "custom" && <><label>From<input required type="date" value={start} onChange={e => setStart(e.target.value)} /></label><label>Through<input required type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} /></label></>}
      <button type="submit" disabled={loading}>Show report</button>
    </form>

    {loading && <p role="status" className={styles.notice}>Loading your private report…</p>}
    {error && <div role="alert" className={styles.error}><strong>Report unavailable</strong><p>{error}</p><p>Your Sanity user ID: <code>{user?.id || "Sign in first"}</code></p></div>}

    {report && <>
      <p className={styles.muted}>{report.rangeLabel} · {report.timeZone} · Retrieved {new Date(report.generatedAt).toLocaleString()}. Reports are cached for 5 minutes; GA4 processing can take 24–48 hours.</p>
      {report.warnings.map(warning => <p className={styles.notice} key={warning}>{warning}</p>)}
      <section className={styles.metrics} aria-label="Site totals">
        {[["Page views", report.totals.views], ["Visitors (GA4 total users)", report.totals.visitors], ["Sessions", report.totals.sessions], ["Apply clicks", actions?.apply || 0], ["WhatsApp clicks", actions?.whatsapp || 0], ["Native share completions", actions?.share || 0], ["Copies", actions?.copy || 0]].map(([label, value]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{number(Number(value))}</strong></div>)}
      </section>
      {!report.pages.length && <div className={styles.notice}>No recorded page data for this period. Check the GA4 property, production hostname and published Tag Manager configuration. Earlier visits cannot be recovered if tracking was not enabled.</div>}

      <section className={styles.panel}>
        <h2>Daily page views</h2>
        <div className={styles.chart} role="img" aria-label="Daily page views. Exact counts are available in the daily data table below.">
          {report.daily.map(day => <div key={day.date} className={styles.barColumn} title={`${day.date}: ${number(day.views)} views`}><div className={styles.bar} style={{ height: `${day.views / maxViews * 100}%` }} /></div>)}
        </div>
        <details><summary>View daily counts</summary><div className={styles.tableScroll}><table><thead><tr><th>Date</th><th>Views</th><th>Visitors</th></tr></thead><tbody>{report.daily.map(day => <tr key={day.date}><th>{day.date}</th><td>{number(day.views)}</td><td>{number(day.visitors)}</td></tr>)}</tbody></table></div></details>
      </section>

      <section className={styles.panel}>
        <h2>Every page</h2>
        <p className={styles.muted}>Each scholarship, article, category and country page is listed by its URL. Page visitors overlap; do not add them to calculate site visitors.</p>
        <div className={styles.filters}>
          <label>Page type<select value={kind} onChange={e => setKind(e.target.value)}>{kinds.map(k => <option key={k}>{k}</option>)}</select></label>
          <label>Find a page<input type="search" placeholder="Title or URL…" value={search} onChange={e => setSearch(e.target.value)} /></label>
          <label>Sort by<select value={sort} onChange={e => setSort(e.target.value as Sort)}>{[["views", "Views"], ["visitors", "Visitors"], ["apply", "Apply clicks"], ["whatsapp", "WhatsApp clicks"], ["share", "Native shares"], ["copy", "Copies"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <button type="button" onClick={exportCSV} disabled={!filtered.length}>Export CSV</button>
        </div>
        <div className={styles.tableScroll}><table><caption className={styles.caption}>{number(filtered.length)} pages with recorded activity</caption><thead><tr><th>Page</th><th>Views</th><th>Visitors</th><th>Apply clicks</th><th>WhatsApp clicks</th><th>Native shares</th><th>Copies</th></tr></thead><tbody>
          {visible.map((row: PageStats) => <tr key={row.path}><th><a href={`https://thescholarshipcircle.com${row.path}`} target="_blank" rel="noopener noreferrer">{titles[row.path] || row.path}</a><small>{row.kind} · {row.path}</small></th><td>{number(row.views)}</td><td>{number(row.visitors)}</td><td>{number(row.apply)}</td><td>{number(row.whatsapp)}</td><td>{number(row.share)}</td><td>{number(row.copy)}</td></tr>)}
          {!visible.length && <tr><td colSpan={7}>No pages match these filters.</td></tr>}
        </tbody></table></div>
        <div className={styles.pagination}><button disabled={page === 0} onClick={() => setPage(n => n - 1)}>Previous</button><span>Page {page + 1} of {pages}</span><button disabled={page + 1 >= pages} onClick={() => setPage(n => n + 1)}>Next</button></div>
      </section>

      <section className={styles.panel}><h2>Top 20 traffic sources</h2><p className={styles.muted}>Source / medium for sessions that included public pages. Direct traffic means Google could not identify a referring source.</p><div className={styles.tableScroll}><table><thead><tr><th>Source / medium</th><th>Sessions</th></tr></thead><tbody>{report.sources.map(row => <tr key={row.source}><th>{row.source}</th><td>{number(row.sessions)}</td></tr>)}{!report.sources.length && <tr><td colSpan={2}>No traffic sources recorded yet.</td></tr>}</tbody></table></div></section>
      <p className={styles.muted}>WhatsApp and Apply counts measure clicks, not messages sent or applications submitted. Native shares count resolved browser share requests, which do not confirm delivery. Copies count successful clipboard writes. Consent choices and blockers can reduce recorded counts. Action counts begin after the new GTM event tag is published.</p>
    </>}
  </div>;
}
