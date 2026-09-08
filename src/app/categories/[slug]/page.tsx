import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  categoryBySlugQuery,
  scholarshipsByCategoryQuery,
  allCategoriesQuery,
  scholarshipCountByCategoryQuery,
} from "@/sanity/lib/queries";

import type {
  CategoryRef,
  ScholarshipCard as ScholarshipCardType,
} from "@/types/scholarship";

import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EditorialGuide from "@/components/ui/EditorialGuide";

import {
  breadcrumbJsonLd,
  buildMetadata,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const categories = await client
    .fetch<CategoryRef[]>(allCategoriesQuery)
    .catch(() => []);

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const [category, scholarshipCount] = await Promise.all([
    client.fetch<CategoryRef | null>(
      categoryBySlugQuery,
      { slug: params.slug }
    ),
    client.fetch<number>(
      scholarshipCountByCategoryQuery,
      { slug: params.slug }
    ),
  ]);

  const metadata = buildMetadata({
    title:
      category?.seoTitle ||
      (category
        ? `${category.name} Scholarships`
        : "Category"),
    description:
      category?.seoDescription ||
      category?.description,
    path: `/categories/${params.slug}`,
  });

  return {
    ...metadata,
    robots: {
      index: Boolean(category) && scholarshipCount > 0,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [category, scholarships] = await Promise.all([
    client.fetch<CategoryRef | null>(
      categoryBySlugQuery,
      { slug: params.slug }
    ),
    client.fetch<ScholarshipCardType[]>(
      scholarshipsByCategoryQuery,
      { slug: params.slug }
    ),
  ]);

  if (!category) notFound();

  const baseUrl = SITE_URL.replace(/\/$/, "");

  const breadcrumbData = breadcrumbJsonLd([
    {
      name: "Home",
      url: `${baseUrl}/`,
    },
    {
      name: "Categories",
      url: `${baseUrl}/categories`,
    },
    {
      name: category.name,
      url: `${baseUrl}/categories/${category.slug}`,
    },
  ]);

  return (
    <div className="container-page py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
          { name: category.name },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-3xl font-bold leading-tight text-navy-900">
          {category.name} Scholarships
        </h1>

        {category.description && (
          <p className="mt-3 text-base leading-7 text-navy-600">
            {category.description}
          </p>
        )}
      </div>

      <EditorialGuide
        content={category.guideContent}
        lastReviewedAt={category.lastReviewedAt}
      />

      {scholarships.length > 0 ? (
        <>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-t border-navy-100 pt-7">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              Scholarship Opportunities
            </h2>

            <p className="text-sm text-navy-500">
              {scholarships.length}{" "}
              {scholarships.length === 1
                ? "listing"
                : "listings"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship._id}
                scholarship={scholarship}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-10 text-navy-500">
          No scholarships in this category yet.
        </p>
      )}
    </div>
  );
}