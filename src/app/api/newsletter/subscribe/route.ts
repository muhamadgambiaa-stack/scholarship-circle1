import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "newsletter@updates.thescholarshipcircle.com";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01",
    useCdn: false,
    token,
    perspective: "published",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email || "");

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const client = getSanityWriteClient();
    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Newsletter signup is not configured yet. Please add Sanity write credentials and Resend settings.",
        },
        { status: 500 }
      );
    }

    const existingSubscriber = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{_id, status}`,
      { email }
    );

    if (existingSubscriber?.status === "active") {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed." },
        { status: 409 }
      );
    }

    if (existingSubscriber && existingSubscriber.status === "unsubscribed") {
      await client
        .patch(existingSubscriber._id)
        .set({ status: "active", subscribedAt: new Date().toISOString() })
        .commit();

      return NextResponse.json({ success: true, message: "You are subscribed again." });
    }

    await client.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
      status: "active",
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: `The Scholarship Circle <${process.env.RESEND_FROM_EMAIL || DEFAULT_FROM}>`,
        to: [email],
        subject: "Welcome to The Scholarship Circle",
        html: `<p>Hello,</p><p>Thanks for subscribing to The Scholarship Circle. You will now receive updates about scholarships and study-abroad opportunities.</p><p>To unsubscribe at any time, visit <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thescholarshipcircle.com"}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}">this link</a>.</p>`,
        text: `Hello,\n\nThanks for subscribing to The Scholarship Circle. You will now receive updates about scholarships and study-abroad opportunities.\n\nTo unsubscribe at any time, visit ${process.env.NEXT_PUBLIC_SITE_URL || "https://thescholarshipcircle.com"}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
      });
    }

    return NextResponse.json({ success: true, message: "Thanks for subscribing!" });
  } catch (error) {
    console.error("Newsletter subscribe error", error);
    return NextResponse.json(
      { success: false, message: "We could not complete your subscription. Please try again later." },
      { status: 500 }
    );
  }
}
