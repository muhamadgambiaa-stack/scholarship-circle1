import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";

import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import {
  DEGREE_LEVEL_LABELS,
  FUNDING_TYPE_LABELS,
  type Scholarship,
  type ScholarshipCard as ScholarshipCardType,
} from "@/types/scholarship";

import Badge from "@/components/ui/Badge";
import ShareButton from "@/components/ui/ShareButton";
import VerificationBox from "@/components/scholarship/VerificationBox";
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";


const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="mb-3 mt-8 font-serif text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
        {children}
      </h2>
    ),

    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 font-serif text-xl font-bold leading-tight text-navy-900 sm:text-2xl">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 font-serif text-lg font-bold leading-snug text-navy-900 sm:text-xl">
        {children}
      </h3>
    ),

    normal: ({ children }) => (
      <p className="my-4 text-base leading-7 text-navy-700">
        {children}
      </p>
    ),

    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold-500 pl-4 text-base italic leading-7 text-navy-600">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-4 space-y-2 pl-1">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-navy-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-base leading-7 text-navy-700">
        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
        <span>{children}</span>
      </li>
    ),

    number: ({ children }) => (
      <li className="text-base leading-7 text-navy-700">
        {children}
      </li>
    ),
  },
};


export default function ScholarshipDetail({
  scholarship,
}: {
  scholarship: Scholarship;
}) {
  const img = urlForImage(scholarship.featuredImage)
    ?.width(1200)
    .height(675)
    .url();

  const degreeLevels = scholarship.degreeLevels ?? [];
  const visibleDegreeLevels = degreeLevels.slice(0, 3);
  const remainingDegreeLevels = Math.max(
    degreeLevels.length - visibleDegreeLevels.length,
    0
  );

  const metaItems: Array<{
    label: string;
    href?: string;
  }> = [];

  if (scholarship.country?.name) {
    metaItems.push({
      label: scholarship.country.name,
      href: scholarship.country.slug
        ? `/countries/${scholarship.country.slug}`
        : undefined,
    });
  }

  if (
    scholarship.university &&
    !metaItems.some(
      (item) => item.label === scholarship.university
    )
  ) {
    metaItems.push({
      label: scholarship.university,
    });
  }

  if (
    scholarship.provider &&
    !metaItems.some(
      (item) => item.label === scholarship.provider
    )
  ) {
    metaItems.push({
      label: scholarship.provider,
    });
  }

  return (
    <article className="container-page py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
        {/* MAIN ARTICLE */}
        <div className="min-w-0">
          {/* Featured Image */}
          {img && (
            <div className="relative mb-5 h-[220px] w-full overflow-hidden rounded-xl bg-navy-50 sm:h-[300px] lg:h-[360px]">
              <Image
                src={img}
                alt={
                  scholarship.featuredImage?.alt ||
                  scholarship.title
                }
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>
          )}

          {/* Funding + Degree Levels */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {scholarship.fundingType && (
              <Badge tone="gold">
                {FUNDING_TYPE_LABELS[scholarship.fundingType] ??
                  scholarship.fundingType}
              </Badge>
            )}

            {visibleDegreeLevels.map((level) => (
              <Badge key={level} tone="navy">
                {DEGREE_LEVEL_LABELS[level] ?? level}
              </Badge>
            ))}

            {remainingDegreeLevels > 0 && (
              <span className="inline-flex items-center rounded-full border border-navy-200 bg-white px-2.5 py-0.5 text-xs font-medium text-navy-600">
                +{remainingDegreeLevels} more
              </span>
            )}
          </div>

          {/* Main Title */}
          <h1 className="max-w-3xl break-words font-serif text-2xl font-bold leading-[1.18] text-navy-900 sm:text-3xl lg:text-[32px]">
            {scholarship.title}
          </h1>

          {/* Metadata */}
          {metaItems.length > 0 && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-navy-500 sm:text-base">
              {metaItems.map((item, index) => (
                <span key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <span aria-hidden="true">
                      {" \u00B7 "}
                    </span>
                  )}

                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium text-navy-600 underline decoration-navy-200 underline-offset-4 transition-colors hover:text-navy-900 hover:decoration-navy-400"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </span>
              ))}
            </p>
          )}

          {/* Application Deadline */}
          {scholarship.deadline && (
            <div className="mt-4 flex max-w-3xl items-center gap-3 rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy-700">
              <CalendarDays
                size={18}
                className="shrink-0 text-gold-500"
              />

              <div className="flex flex-wrap items-center gap-x-1.5">
                <span className="font-semibold text-navy-900">
                  Application deadline:
                </span>

                <time dateTime={scholarship.deadline}>
                  {formatDate(scholarship.deadline)}
                </time>
              </div>
            </div>
          )}
          {/* Share */}
          <div className="mt-4">
            <ShareButton
              title={scholarship.title}
              description={
                scholarship.excerpt ||
                scholarship.seoDescription ||
                scholarship.title
              }
              className="inline-flex items-center justify-center rounded-md border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-sm transition-colors hover:bg-navy-50 hover:text-navy-950 sm:text-sm"
              label="Share this scholarship"
            />
          </div>

          {/* Article Body */}
          {!!scholarship.body?.length && (
            <div className="mt-8 max-w-3xl">
              <PortableText
                value={scholarship.body}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* Categories */}
          {!!scholarship.categories?.length && (
            <section className="mt-8 max-w-3xl border-t border-navy-100 pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-500">
                Categories
              </p>

              <div className="flex flex-wrap gap-2">
                {scholarship.categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="rounded-full transition-opacity hover:opacity-80"
                    aria-label={`Browse ${category.name} opportunities`}
                  >
                    <Badge tone="outline">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Eligible Countries */}
          {!!scholarship.eligibleCountries?.length && (
            <section className="mt-8 max-w-3xl">
              <h2 className="mb-3 font-serif text-xl font-bold text-navy-900 sm:text-2xl">
                Eligible Countries
              </h2>

              <p className="text-base leading-7 text-navy-700">
                {scholarship.eligibleCountries.join(", ")}
              </p>
            </section>
          )}

          {/* Benefits */}
          {!!scholarship.benefits?.length && (
            <DetailList
              icon={<CheckCircle2 size={18} />}
              title="Benefits"
              items={scholarship.benefits}
            />
          )}

          {/* Eligibility */}
          {!!scholarship.eligibility?.length && (
            <DetailList
              icon={<GraduationCap size={18} />}
              title="Eligibility Requirements"
              items={scholarship.eligibility}
            />
          )}

          {/* Documents */}
          {!!scholarship.requiredDocuments?.length && (
            <DetailList
              icon={<FileText size={18} />}
              title="Required Documents"
              items={scholarship.requiredDocuments}
            />
          )}

          {/* Application Process */}
          {!!scholarship.applicationProcess?.length && (
            <section className="mt-8 max-w-3xl">
              <h2 className="mb-3 font-serif text-xl font-bold text-navy-900 sm:text-2xl">
                Application Process
              </h2>

              <PortableText
                value={scholarship.applicationProcess}
                components={portableTextComponents}
              />
            </section>
          )}



          <VerificationBox scholarship={scholarship} />

          {/* APPLY BUTTON */}
          <div className="mt-10 max-w-3xl border-t border-navy-100 pt-8">
            <a
              href={scholarship.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex w-full items-center justify-center sm:w-auto sm:px-8"
            >
              Apply Now
              <ExternalLink size={16} className="ml-2" />
            </a>

            <p className="mt-3 text-xs leading-5 text-navy-500">
              Applications are completed on the official provider website.
            </p>
          </div>

          {/* MOBILE DISCOVER MORE */}
          <div className="mt-10 lg:hidden">
            <DiscoverMoreSidebar
              excludeScholarshipSlug={scholarship.slug}
            />
          </div>
        </div>

        {/* DESKTOP DISCOVER MORE */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <DiscoverMoreSidebar
              excludeScholarshipSlug={scholarship.slug}
            />
          </div>
        </aside>
      </div>
    </article>
  );
}


function MoreOpportunities({
  items,
}: {
  items?: ScholarshipCardType[];
}) {
  if (!items?.length) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-navy-900">
          More Opportunities
        </h2>

        <span className="h-0.5 flex-1 bg-gold-500" />
      </div>

      <div className="divide-y divide-navy-100">
        {items.map((item) => {
          const opportunityImage = urlForImage(item.featuredImage)
            ?.width(180)
            .height(180)
            .url();

          const label =
            item.primaryCategory ||
            (item.fundingType
              ? FUNDING_TYPE_LABELS[item.fundingType]
              : undefined) ||
            "Scholarship";

          return (
            <Link
              key={item._id}
              href={`/scholarships/${item.slug}`}
              className="group flex items-center gap-3 py-3 first:pt-0"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy-50 lg:h-[72px] lg:w-[72px]">
                {opportunityImage ? (
                  <Image
                    src={opportunityImage}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="72px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-navy-300">
                    Scholarship
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-navy-500">
                  {label}
                </p>

                <h3 className="line-clamp-3 text-sm font-medium leading-[1.3] text-navy-900 transition-colors group-hover:text-navy-700">
                  {item.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}


function DetailList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section className="mt-8 max-w-3xl">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-bold text-navy-900 sm:text-2xl">
        {icon}
        {title}
      </h2>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 text-base leading-7 text-navy-700"
          >
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}