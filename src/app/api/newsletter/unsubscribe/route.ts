import { NextResponse } from "next/server";
import { getNewsletterClient, verifyToken } from "@/lib/newsletter";

// A normal click on the link in an email only OPENS a confirmation page. Nothing changes on GET,
// so email security scanners that pre-open links cannot unsubscribe anyone by accident.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const target = token ? `/newsletter/unsubscribe?token=${encodeURIComponent(token)}` : "/newsletter/unsubscribe?legacy=1";
  return NextResponse.redirect(new URL(target, request.url));
}

// Used by the confirmation page button and by Gmail/Yahoo's one-click "Unsubscribe" button.
export async function POST(request: Request) {
  try {
    let token = new URL(request.url).searchParams.get("token") || "";
    if (!token) {
      const body = await request.json().catch(() => null);
      token = String(body?.token || "");
    }

    const email = verifyToken("unsub", token);
    if (!email) {
      return NextResponse.json({ success: false, message: "This unsubscribe link is not valid." }, { status: 400 });
    }

    const client = getNewsletterClient();
    if (!client) {
      return NextResponse.json({ success: false, message: "Unsubscribe is not available right now." }, { status: 500 });
    }

    const subscriber = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{_id, status}`,
      { email }
    );
    if (subscriber && subscriber.status !== "unsubscribed") {
      await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
    }
    return NextResponse.json({ success: true, message: "You have been unsubscribed." });
  } catch (error) {
    console.error("Newsletter unsubscribe error", error);
    return NextResponse.json(
      { success: false, message: "Could not complete unsubscribe. Please try again later." },
      { status: 500 }
    );
  }
}
