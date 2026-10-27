import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getVolunteer, type Volunteer } from "./store";

const COOKIE = "vol_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.VOLUNTEER_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("VOLUNTEER_SESSION_SECRET must be set to a random string of 32+ characters.");
  }
  return new TextEncoder().encode(s);
}

export async function createSession(email: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

/**
 * Returns the logged-in volunteer, or null. The account is re-read from the store on every
 * call, so suspending or deleting someone takes effect immediately, even with a valid cookie.
 */
export async function getCurrentVolunteer(): Promise<Volunteer | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const v = await getVolunteer(payload.sub);
    return v && v.status === "active" ? v : null;
  } catch {
    return null;
  }
}
