import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { DUMMY_HASH, EMAIL_RE, clientIp, getVolunteer, normEmail, rlBlocked, rlHit, rlReset } from "@/lib/volunteer/store";
import { createSession } from "@/lib/volunteer/session";

const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normEmail(String(body?.email || ""));
    const password = String(body?.password || "");
    if (!EMAIL_RE.test(email) || !password || password.length > 200) {
      return fail("Enter your email and password.", 400);
    }

    const rlKey = `login:${clientIp(request)}:${email}`;
    if (await rlBlocked(rlKey, 8)) return fail("Too many attempts. Please try again in 15 minutes.", 429);

    const v = await getVolunteer(email);
    // Always run bcrypt so response time does not reveal whether the account exists.
    const ok = await bcrypt.compare(password, v?.passwordHash || DUMMY_HASH);
    if (!v || !v.passwordHash || !ok) {
      await rlHit(rlKey, 900);
      return fail("Incorrect email or password.", 401);
    }
    if (v.status === "suspended") {
      return fail("This account has been suspended. Please use the contact page if you think this is a mistake.", 403);
    }
    if (v.status !== "active") return fail("Please finish setting up your account using the link in your invitation email.", 403);

    await rlReset(rlKey);
    await createSession(v.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Volunteer login error", error);
    return fail("Login is not available right now. Please try again later.", 500);
  }
}
