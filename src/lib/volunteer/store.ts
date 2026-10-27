import "server-only";
import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

export type VolunteerStatus = "invited" | "active" | "suspended";

export interface Volunteer {
  id: string;
  email: string;
  name: string;
  status: VolunteerStatus;
  passwordHash?: string;
  createdAt: string;
  suspendedAt?: string;
  suspendedReason?: string;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Valid bcrypt hash used so a login for an unknown email takes as long as a real one.
export const DUMMY_HASH = "$2a$12$ZveKPFOppUjXwcqjzKUtLezspsTo2ncK0GFRcmPwtSHjWp/hEw61O";

export const normEmail = (v: string) => v.trim().toLowerCase();

let client: Redis | null = null;
function db(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Volunteer store is not configured: connect an Upstash Redis database in Vercel Storage.");
  }
  client = new Redis({ url, token });
  return client;
}

const vKey = (email: string) => `vol:${email}`;
const INDEX = "vol:index";

export async function getVolunteer(email: string): Promise<Volunteer | null> {
  return (await db().get<Volunteer>(vKey(normEmail(email)))) ?? null;
}

export async function saveVolunteer(v: Volunteer) {
  const r = db();
  await r.set(vKey(v.email), v);
  await r.sadd(INDEX, v.email);
}

export async function deleteVolunteer(email: string) {
  const r = db();
  await r.del(vKey(normEmail(email)));
  await r.srem(INDEX, normEmail(email));
}

export async function listVolunteers(): Promise<Volunteer[]> {
  const r = db();
  const emails = (await r.smembers(INDEX)) as string[];
  if (!emails.length) return [];
  const rows = await r.mget<(Volunteer | null)[]>(...emails.map(vKey));
  return rows
    .filter((v): v is Volunteer => !!v)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---- one-time links (invite / password reset). Only a hash of the token is stored. ----
const tokenKey = (token: string) =>
  `voltoken:${crypto.createHash("sha256").update(token).digest("hex")}`;

export async function createLinkToken(email: string, ttlSeconds = 60 * 60 * 48) {
  const token = crypto.randomBytes(32).toString("base64url");
  await db().set(tokenKey(token), normEmail(email), { ex: ttlSeconds });
  return token;
}

export async function consumeLinkToken(token: string): Promise<string | null> {
  if (!token || token.length > 200) return null;
  const email = await db().getdel<string>(tokenKey(token));
  return typeof email === "string" ? email : null;
}

// ---- tiny rate limiter: check first, count only failures/attempts you choose ----
export async function rlBlocked(key: string, max: number) {
  const n = await db().get<number>(`rl:${key}`);
  return (n ?? 0) >= max;
}
export async function rlHit(key: string, windowSeconds: number) {
  const r = db();
  const n = await r.incr(`rl:${key}`);
  if (n === 1) await r.expire(`rl:${key}`, windowSeconds);
}
export async function rlReset(key: string) {
  await db().del(`rl:${key}`);
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
