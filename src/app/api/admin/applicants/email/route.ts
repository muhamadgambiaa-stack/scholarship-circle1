import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/volunteer/admin-auth";
import { sendApplicantMessage } from "@/lib/volunteer/mail";
import { EMAIL_RE, normEmail } from "@/lib/volunteer/store";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const to = normEmail(String(body?.to || ""));
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!EMAIL_RE.test(to)) return NextResponse.json({ success: false, message: "Valid recipient email required." }, { status: 400 });
    if (!subject || subject.length > 150) return NextResponse.json({ success: false, message: "Subject is required (150 characters max)." }, { status: 400 });
    if (!message || message.length > 5000) return NextResponse.json({ success: false, message: "Message is required (5000 characters max)." }, { status: 400 });

    await sendApplicantMessage(to, subject, message);
    return NextResponse.json({ success: true, message: `Email sent to ${to}.` });
  } catch (error) {
    console.error("Applicant email error", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Could not send the email." }, { status: 500 });
  }
}
