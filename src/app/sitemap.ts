import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/seo";

type ScholarshipSitemapDoc = {
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
  countryId?: string;
  categoryIds?: string[];
};

type PostSitemapDoc = {
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
};

type TaxonomySitemapDoc = {
  id: string;
  slug: string;
  _updatedAt?: string;
  hasGuide: boolean;
};

type SitemapData = {
  scholarships: ScholarshipSitemapDoc[];
  posts: PostSitemapDoc[];
  countries: TaxonomySitemapDoc[];
  categories: TaxonomySitemapDoc[];
};

const sitemapDataQuery = groq`{
  "scholarships": *[
    _type == "scholarship" && defined(slug.current)
  ] {
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    "countryId": country._ref,
    "categoryIds": categories[]._ref
  },

  "posts": *[
    _type == "post" && defined(slug.current)
  ] {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  },

  "countries": *[
    _type == "country" && defined(slug.current)
  ] {
    "id": _id,
    "slug": slug.current,
    _updatedAt,
    "hasGuide": count(guideContent) > 0
  },

  "categories": *[
    _type == "category" && defined(slug.current)
  ] {
    "id": _id,
    "slug": slug.current,
    _updatedAt,
    "hasGuide": count(guideContent) > 0
  }
}`;

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

function newestDate(
  ...values: Array<string | Date | undefined>
): Date | undefined {
  const dates = values
    .map((value) => {
      if (!value) return undefined;

      return value instanceof Date
        ? value
        : toDate(value);
    })
    .filter((value): value is Date => Boolean(value));

  if (!dates.length) return undefined;

  return new Date(
    Math.max(...dates.map((date) => date.getTime()))
  );
}

function sitemapEntry(
  url: string,
  lastModified?: Date
): MetadataRoute.Sitemap[number] {
  return lastModified
    ? { url, lastModified }
    : { url };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  const fallbackStaticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/scholarships` },
    { url: `${baseUrl}/categories` },
    { url: `${baseUrl}/countries` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/founder` },
    { url: `${baseUrl}/contact` },
  ];

  try {
    const data =
      await client.fetch<SitemapData>(sitemapDataQuery);

    const countryStats = new Map<
      string,
      { count: number; latest?: Date }
    >();

    const categoryStats = new Map<
      string,
      { count: number; latest?: Date }
    >();

    for (const scholarship of data.scholarships) {
      const scholarshipModified = newestDate(
        scholarship.publishedAt,
        scholarship._updatedAt
      );

      if (scholarship.countryId) {
        const current =
          countryStats.get(scholarship.countryId) ?? {
            count: 0,
          };

        countryStats.set(scholarship.countryId, {
          count: current.count + 1,
          latest: newestDate(
            current.latest,
            scholarshipModified
          ),
        });
      }

      for (
        const categoryId of scholarship.categoryIds ?? []
      ) {
        const current =
          categoryStats.get(categoryId) ?? {
            count: 0,
          };

        categoryStats.set(categoryId, {
          count: current.count + 1,
          latest: newestDate(
            current.latest,
            scholarshipModified
          ),
        });
      }
    }

    const latestScholarshipUpdate = newestDate(
      ...data.scholarships.flatMap((scholarship) => [
        scholarship.publishedAt,
        scholarship._updatedAt,
      ])
    );

    const latestPostUpdate = newestDate(
      ...data.posts.flatMap((post) => [
        post.publishedAt,
        post._updatedAt,
      ])
    );

    const latestCountryUpdate = newestDate(
      ...data.countries.map(
        (country) => country._updatedAt
      ),
      latestScholarshipUpdate
    );

    const latestCategoryUpdate = newestDate(
      ...data.categories.map(
        (category) => category._updatedAt
      ),
      latestScholarshipUpdate
    );

    const staticPages: MetadataRoute.Sitemap = [
      sitemapEntry(
        `${baseUrl}/`,
        newestDate(
          latestScholarshipUpdate,
          latestPostUpdate
        )
      ),
      sitemapEntry(
        `${baseUrl}/scholarships`,
        latestScholarshipUpdate
      ),
      sitemapEntry(
        `${baseUrl}/categories`,
        latestCategoryUpdate
      ),
      sitemapEntry(
        `${baseUrl}/countries`,
        latestCountryUpdate
      ),
      sitemapEntry(
        `${baseUrl}/blog`,
        latestPostUpdate
      ),
      { url: `${baseUrl}/about` },
      { url: `${baseUrl}/founder` },
      { url: `${baseUrl}/contact` },
    ];

    const scholarshipPages: MetadataRoute.Sitemap =
      data.scholarships.map((scholarship) =>
        sitemapEntry(
          `${baseUrl}/scholarships/${scholarship.slug}`,
          newestDate(
            scholarship.publishedAt,
            scholarship._updatedAt
          )
        )
      );

    const blogPages: MetadataRoute.Sitemap =
      data.posts.map((post) =>
        sitemapEntry(
          `${baseUrl}/blog/${post.slug}`,
          newestDate(
            post.publishedAt,
            post._updatedAt
          )
        )
      );

    const countryPages: MetadataRoute.Sitemap =
      data.countries
        .filter(
          (country) =>
            country.hasGuide ||
            (countryStats.get(country.id)?.count ?? 0) > 0
        )
        .map((country) => {
          const stats = countryStats.get(country.id);

          return sitemapEntry(
            `${baseUrl}/countries/${country.slug}`,
            newestDate(
              country._updatedAt,
              stats?.latest
            )
          );
        });

    const categoryPages: MetadataRoute.Sitemap =
      data.categories
        .filter(
          (category) =>
            category.hasGuide ||
            (categoryStats.get(category.id)?.count ?? 0) > 0
        )
        .map((category) => {
          const stats = categoryStats.get(category.id);

          return sitemapEntry(
            `${baseUrl}/categories/${category.slug}`,
            newestDate(
              category._updatedAt,
              stats?.latest
            )
          );
        });

    return [
      ...staticPages,
      ...scholarshipPages,
      ...blogPages,
      ...countryPages,
      ...categoryPages,
    ];
  } catch {
    return fallbackStaticPages;
  }
}