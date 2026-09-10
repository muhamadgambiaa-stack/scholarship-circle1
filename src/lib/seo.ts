import type { Metadata } from "next";

export const SITE_NAME = "The Scholarship Circle";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thescholarshipcircle.com";
export const SITE_DESCRIPTION =
  "Genuine, fully-funded, and partially-funded scholarship opportunities for students worldwide, curated by The Scholarship Circle.";

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function scholarshipJsonLd(params: {
  title: string;
  description: string;
  url: string;
  deadline?: string;
  provider?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: params.title,
    description: params.description,
    url: params.url,
    ...(params.deadline ? { validThrough: params.deadline } : {}),
    ...(params.provider ? { provider: { "@type": "Organization", name: params.provider } } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.url,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url,
    },

    ...(params.image
      ? {
          image: [params.image],
        }
      : {}),

    ...(params.datePublished
      ? {
          datePublished: params.datePublished,
        }
      : {}),

    ...(params.dateModified
      ? {
          dateModified: params.dateModified,
        }
      : {}),

    author: params.authorName
      ? {
          "@type": "Person",
          name: params.authorName,
        }
      : {
          "@type": "Organization",
          name: SITE_NAME,
          url: baseUrl,
        },

    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}