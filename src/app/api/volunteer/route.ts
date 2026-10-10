import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTRIBUTION_AREAS = [
  "Scholarship research and verification",
  "Writing and editing scholarship articles",
  "Social media and content creation",
  "Graphic design and visual content",
  "Website and technology",
  "Community management",
  "Marketing and growth",
  "Partnerships and outreach",
  "Other",
] as const;

const AVAILABILITY_OPTIONS = [
  "A few hours per week",
  "5-10 hours per week",
  "More than 10 hours per week",
  "Flexible, depending on the task",
] as const;

const ROLE_OPTIONS = ["Student", "Graduate", "Professional", "Other"] as const;

const MAX_BODY_BYTES = 32 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  fullName?: unknown;
  email?: unknown;
  country?: unknown;
  currentRole?: unknown;
  skills?: unknown;
  motivation?: unknown;
  ideas?: unknown;
  contributions?: unknown;
  availability?: unknown;
  additionalInfo?: unknown;
  _website?: unknown;
};

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function cleanString(v: unknown, max: number): string | null {
  if (!isString(v)) return null;
  const s = v.trim();
  if (s.length === 0 || s.length > max) return null;
  return s;
}

function allowlist<T extends readonly string[]>(
  v: unknown,
  list: T,
): T[number] | null {
  if (!isString(v)) return null;
  return (list as readonly string[]).includes(v) ? (v as T[number]) : null;
}

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return jsonError(413, "Request too large.");
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return jsonError(400, "Could not read request body.");
  }
  if (raw.length > MAX_BODY_BYTES) {
    return jsonError(413, "Request too large.");
  }

  let body: Payload;
  try {
    body = JSON.parse(raw) as Payload;
  } catch {
    return jsonError(400, "Malformed JSON.");
  }

  if (isString(body._website) && body._website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fullName = cleanString(body.fullName, 120);
  const emailRaw = cleanString(body.email, 200);
  const country = cleanString(body.country, 100);
  const skills = cleanString(body.skills, 3000);
  const motivation = cleanString(body.motivation, 3000);
  const ideas = cleanString(body.ideas, 3000);
  const additionalInfo =
    body.additionalInfo === undefined ||
    body.additionalInfo === null ||
    body.additionalInfo === ""
      ? ""
      : cleanString(body.additionalInfo, 2000);

  const currentRole = allowlist(body.currentRole, ROLE_OPTIONS);
  const availability = allowlist(body.availability, AVAILABILITY_OPTIONS);

  if (
    !fullName ||
    !emailRaw ||
    !country ||
    !skills ||
    skills.length < 20 ||
    !motivation ||
    motivation.length < 20 ||
    !ideas ||
    ideas.length < 10 ||
    !currentRole ||
    !availability ||
    additionalInfo === null
  ) {
    return jsonError(400, "Please fill in all required fields correctly.");
  }

  if (!EMAIL_RE.test(emailRaw)) {
    return jsonError(400, "Please provide a valid email address.");
  }

  if (!Array.isArray(body.contributions) || body.contributions.length === 0) {
    return jsonError(400, "Please select at least one contribution area.");
  }
  if (body.contributions.length > CONTRIBUTION_AREAS.length) {
    return jsonError(400, "Too many contribution areas selected.");
  }
  const contributions: string[] = [];
  for (const c of body.contributions) {
    if (!isString(c)) {
      return jsonError(400, "Invalid contribution area.");
    }
    if (!(CONTRIBUTION_AREAS as readonly string[]).includes(c)) {
      return jsonError(400, "Invalid contribution area.");
    }
    if (!contributions.includes(c)) contributions.push(c);
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01";

  if (!writeToken || !projectId) {
    console.error(
      "[volunteer] Server is missing SANITY_API_WRITE_TOKEN or NEXT_PUBLIC_SANITY_PROJECT_ID.",
    );
    return jsonError(500, "We could not submit your application right now.");
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
  });

  try {
    await writeClient.create({
      _type: "volunteerApplication",
      fullName,
      email: emailRaw,
      country,
      currentRole,
      skills,
      motivation,
      ideas,
      contributions,
      availability,
      additionalInfo,
      status: "New",
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(
      "[volunteer] Sanity write failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return jsonError(500, "We could not submit your application right now.");
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return jsonError(405, "Method not allowed.");
}
