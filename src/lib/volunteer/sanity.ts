import "server-only";
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

export interface SubmissionRow {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  reviewNote?: string;
  published: boolean;
}

/** Submissions are stored as Sanity DRAFTS, which the public API cannot read.
 *  Publishing one in the Studio = approving it. */
export async function listSubmissions(volunteerId: string): Promise<SubmissionRow[]> {
  const rows = await sanityWrite().fetch<
    { _id: string; title: string; category: string; _createdAt: string; reviewNote?: string }[]
  >(
    `*[_type == "volunteerSubmission" && volunteerId == $id] | order(_createdAt desc)[0...100]{
      _id, title, category, _createdAt, reviewNote
    }`,
    { id: volunteerId }
  );

  const byBase = new Map<string, SubmissionRow>();
  for (const r of rows) {
    const isDraft = r._id.startsWith("drafts.");
    const base = r._id.replace(/^drafts\./, "");
    const existing = byBase.get(base);
    byBase.set(base, {
      id: base,
      title: existing?.title ?? r.title,
      category: existing?.category ?? r.category,
      createdAt: existing?.createdAt ?? r._createdAt,
      reviewNote: r.reviewNote || existing?.reviewNote,
      published: (existing?.published ?? false) || !isDraft,
    });
  }
  return [...byBase.values()];
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
  return rows.map((r) => ({
    id: r._id,
    type: r._type,
    name: r.name,
    email: r.email,
    createdAt: r._createdAt,
  }));
}
