import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/volunteer/admin-auth";
import { rlBlocked, rlHit } from "@/lib/volunteer/store";
import { EMAIL_PATTERN, buildNewsletterEmail, getNewsletterClient, normalizeEmail } from "@/lib/newsletter";

export const maxDuration = 60; // seconds; large lists are sent in batches

const CHUNK = 100; // Resend allows up to 100 emails per batch call
const PAUSE_MS = 600; // Resend's default limit is 2 requests per second
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const json = (data: Record<string, unknown>, status = 200) => NextResponse.json(data, { status });

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const testEmail = typeof body?.testEmail === "string" ? normalizeEmail(body.testEmail) : "";

    if (!subject || !message) return json({ success: false, message: "Subject and message are required." }, 400);
    if (subject.length > 150) return json({ success: false, message: "Subject is too long (150 characters max)." }, 400);
    if (message.length > 20000) return json({ success: false, message: "Message is too long (20000 characters max)." }, 400);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return json({ success: false, message: "RESEND_API_KEY is not set." }, 500);
    const resend = new Resend(apiKey); // created here, not at import time, so a missing key cannot break the build

    // ---- test send: one email, to the address you typed ----
    if (testEmail) {
      if (!EMAIL_PATTERN.test(testEmail)) return json({ success: false, message: "Enter a valid test email address." }, 400);
      const { error } = await resend.emails.send(buildNewsletterEmail(`[TEST] ${subject}`, message, testEmail));
      if (error) return json({ success: false, message: `Test failed: ${error.message}` }, 502);
      return json({ success: true, message: `Test email sent to ${testEmail}. Check the inbox AND spam folder.` });
    }

    // ---- real send ----
    // Stops an accidental double click from emailing everyone twice.
    try {
      if (await rlBlocked("nl-send", 1)) {
        return json({ success: false, message: "A newsletter was already sent in the last minute. Wait a minute before sending again." }, 429);
      }
      await rlHit("nl-send", 60);
    } catch (e) {
      console.error("Send limiter unavailable", e);
    }

    const client = getNewsletterClient();
    if (!client) return json({ success: false, message: "Sanity credentials are missing." }, 500);

    const rows: { email: string }[] = await client.fetch(`*[_type == "subscriber" && status == "active"]{ email }`);
    const recipients = [...new Set(rows.map((r) => normalizeEmail(r.email || "")).filter((e) => EMAIL_PATTERN.test(e)))];
    if (recipients.length === 0) return json({ success: false, message: "No active subscribers found." });

    let sent = 0;
    let failed = 0;
    let firstError = "";

    for (let i = 0; i < recipients.length; i += CHUNK) {
      const chunk = recipients.slice(i, i + CHUNK);
      try {
        // Resend reports problems in { error } instead of throwing, so it must be checked.
        const { error } = await resend.batch.send(chunk.map((to) => buildNewsletterEmail(subject, message, to)));
        if (error) {
          failed += chunk.length;
          firstError ||= error.message;
        } else {
          sent += chunk.length;
        }
      } catch (e) {
        failed += chunk.length;
        firstError ||= e instanceof Error ? e.message : "Unknown error";
      }
      if (i + CHUNK < recipients.length) await sleep(PAUSE_MS);
    }

    if (sent === 0) return json({ success: false, message: `Nothing was sent. ${firstError}` }, 502);
    return json({
      success: true,
      message:
        failed === 0
          ? `Newsletter sent to ${sent} subscribers.`
          : `Newsletter sent to ${sent} of ${recipients.length} subscribers. ${failed} failed (${firstError}).`,
    });
  } catch (error) {
    console.error("Newsletter send error", error);
    return json({ success: false, message: "Failed to send newsletter." }, 500);
  }
}
