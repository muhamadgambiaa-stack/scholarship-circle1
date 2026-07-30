import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: "Subject and message are required." },
        { status: 400 }
      );
    }

    const subscribers: { email: string }[] = await client.fetch(
      `*[_type == "subscriber" && status == "active"]{
        email
      }`
    );

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No active subscribers found.",
      });
    }

    let sent = 0;

    for (const subscriber of subscribers) {
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "newsletter@updates.thescholarshipcircle.com",
        to: subscriber.email,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
            <h2>${subject}</h2>
            <p>${message.replace(/\n/g, "<br>")}</p>

            <hr>

            <p>
              Visit
              <a href="https://thescholarshipcircle.com">
                The Scholarship Circle
              </a>
            </p>
          </div>
        `,
      });

      sent++;
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sent} subscribers.`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send newsletter.",
      },
      { status: 500 }
    );
  }
}