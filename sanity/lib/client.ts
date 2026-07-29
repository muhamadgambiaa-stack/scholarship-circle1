
import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01";

export const isSanityConfigured = Boolean(projectId);

if (!isSanityConfigured) {
  // This should only ever be seen in a build/deploy login If you see it in
  // production, NEXT_PUBLIC_SANITY_PROJECT_ID is missing from your host's
  // environment variables (e.g. Netlify/Vercel dashboard) and every page
  // will render with empty content until it's set.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Falling back to a placeholder " +
      "so the build can complete, but all Sanity queries will return no data until this " +
      "environment variable is configured on your hosting provider."
  );
}

// `createClient` throws synchronously if projectId is an empty string, which would crash
// the entire build the moment any page (e.g. sitemap.xml) imports this module — even pages
// that already handle fetch failures with .catch() never get the chance to. Falling back to
// a placeholder keeps client creation itself safe; the actual network calls in each page are
// still wrapped in .catch() and will simply resolve to empty data if the config is wrong.
const resolvedProjectId = projectId || "placeholder";

// Read-only client for public pages. We disable the CDN cache so published content
// appears immediately after a Sanity publish or webhook revalidation.
export const client = createClient({
  projectId: resolvedProjectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

// Used only for on-demand revalidation / preview needs (not exposed to client bundles).
export const previewClient = createClient({
  projectId: resolvedProjectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});
