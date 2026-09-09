import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  countryBySlugQuery,
  scholarshipsByCountryQuery,
  allCountriesQuery,
  scholarshipCountByCountryQuery,
} from "@/sanity/lib/queries";

import type {
  CountryRef,
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
      index: Boolean(country) && scholarshipCount > 0,
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
    client.fetch<ScholarshipCardType[]>(
      scholarshipsByCountryQuery,
      { slug: params.slug }
    ),
  ]);

  if (!country) notFound();

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

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-12">
        {/* COUNTRY GUIDE */}
        <div className="min-w-0">
          <EditorialGuide
            content={country.guideContent}
            lastReviewedAt={country.lastReviewedAt}
          />
        </div>

        {/* SCHOLARSHIP OPPORTUNITIES */}
        <aside className="mt-8 lg:mt-0">
          <div className="border-t border-navy-100 pt-7 lg:sticky lg:top-24">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-serif text-xl font-bold leading-tight text-navy-900">
                Scholarship Opportunities
              </h2>

              {scholarships.length > 0 && (
                <span className="shrink-0 text-xs text-navy-400">
                  {scholarships.length}
                </span>
              )}
            </div>

            {scholarships.length > 0 ? (
              <div className="mt-5 space-y-5">
                {scholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship._id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-navy-500">
                No scholarships for {country.name} yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
