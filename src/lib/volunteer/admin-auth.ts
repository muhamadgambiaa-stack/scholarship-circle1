import "server-only";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rlBlocked, rlHit } from "./store";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

/** Returns null when the request carries the right admin key, otherwise the error response to return. */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const expected = (process.env.ADMIN_KEY || process.env.NEWSLETTER_ADMIN_KEY || "").trim();
  if (!expected) {
    return NextResponse.json({ success: false, message: "Admin access is not configured (set ADMIN_KEY)." }, { status: 503 });
  }

  const rlKey = `adminfail:${clientIp(request)}`;
  let limiterOk = true;
  try {
    if (await rlBlocked(rlKey, 10)) {
      return NextResponse.json({ success: false, message: "Too many attempts. Try again later." }, { status: 429 });
    }
  } catch {
    limiterOk = false; // store not configured yet; still enforce the key itself
  }

  const provided = (request.headers.get("x-admin-key") || "").trim();
  if (provided && crypto.timingSafeEqual(sha(provided), sha(expected))) return null;

  if (limiterOk) await rlHit(rlKey, 900).catch(() => {});
  return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
}
