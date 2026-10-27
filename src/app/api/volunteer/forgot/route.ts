import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/volunteer/config";
import { sendPasswordReset } from "@/lib/volunteer/mail";
import { EMAIL_RE, clientIp, createLinkToken, getVolunteer, normEmail, rlBlocked, rlHit } from "@/lib/volunteer/store";

// Always answers the same way so the form cannot be used to discover who has an account.
const GENERIC = { success: true, message: "If that email belongs to a volunteer account, a reset link is on its way." };

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normEmail(String(body?.email || ""));
    if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });

    const ipKey = `forgot-ip:${clientIp(request)}`;
    const emailKey = `forgot-email:${email}`;
    if ((await rlBlocked(ipKey, 10)) || (await rlBlocked(emailKey, 3))) return NextResponse.json(GENERIC);
    await rlHit(ipKey, 3600);
    await rlHit(emailKey, 3600);

    const v = await getVolunteer(email);
    if (v && v.status !== "suspended") {
      const token = await createLinkToken(v.email);
      await sendPasswordReset(v.email, v.name, `${SITE_URL}/volunteer/setup?token=${token}`).catch((e) =>
        console.error("Reset email failed", e)
      );
    }
    return NextResponse.json(GENERIC);
  } catch (error) {
    console.error("Volunteer forgot error", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
