import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  categoryBySlugQuery,
  scholarshipsByCategoryQuery,
  allCategoriesQuery,
  scholarshipCountByCategoryQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

import {
  FUNDING_TYPE_LABELS,
  type CategoryRef,
  type CountryRef,
  type ScholarshipCard as ScholarshipCardType,
} from "@/types/scholarship";

import { deadlineStatus } from "@/lib/utils";

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

  const relatedCountries = Array.from(
    new Map(
      scholarships
        .map((scholarship) => scholarship.country)
        .filter(
          (country): country is CountryRef =>
            Boolean(country?.name && country?.slug)
        )
        .map((country) => [country.slug, country] as const)
    ).values()
  ).slice(0, 8);

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

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="min-w-0">
          <EditorialGuide
            content={category.guideContent}
            lastReviewedAt={category.lastReviewedAt}
          />

          {relatedCountries.length > 0 && (
            <section className="mt-10 border-t border-navy-100 pt-6">
              <h2 className="font-serif text-xl font-bold text-navy-900 sm:text-2xl">
                Explore related opportunities
              </h2>

              <p className="mt-2 text-sm leading-6 text-navy-500">
                Browse this scholarship category by destination.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {relatedCountries.map((country) => (
                  <Link
                    key={country.slug}
                    href={`/countries/${country.slug}`}
                    className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50 hover:text-navy-950"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/countries"
                className="mt-4 inline-flex text-sm font-semibold text-navy-700 underline decoration-gold-400 underline-offset-4 transition-colors hover:text-navy-950"
              >
                Browse all scholarship destinations
              </Link>
            </section>
          )}
        </div>

        <aside>
          <div className="border-t border-navy-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900">
                Scholarship Opportunities
              </h2>

              {scholarships.length > 0 && (
                <span className="text-xs text-navy-400">
                  {scholarships.length}
                </span>
              )}
            </div>

            {scholarships.length > 0 ? (
              <div className="mt-3 divide-y divide-navy-100">
                {scholarships.map((scholarship) => (
                  <CategoryOpportunity
                    key={scholarship._id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-navy-500">
                No scholarships in this category yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function CategoryOpportunity({
  scholarship,
}: {
  scholarship: ScholarshipCardType;
}) {
  const image = urlForImage(scholarship.featuredImage)
    ?.width(180)
    .height(135)
    .url();

  const deadline = deadlineStatus(
    scholarship.deadline
  );

  const label =
    scholarship.country?.name ||
    (scholarship.fundingType
      ? FUNDING_TYPE_LABELS[scholarship.fundingType]
      : undefined) ||
    "Scholarship";

  return (
    <Link
      href={`/scholarships/${scholarship.slug}`}
      className="group flex gap-3 py-4 first:pt-3"
    >
      <div className="relative h-[68px] w-[88px] shrink-0 overflow-hidden rounded-md bg-navy-50">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="88px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-navy-300">
            Scholarship
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-navy-400">
          {label}
        </p>

        <h3 className="line-clamp-2 text-sm font-semibold leading-[1.35] text-navy-900 transition-colors group-hover:text-navy-600">
          {scholarship.title}
        </h3>

        <p
          className={`mt-1.5 text-[11px] font-medium ${
            deadline.closed
              ? "text-red-500"
              : "text-navy-500"
          }`}
        >
          {deadline.label}
        </p>
      </div>
    </Link>
  );
}
