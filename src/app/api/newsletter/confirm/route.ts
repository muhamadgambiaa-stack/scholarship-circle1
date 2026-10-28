import { NextResponse } from "next/server";
import { getNewsletterClient, verifyToken } from "@/lib/newsletter";

const to = (request: Request, status: "ok" | "invalid") =>
  NextResponse.redirect(new URL(`/newsletter/confirmed?status=${status}`, request.url));

export async function GET(request: Request) {
  try {
    const email = verifyToken("confirm", new URL(request.url).searchParams.get("token") || "");
    const client = getNewsletterClient();
    if (!email || !client) return to(request, "invalid");

    const subscriber = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{_id, status}`,
      { email }
    );
    if (!subscriber) return to(request, "invalid");

    if (subscriber.status !== "active") {
      await client.patch(subscriber._id).set({ status: "active", subscribedAt: new Date().toISOString() }).commit();
    }
    return to(request, "ok");
  } catch (error) {
    console.error("Newsletter confirm error", error);
    return to(request, "invalid");
  }
}
