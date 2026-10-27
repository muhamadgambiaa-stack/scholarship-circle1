import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/volunteer/admin-auth";
import { listSubmissionRecords } from "@/lib/volunteer/store";
import { submissionStatuses } from "@/lib/volunteer/sanity";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const records = await listSubmissionRecords();
    const statuses = await submissionStatuses(records.map((r) => r.id));
    return NextResponse.json({
      success: true,
      submissions: records.map((r) => ({ ...r, status: statuses[r.id] ?? "pending" })),
    });
  } catch (error) {
    console.error("Admin submissions error", error);
    return NextResponse.json({ success: false, message: "Could not load submissions." }, { status: 500 });
  }
}
