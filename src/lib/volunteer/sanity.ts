import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { APPLICATION_TYPES } from "./config";

export function sanityWrite() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) throw new Error("Sanity write credentials are missing.");
  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01",
    useCdn: false,
    token,
    perspective: "raw", // sees drafts too, which is where volunteer submissions live
  });
}

export interface Option { _id: string; name: string }

/** Countries and categories a volunteer can pick, read from your real Sanity content. */
export async function getFormOptions(): Promise<{ countries: Option[]; categories: Option[] }> {
  const c = sanityWrite();
  const [countries, categories] = await Promise.all([
    c.fetch<Option[]>(`*[_type == "country" && !(_id in path("drafts.**"))] | order(name asc){ _id, name }`),
    c.fetch<Option[]>(`*[_type == "category" && !(_id in path("drafts.**"))] | order(name asc){ _id, name }`),
  ]);
  return { countries, categories };
}

export type SubmissionStatus = "published" | "pending" | "removed";

/** Volunteer content is saved as a Sanity DRAFT. Published in Studio = approved.
 *  Draft deleted without publishing = removed by a reviewer. */
export async function submissionStatuses(ids: string[]): Promise<Record<string, SubmissionStatus>> {
  const out: Record<string, SubmissionStatus> = {};
  if (!ids.length) return out;
  const found = new Set(
    await sanityWrite().fetch<string[]>(`*[_id in $ids]._id`, { ids: ids.flatMap((id) => [id, `drafts.${id}`]) })
  );
  for (const id of ids) out[id] = found.has(id) ? "published" : found.has(`drafts.${id}`) ? "pending" : "removed";
  return out;
}

export async function uploadImage(buffer: Buffer, filename: string, contentType: string) {
  const asset = await sanityWrite().assets.upload("image", buffer, { filename, contentType });
  return asset._id;
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

export async function uniqueSlug(type: string, title: string) {
  const base = slugify(title);
  const n = await sanityWrite().fetch<number>(`count(*[_type == $t && slug.current == $s])`, { t: type, s: base });
  return n === 0 ? base : `${base}-${randomUUID().slice(0, 4)}`;
}

export async function referencesExist(ids: string[], type: string) {
  if (!ids.length) return true;
  const n = await sanityWrite().fetch<number>(`count(*[_id in $ids && _type == $t])`, { ids, t: type });
  return n === new Set(ids).size;
}

export interface ApplicantRow {
  id: string;
  type: string;
  name: string | null;
  email: string | null;
  createdAt: string;
}

/** Reads applications from Sanity. Field names are guessed with coalesce(), so it works
 *  with most schemas. If your fields are named differently, add them to the coalesce lists. */
export async function listApplicants(): Promise<ApplicantRow[]> {
  const rows = await sanityWrite().fetch<
    { _id: string; _type: string; _createdAt: string; name: string | null; email: string | null }[]
  >(
    `*[_type in $types && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...200]{
      _id, _type, _createdAt,
      "email": coalesce(email, contactEmail, applicantEmail),
      "name": coalesce(name, fullName, contactName, organizationName, organisationName, organization)
    }`,
    { types: APPLICATION_TYPES }
  );
  return rows.map((r) => ({ id: r._id, type: r._type, name: r.name, email: r.email, createdAt: r._createdAt }));
}
