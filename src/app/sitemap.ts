import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  allScholarshipSlugsQuery,
  allCountriesQuery,
  allCategoriesQuery,
  allPostsQuery,
} from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/scholarships",
    "/categories",
    "/countries",
    "/blog",
    "/about",
    "/founder",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  try {
    const [scholarshipSlugs, countries, categories, posts] = await Promise.all([
      client.fetch<string[]>(allScholarshipSlugsQuery),
      client.fetch(allCountriesQuery),
      client.fetch(allCategoriesQuery),
      client.fetch(allPostsQuery),
    ]);

    const scholarshipRoutes = scholarshipSlugs.map((slug) => ({
      url: `${SITE_URL}/scholarships/${slug}`,
      lastModified: new Date(),
    }));
    const countryRoutes = countries.map((c: { slug: string }) => ({
      url: `${SITE_URL}/countries/${c.slug}`,
      lastModified: new Date(),
    }));
    const categoryRoutes = categories.map((c: { slug: string }) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: new Date(),
    }));
    const postRoutes = posts.map((p: { slug: string }) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(),
    }));

    return [...staticRoutes, ...scholarshipRoutes, ...countryRoutes, ...categoryRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
