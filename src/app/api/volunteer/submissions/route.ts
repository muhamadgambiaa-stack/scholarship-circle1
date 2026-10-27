import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { SUBMISSION_CATEGORIES } from "@/lib/volunteer/config";
import { getCurrentVolunteer } from "@/lib/volunteer/session";
import { rlBlocked, rlHit } from "@/lib/volunteer/store";
import { listSubmissions, sanityWrite } from "@/lib/volunteer/sanity";

const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

export async function GET() {
  const v = await getCurrentVolunteer();
  if (!v) return fail("Please log in.", 401);
  try {
    return NextResponse.json({ success: true, submissions: await listSubmissions(v.id) });
  } catch (error) {
    console.error("List submissions error", error);
    return fail("Could not load your submissions.", 500);
  }
}

export async function POST(request: Request) {
  const v = await getCurrentVolunteer();
  if (!v) return fail("Please log in.", 401);

  try {
    const body = await request.json().catch(() => ({}));
    const title = String(body?.title || "").trim();
    const category = String(body?.category || "");
    const text = String(body?.body || "").trim();
    const link = String(body?.link || "").trim();

    if (title.length < 5 || title.length > 150) return fail("Title must be 5 to 150 characters.", 400);
    if (!SUBMISSION_CATEGORIES.some((c) => c.value === category)) return fail("Choose a category.", 400);
    if (text.length < 20 || text.length > 8000) return fail("Content must be 20 to 8000 characters.", 400);
    if (link) {
      let ok = false;
      try {
        const u = new URL(link);
        ok = (u.protocol === "https:" || u.protocol === "http:") && link.length <= 500;
      } catch {}
      if (!ok) return fail("The link must be a valid http(s) address.", 400);
    }

    const rlKey = `submit:${v.id}`;
    if (await rlBlocked(rlKey, 10)) return fail("You have reached the limit of 10 submissions per hour.", 429);
    await rlHit(rlKey, 3600);

    await sanityWrite().create({
      _id: `drafts.vsub-${randomUUID()}`, // draft = not publicly readable until an admin publishes it
      _type: "volunteerSubmission",
      title,
      category,
      body: text,
      ...(link ? { link } : {}),
      volunteerId: v.id,
      volunteerName: v.name,
    });
    return NextResponse.json({ success: true, message: "Submitted. Our team will review it before anything is published." });
  } catch (error) {
    console.error("Create submission error", error);
    return fail("We could not save your submission. Please try again.", 500);
  }
}
