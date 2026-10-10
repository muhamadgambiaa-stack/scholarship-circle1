import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORGANIZATION_TYPES = [
  "University",
  "Scholarship provider",
  "NGO / non-profit",
  "Government body",
  "Private company",
  "Other",
] as const;

const MAX_BODY_BYTES = 48 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/.+\..+/i;

type Payload = {
  organizationName?: unknown;
  organizationType?: unknown;
  website?: unknown;
  country?: unknown;
  contactName?: unknown;
  contactRole?: unknown;
  contactEmail?: unknown;
  phone?: unknown;
  publishRequest?: unknown;
  scholarshipLink?: unknown;
  deadline?: unknown;
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

function optionalString(v: unknown, max: number): string | null {
  if (v === undefined || v === null || v === "") return "";
  if (!isString(v)) return null;
  const s = v.trim();
  if (s.length === 0) return "";
  if (s.length > max) return null;
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

  const organizationName = cleanString(body.organizationName, 200);
  const country = cleanString(body.country, 100);
  const contactName = cleanString(body.contactName, 150);
  const contactEmailRaw = cleanString(body.contactEmail, 200);
  const publishRequest = cleanString(body.publishRequest, 5000);
  const websiteRaw = cleanString(body.website, 500);

  const organizationType = allowlist(body.organizationType, ORGANIZATION_TYPES);

  const contactRole = optionalString(body.contactRole, 150);
  const phone = optionalString(body.phone, 50);
  const scholarshipLinkRaw = optionalString(body.scholarshipLink, 500);
  const deadline = optionalString(body.deadline, 30);
  const additionalInfo = optionalString(body.additionalInfo, 3000);

  if (
    !organizationName ||
    !organizationType ||
    !websiteRaw ||
    !country ||
    !contactName ||
    !contactEmailRaw ||
    !publishRequest ||
    publishRequest.length < 30 ||
    contactRole === null ||
    phone === null ||
    scholarshipLinkRaw === null ||
    deadline === null ||
    additionalInfo === null
  ) {
    return jsonError(400, "Please fill in all required fields correctly.");
  }

  if (!EMAIL_RE.test(contactEmailRaw)) {
    return jsonError(400, "Please provide a valid contact email address.");
  }
  if (!URL_RE.test(websiteRaw)) {
    return jsonError(400, "Please provide a valid website URL.");
  }
  if (scholarshipLinkRaw && !URL_RE.test(scholarshipLinkRaw)) {
    return jsonError(400, "Please provide a valid scholarship page URL.");
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01";

  if (!writeToken || !projectId) {
    console.error(
      "[partnership] Server is missing SANITY_API_WRITE_TOKEN or NEXT_PUBLIC_SANITY_PROJECT_ID.",
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
      _type: "partnershipApplication",
      organizationName,
      organizationType,
      website: websiteRaw,
      country,
      contactName,
      contactRole,
      contactEmail: contactEmailRaw,
      phone,
      publishRequest,
      scholarshipLink: scholarshipLinkRaw,
      deadline,
      additionalInfo,
      status: "New",
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(
      "[partnership] Sanity write failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return jsonError(500, "We could not submit your application right now.");
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return jsonError(405, "Method not allowed.");
}
