import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { MAX_IMAGE_BYTES, MAX_SOURCE_LINKS, DEGREE_LEVELS, FUNDING_TYPES } from "@/lib/volunteer/config";
import { getCurrentVolunteer } from "@/lib/volunteer/session";
import { listSubmissionRecords, rlBlocked, rlHit, saveSubmission } from "@/lib/volunteer/store";
import { referencesExist, sanityWrite, submissionStatuses, uniqueSlug, uploadImage } from "@/lib/volunteer/sanity";
import { newKey, textToBlocks } from "@/lib/volunteer/portable";

const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status });

class Invalid extends Error {}
const bad = (m: string): never => {
  throw new Invalid(m);
};

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const required = (fd: FormData, key: string, label: string, min: number, max: number) => {
  const v = text(fd, key);
  if (v.length < min || v.length > max) bad(`${label} must be ${min} to ${max} characters.`);
  return v;
};
const optional = (fd: FormData, key: string, label: string, max: number) => {
  const v = text(fd, key);
  if (v.length > max) bad(`${label} must be at most ${max} characters.`);
  return v;
};
const lines = (fd: FormData, key: string, label: string, maxItems = 30) => {
  const items = text(fd, key).split("\n").map((l) => l.replace(/^[-*\u2022]\s*/, "").trim()).filter(Boolean);
  if (items.length > maxItems || items.some((i) => i.length > 300)) bad(`${label}: too many or too long entries.`);
  return items;
};
const url = (v: string, label: string) => {
  try {
    const u = new URL(v);
    if ((u.protocol === "https:" || u.protocol === "http:") && v.length <= 500) return v;
  } catch {}
  return bad(`${label} must be a valid http(s) link.`);
};
const date = (v: string, label: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) bad(`${label} must be a valid date.`);
  return v;
};

function imageKind(b: Buffer): { type: string; ext: string } | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { type: "image/jpeg", ext: "jpg" };
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { type: "image/png", ext: "png" };
  if (b.length > 12 && b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { type: "image/webp", ext: "webp" };
  return null;
}

async function readImage(fd: FormData, requiredImage: boolean) {
  const file = fd.get("image");
  if (!(file instanceof File) || file.size === 0) {
    if (requiredImage) bad("A featured image is required.");
    return null;
  }
  if (file.size > MAX_IMAGE_BYTES) bad("The image is too large. Maximum size is 4 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = imageKind(buffer);
  if (!kind) bad("The image must be a JPG, PNG or WebP file.");
  const alt = required(fd, "imageAlt", "Image description", 5, 200);
  return { buffer, kind: kind!, alt };
}

export async function GET() {
  const v = await getCurrentVolunteer();
  if (!v) return fail("Please log in.", 401);
  try {
    const records = await listSubmissionRecords(v.id);
    const statuses = await submissionStatuses(records.map((r) => r.id));
    return NextResponse.json({ success: true, submissions: records.map((r) => ({ ...r, status: statuses[r.id] })) });
  } catch (error) {
    console.error("List submissions error", error);
    return fail("Could not load your submissions.", 500);
  }
}

export async function POST(request: Request) {
  const volunteer = await getCurrentVolunteer();
  if (!volunteer) return fail("Please log in.", 401);

  try {
    const fd = await request.formData().catch(() => null);
    if (!fd) return fail("The form could not be read. If you attached a large image, try a smaller one.");

    const rlKey = `submit:${volunteer.id}`;
    if (await rlBlocked(rlKey, 10)) return fail("You have reached the limit of 10 submissions per hour.", 429);

    const type = text(fd, "type");
    if (type !== "scholarship" && type !== "post") return fail("Choose what you are submitting.");

    const title = required(fd, "title", "Title", 5, 150);
    const excerpt = required(fd, "excerpt", "Short excerpt", 30, 400);
    const body = required(fd, "body", "Article body", 100, 20000);
    const image = await readImage(fd, type === "scholarship");

    const now = new Date().toISOString();
    const baseId = `${type}-vol-${randomUUID()}`;
    let doc: Record<string, unknown>;

    if (type === "scholarship") {
      const countryId = text(fd, "countryId");
      const categoryIds = fd.getAll("categoryIds").map(String).filter(Boolean);
      if (!countryId) bad("Choose the host country.");
      if (categoryIds.length > 6) bad("Choose at most 6 categories.");
      if (!(await referencesExist([countryId], "country"))) bad("That country does not exist.");
      if (!(await referencesExist(categoryIds, "category"))) bad("One of the categories does not exist.");

      const degreeLevels = fd.getAll("degreeLevels").map(String).filter((v) => DEGREE_LEVELS.some((d) => d.value === v));
      const fundingType = text(fd, "fundingType");
      if (fundingType && !FUNDING_TYPES.some((f) => f.value === fundingType)) bad("Choose a valid funding type.");

      const officialSourceName = required(fd, "officialSourceName", "Official information source", 3, 200);
      const officialSourceUrl = url(required(fd, "officialSourceUrl", "Official source URL", 8, 500), "Official source URL");
      const applicationLink = url(required(fd, "applicationLink", "Official application link", 8, 500), "Official application link");
      const lastVerifiedAt = date(text(fd, "lastVerifiedAt"), "Last verified date");
      if (lastVerifiedAt > now.slice(0, 10)) bad("The verification date cannot be in the future.");
      const deadline = text(fd, "deadline");
      if (deadline) date(deadline, "Deadline");

      const university = optional(fd, "university", "University", 200);
      const provider = optional(fd, "provider", "Scholarship provider", 200);
      const applicationProcess = optional(fd, "applicationProcess", "Application process", 8000);
      const eligibleCountries = lines(fd, "eligibleCountries", "Eligible countries", 80);
      const benefits = lines(fd, "benefits", "Benefits");
      const eligibility = lines(fd, "eligibility", "Eligibility requirements");
      const requiredDocuments = lines(fd, "requiredDocuments", "Required documents");

      const assetId = await uploadImage(image!.buffer, `volunteer-${baseId}.${image!.kind.ext}`, image!.kind.type);
      doc = {
        _type: "scholarship",
        title,
        slug: { _type: "slug", current: await uniqueSlug("scholarship", title) },
        featuredImage: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: image!.alt },
        excerpt,
        body: textToBlocks(body),
        country: { _type: "reference", _ref: countryId },
        categories: categoryIds.map((id) => ({ _type: "reference", _ref: id, _key: newKey() })),
        ...(university && { university }),
        ...(provider && { provider }),
        ...(degreeLevels.length && { degreeLevels }),
        ...(fundingType && { fundingType }),
        ...(eligibleCountries.length && { eligibleCountries }),
        ...(deadline && { deadline }),
        ...(benefits.length && { benefits }),
        ...(eligibility.length && { eligibility }),
        ...(requiredDocuments.length && { requiredDocuments }),
        ...(applicationProcess && { applicationProcess: textToBlocks(applicationProcess) }),
        officialSourceName,
        officialSourceUrl,
        lastVerifiedAt,
        applicationLink,
        featured: false,
        publishedAt: now,
      };
    } else {
      const titles = fd.getAll("sourceTitle").map((v) => String(v).trim());
      const urls = fd.getAll("sourceUrl").map((v) => String(v).trim());
      const sourceLinks: { _key: string; title: string; url: string }[] = [];
      for (let i = 0; i < Math.min(titles.length, MAX_SOURCE_LINKS); i++) {
        if (!titles[i] && !urls[i]) continue;
        if (!titles[i] || !urls[i]) bad("Each source needs both a name and a link.");
        if (titles[i].length > 200) bad("A source name is too long.");
        sourceLinks.push({ _key: newKey(), title: titles[i], url: url(urls[i], "Source link") });
      }

      let featuredImage: Record<string, unknown> | undefined;
      if (image) {
        const assetId = await uploadImage(image.buffer, `volunteer-${baseId}.${image.kind.ext}`, image.kind.type);
        featuredImage = { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: image.alt };
      }
      doc = {
        _type: "post",
        title,
        slug: { _type: "slug", current: await uniqueSlug("post", title) },
        ...(featuredImage && { featuredImage }),
        excerpt,
        body: textToBlocks(body),
        publishedAt: now,
        authorName: volunteer.name,
        ...(sourceLinks.length && { sourceLinks }),
      };
    }

    // Saved as a DRAFT: invisible to the public until you press Publish in Studio.
    await sanityWrite().create({ _id: `drafts.${baseId}`, ...doc } as { _id: string; _type: string });
    await rlHit(rlKey, 3600);

    await saveSubmission({
      id: baseId,
      type,
      title,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      createdAt: now,
    }).catch((e) => console.error("Could not record submission", e));

    return NextResponse.json({ success: true, message: "Submitted. Our team will review it before anything is published." });
  } catch (error) {
    if (error instanceof Invalid) return fail(error.message);
    console.error("Create submission error", error);
    return fail("We could not save your submission. Please try again.", 500);
  }
}
