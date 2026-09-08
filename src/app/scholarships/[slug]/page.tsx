import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  scholarshipBySlugQuery,
  allScholarshipSlugsQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

import type { Scholarship } from "@/types/scholarship";

import ScholarshipDetail from "@/components/scholarship/ScholarshipDetail";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StructuredData from "@/components/seo/StructuredData";

import {
  buildMetadata,
  breadcrumbJsonLd,
  scholarshipJsonLd,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await client
    .fetch<string[]>(allScholarshipSlugsQuery)
    .catch(() => []);

  return slugs.map((slug) => ({
    slug,
  }));
}

async function getScholarship(slug: string) {
  return client.fetch<Scholarship | null>(
    scholarshipBySlugQuery,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const scholarship = await getScholarship(params.slug);

  if (!scholarship) {
    return buildMetadata({
      title: "Scholarship Not Found",
      path: `/scholarships/${params.slug}`,
    });
  }

  const image = urlForImage(scholarship.featuredImage)
    ?.width(1200)
    .height(630)
    .url();

  return buildMetadata({
    title:
      scholarship.seoTitle ||
      scholarship.title,
    description:
      scholarship.seoDescription ||
      scholarship.excerpt,
    path: `/scholarships/${scholarship.slug}`,
    image,
    type: "article",
  });
}

export default async function ScholarshipPage({
  params,
}: {
  params: { slug: string };
}) {
  const scholarship = await getScholarship(
    params.slug
  );

  if (!scholarship) notFound();

  const baseUrl = SITE_URL.replace(/\/$/, "");

  const url =
    `${baseUrl}/scholarships/${scholarship.slug}`;

  const visualBreadcrumbs = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Scholarships",
      href: "/scholarships",
    },
    ...(scholarship.country?.name &&
    scholarship.country?.slug
      ? [
          {
            name: scholarship.country.name,
            href: `/countries/${scholarship.country.slug}`,
          },
        ]
      : []),
    {
      name: scholarship.title,
    },
  ];

  const structuredBreadcrumbs = [
    {
      name: "Home",
      url: `${baseUrl}/`,
    },
    {
      name: "Scholarships",
      url: `${baseUrl}/scholarships`,
    },
    ...(scholarship.country?.name &&
    scholarship.country?.slug
      ? [
          {
            name: scholarship.country.name,
            url: `${baseUrl}/countries/${scholarship.country.slug}`,
          },
        ]
      : []),
    {
      name: scholarship.title,
      url,
    },
  ];

  return (
    <>
      <StructuredData
        data={scholarshipJsonLd({
          title: scholarship.title,
          description:
            scholarship.seoDescription ||
            scholarship.excerpt ||
            scholarship.title,
          url,
          deadline: scholarship.deadline,
          provider: scholarship.provider,
        })}
      />

      <StructuredData
        data={breadcrumbJsonLd(
          structuredBreadcrumbs
        )}
      />

      <div className="container-page pt-6">
        <Breadcrumbs
          items={visualBreadcrumbs}
        />
      </div>

      <ScholarshipDetail
        scholarship={scholarship}
      />
    </>
  );
}