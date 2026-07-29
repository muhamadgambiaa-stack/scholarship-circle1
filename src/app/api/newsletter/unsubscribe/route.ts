import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = normalizeEmail(searchParams.get("email") || "");

  if (!email) {
    return NextResponse.json({ success: false, message: "Missing email address." }, { status: 400 });
  }

  const client = getSanityWriteClient();
  if (!client) {
    return NextResponse.json(
      { success: false, message: "Unsubscribe is not configured yet." },
      { status: 500 }
    );
  }

  try {
    const subscriber = await client.fetch<{ _id: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{_id}`,
      { email }
    );

    if (!subscriber) {
      return NextResponse.json({ success: false, message: "No subscription was found for that email." }, { status: 404 });
    }

    await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();

    return NextResponse.json({ success: true, message: "You have been unsubscribed." });
  } catch (error) {
    console.error("Newsletter unsubscribe error", error);
    return NextResponse.json(
      { success: false, message: "Could not complete unsubscribe. Please try again later." },
      { status: 500 }
    );
  }
}
