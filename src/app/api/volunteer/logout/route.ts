import { NextResponse } from "next/server";
import { clearSession } from "@/lib/volunteer/session";

export async function POST() {
  clearSession();
  return NextResponse.json({ success: true });
}
