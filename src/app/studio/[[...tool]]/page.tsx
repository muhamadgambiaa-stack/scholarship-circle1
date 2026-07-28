/**
 * This route mounts the Sanity Studio directly inside the Next.js app at /studio.
 * It is excluded from the sitemap and disallowed in robots.txt.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
