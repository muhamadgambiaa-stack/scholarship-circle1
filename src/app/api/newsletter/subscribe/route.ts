import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/volunteer/config";
import { sendNoReply } from "@/lib/volunteer/mail";
import { clientIp, rlBlocked, rlHit } from "@/lib/volunteer/store";
import { EMAIL_PATTERN, getNewsletterClient, normalizeEmail, signToken, subscriberId } from "@/lib/newsletter";

// Same answer whether or not the address is already on the list, so the form cannot be used
// to find out who subscribes.
const CHECK_INBOX = {
  success: true,
  message: "Almost done! We sent a confirmation email. Please open it and click the button to finish subscribing (check spam too).",
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(String(body?.email || ""));

    if (!EMAIL_PATTERN.test(email) || email.length > 200) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }

    const client = getNewsletterClient();
    if (!client || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Newsletter signup is not configured yet. Please try again later." },
        { status: 500 }
      );
    }

    // Abuse limits (if the limiter store is unreachable, signup still works).
    try {
      const ipKey = `nl-ip:${clientIp(request)}`;
      if (await rlBlocked(ipKey, 10)) {
        return NextResponse.json({ success: false, message: "Too many attempts. Please try again later." }, { status: 429 });
      }
      await rlHit(ipKey, 3600);
    } catch (e) {
      console.error("Newsletter limiter unavailable", e);
    }

    const existing = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{_id, status}`,
      { email }
    );

    if (existing?.status === "active") return NextResponse.json(CHECK_INBOX);

    const now = new Date().toISOString();
    if (!existing) {
      await client.createIfNotExists({
        _id: subscriberId(email),
        _type: "subscriber",
        email,
        status: "pending",
        subscribedAt: now,
      });
    } else if (existing.status === "unsubscribed") {
      await client.patch(existing._id).set({ status: "pending", subscribedAt: now }).commit();
    }

    // At most 3 confirmation emails per address per day, so nobody can be mail-bombed.
    try {
      const emailKey = `nl-confirm:${email}`;
      if (await rlBlocked(emailKey, 3)) return NextResponse.json(CHECK_INBOX);
      await rlHit(emailKey, 86400);
    } catch (e) {
      console.error("Newsletter limiter unavailable", e);
    }

    const token = signToken("confirm", email, 60 * 60 * 24 * 7);
    await sendNoReply({
      to: email,
      subject: "Confirm your subscription to The Scholarship Circle",
      heading: "One more step",
      paragraphs: [
        "Thanks for your interest in The Scholarship Circle. Please confirm your email address to start receiving scholarship and study-abroad updates.",
        "If you did not request this, you can ignore this email and you will not be subscribed.",
      ],
      button: { label: "Confirm my subscription", url: `${SITE_URL}/api/newsletter/confirm?token=${token}` },
    });

    return NextResponse.json(CHECK_INBOX);
  } catch (error) {
    console.error("Newsletter subscribe error", error);
    return NextResponse.json(
      { success: false, message: "We could not complete your subscription. Please try again later." },
      { status: 500 }
    );
  }
}
