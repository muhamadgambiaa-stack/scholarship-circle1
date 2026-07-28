import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { scholarshipBySlugQuery, allScholarshipSlugsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import type { Scholarship } from "@/types/scholarship";
import ScholarshipDetail from "@/components/scholarship/ScholarshipDetail";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StructuredData from "@/components/seo/StructuredData";
import { buildMetadata, breadcrumbJsonLd, scholarshipJsonLd, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allScholarshipSlugsQuery).catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

async function getScholarship(slug: string) {
  return client.fetch<Scholarship | null>(scholarshipBySlugQuery, { slug });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const scholarship = await getScholarship(params.slug);
  if (!scholarship) return buildMetadata({ title: "Scholarship Not Found", path: `/scholarships/${params.slug}` });

  const image = urlForImage(scholarship.featuredImage)?.width(1200).height(630).url();
  return buildMetadata({
    title: scholarship.seoTitle || scholarship.title,
    description: scholarship.seoDescription || scholarship.excerpt,
    path: `/scholarships/${scholarship.slug}`,
    image,
    type: "article",
  });
}

export default async function ScholarshipPage({ params }: { params: { slug: string } }) {
  const scholarship = await getScholarship(params.slug);
  if (!scholarship) notFound();

  const url = `${SITE_URL}/scholarships/${scholarship.slug}`;

  return (
    <>
      <StructuredData
        data={scholarshipJsonLd({
          title: scholarship.title,
          description: scholarship.seoDescription || scholarship.excerpt || scholarship.title,
          url,
          deadline: scholarship.deadline,
          provider: scholarship.provider,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Scholarships", url: `${SITE_URL}/scholarships` },
          { name: scholarship.title, url },
        ])}
      />
      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Scholarships", href: "/scholarships" },
            { name: scholarship.title },
          ]}
        />
      </div>
      <ScholarshipDetail scholarship={scholarship} />
    </>
  );
}
