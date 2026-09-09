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

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="min-w-0">
          <EditorialGuide
            content={country.guideContent}
            lastReviewedAt={country.lastReviewedAt}
          />
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
                  <CountryOpportunity
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

function CountryOpportunity({
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
    scholarship.primaryCategory ||
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
