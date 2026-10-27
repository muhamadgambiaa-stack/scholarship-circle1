import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { consumeLinkToken, getVolunteer, saveVolunteer } from "@/lib/volunteer/store";
import { createSession } from "@/lib/volunteer/session";

const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = String(body?.token || "");
    const password = String(body?.password || "");

    // Validate the password BEFORE using up the one-time link.
    if (password.length < 10) return fail("Your password must be at least 10 characters.", 400);
    if (Buffer.byteLength(password) > 72) return fail("Your password is too long (72 bytes maximum).", 400);

    const email = await consumeLinkToken(token);
    const v = email ? await getVolunteer(email) : null;
    if (!v || v.status === "suspended") {
      return fail("This link is invalid or has expired. Ask for a new one from the 'Forgot password' page.", 400);
    }

    v.passwordHash = await bcrypt.hash(password, 12);
    v.status = "active";
    await saveVolunteer(v);
    await createSession(v.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Volunteer setup error", error);
    return fail("We could not save your password. Please try again.", 500);
  }
}
