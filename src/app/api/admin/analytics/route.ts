import { NextResponse } from "next/server";
import { AnalyticsError, parseRange } from "@/lib/analytics/report";
import { getAnalyticsReport, requireAnalyticsAdmin } from "@/lib/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "Vary": "Authorization", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  try {
    // Always authorize before reading even a cached report.
    await requireAnalyticsAdmin(request);
    const report = await getAnalyticsReport(parseRange(new URL(request.url).searchParams));
    return NextResponse.json(report, { headers });
  } catch (error) {
    // Never return/log upstream errors: they can contain credentials and request headers.
    return NextResponse.json({ error: error instanceof AnalyticsError ? error.message : "Analytics is temporarily unavailable. Check the server configuration and try again." }, {
      status: error instanceof AnalyticsError ? error.status : 502, headers,
    });
  }
}
