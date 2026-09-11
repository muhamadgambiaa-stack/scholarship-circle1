import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  countryBySlugQuery,
  scholarshipsByCountryQuery,
  allCountriesQuery,
  scholarshipCountByCountryQuery,
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
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";

import {
  breadcrumbJsonLd,
  buildMetadata,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountryScholarshipCard = ScholarshipCardType & {
  categories?: CategoryRef[];
};

export async function generateStaticParams() {
  const countries = await client
    .fetch<CountryRef[]>(allCountriesQuery)
    .catch(() => []);

  return countries.map((country) => ({
    slug: country.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const [country, scholarshipCount] = await Promise.all([
    client.fetch<CountryRef | null>(
      countryBySlugQuery,
      { slug: params.slug }
    ),
    client.fetch<number>(
      scholarshipCountByCountryQuery,
      { slug: params.slug }
    ),
  ]);

  const metadata = buildMetadata({
    title:
      country?.seoTitle ||
      (country
        ? `Scholarships in ${country.name}`
        : "Country"),
    description:
      country?.seoDescription ||
      country?.description,
    path: `/countries/${params.slug}`,
  });

  return {
    ...metadata,
    robots: {
      index:
        Boolean(country) &&
        (scholarshipCount > 0 ||
          Boolean(country?.guideContent?.length)),
      follow: true,
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [country, scholarships] = await Promise.all([
    client.fetch<CountryRef | null>(
      countryBySlugQuery,
      { slug: params.slug }
    ),
    client.fetch<CountryScholarshipCard[]>(
      scholarshipsByCountryQuery,
      { slug: params.slug }
    ),
  ]);

  if (!country) notFound();

  const relatedCategories = Array.from(
    new Map(
      scholarships
        .flatMap((scholarship) => scholarship.categories ?? [])
        .filter((category) => category.name && category.slug)
        .map((category) => [category.slug, category] as const)
    ).values()
  ).slice(0, 8);

  const baseUrl = SITE_URL.replace(/\/$/, "");

  const breadcrumbData = breadcrumbJsonLd([
    {
      name: "Home",
      url: `${baseUrl}/`,
    },
    {
      name: "Countries",
      url: `${baseUrl}/countries`,
    },
    {
      name: country.name,
      url: `${baseUrl}/countries/${country.slug}`,
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
          { name: "Countries", href: "/countries" },
          { name: country.name },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-3xl font-bold leading-tight text-navy-900">
          Scholarships in {country.name}
        </h1>

        {country.description && (
          <p className="mt-3 text-base leading-7 text-navy-600">
            {country.description}
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="min-w-0">
          <EditorialGuide
            content={country.guideContent}
            lastReviewedAt={country.lastReviewedAt}
          />

          {relatedCategories.length > 0 && (
            <section className="mt-10 border-t border-navy-100 pt-6">
              <h2 className="font-serif text-xl font-bold text-navy-900 sm:text-2xl">
                Explore related opportunities
              </h2>

              <p className="mt-2 text-sm leading-6 text-navy-500">
                Browse scholarships in {country.name} by opportunity type.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {relatedCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50 hover:text-navy-950"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/categories"
                className="mt-4 inline-flex text-sm font-semibold text-navy-700 underline decoration-gold-400 underline-offset-4 transition-colors hover:text-navy-950"
              >
                Browse all scholarship categories
              </Link>
            </section>
          )}
        </div>

        <aside>
          <div className="lg:sticky lg:top-20">
            <DiscoverMoreSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
