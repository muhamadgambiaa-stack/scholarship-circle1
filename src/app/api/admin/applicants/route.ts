import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/volunteer/admin-auth";
import { listApplicants } from "@/lib/volunteer/sanity";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, applicants: await listApplicants() });
  } catch (error) {
    console.error("List applicants error", error);
    return NextResponse.json({ success: false, message: "Could not read applications from Sanity." }, { status: 500 });
  }
}
