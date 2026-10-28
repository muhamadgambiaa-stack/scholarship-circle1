import "server-only";
import crypto from "node:crypto";
import { createClient } from "next-sanity";
import { SITE_NAME, SITE_URL } from "@/lib/volunteer/config";
import { escapeHtml } from "@/lib/volunteer/mail";

const DEFAULT_FROM = "newsletter@updates.thescholarshipcircle.com";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const normalizeEmail = (v: string) => v.trim().toLowerCase();

/** Same credentials as before, but created on demand so a missing variable cannot break the build. */
export function getNewsletterClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01",
    useCdn: false,
    token,
    perspective: "published",
  });
}

export function fromAddress() {
  const raw = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  return raw.includes("<") ? raw : `${SITE_NAME} <${raw}>`;
}

/** One document per address, so two simultaneous signups cannot create duplicates. */
export const subscriberId = (email: string) =>
  `subscriber-${crypto.createHash("sha256").update(normalizeEmail(email)).digest("hex").slice(0, 32)}`;

// ---- signed links: confirm (expires) and unsubscribe (does not expire) ----
function secret() {
  const s = process.env.NEWSLETTER_TOKEN_SECRET || process.env.VOLUNTEER_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("Set VOLUNTEER_SESSION_SECRET (or NEWSLETTER_TOKEN_SECRET) to 32+ random characters.");
  return s;
}
const mac = (purpose: string, email: string, exp: number) =>
  crypto.createHmac("sha256", secret()).update(`newsletter:${purpose}|${email}|${exp}`).digest("base64url");

export function signToken(purpose: "confirm" | "unsub", email: string, ttlSeconds?: number) {
  const e = normalizeEmail(email);
  const exp = ttlSeconds ? Math.floor(Date.now() / 1000) + ttlSeconds : 0;
  return `${Buffer.from(e).toString("base64url")}.${exp}.${mac(purpose, e, exp)}`;
}

export function verifyToken(purpose: "confirm" | "unsub", token: string): string | null {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expStr, sig] = parts;
  const email = Buffer.from(emailB64, "base64url").toString("utf8");
  const exp = Number(expStr);
  if (!Number.isInteger(exp) || exp < 0) return null;
  if (exp !== 0 && exp < Date.now() / 1000) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(mac(purpose, email, exp));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return EMAIL_PATTERN.test(email) ? email : null;
}

export function unsubscribeLinks(email: string) {
  const token = signToken("unsub", email);
  return {
    page: `${SITE_URL}/newsletter/unsubscribe?token=${token}`, // shown in the email body (asks to confirm)
    oneClick: `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`, // used by Gmail/Yahoo's Unsubscribe button
  };
}

/** Builds one newsletter email for one subscriber, with a working unsubscribe link and headers. */
export function buildNewsletterEmail(subject: string, message: string, to: string) {
  const links = unsubscribeLinks(to);
  const body = escapeHtml(message).replace(/\n/g, "<br>");
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1a1a1a">
    <h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
    <p style="line-height:1.6">${body}</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
    <p style="font-size:13px;color:#555">Visit <a href="${SITE_URL}">${SITE_NAME}</a></p>
    <p style="font-size:12px;color:#777">You receive this because you subscribed on ${SITE_URL.replace(/^https?:\/\//, "")}.
    <a href="${escapeHtml(links.page)}">Unsubscribe</a></p>
  </div>`;
  const text = `${subject}\n\n${message}\n\n--\nVisit ${SITE_URL}\nUnsubscribe: ${links.page}`;
  return {
    from: fromAddress(),
    to: [to],
    subject: subject.replace(/[\r\n]+/g, " ").trim(),
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${links.oneClick}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
