import Image from "next/image";
import { PortableText } from "@portabletext/react";
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";

import { urlForImage } from "@/sanity/lib/image";
import {
  DEGREE_LEVEL_LABELS,
  FUNDING_TYPE_LABELS,
  type Scholarship,
} from "@/types/scholarship";
import { formatDate, deadlineStatus } from "@/lib/utils";

import Badge from "@/components/ui/Badge";
import ShareButton from "@/components/ui/ShareButton";
import ScholarshipCard from "./ScholarshipCard";

export default function ScholarshipDetail({
  scholarship,
}: {
  scholarship: Scholarship;
}) {
  const img = urlForImage(scholarship.featuredImage)
    ?.width(1200)
    .height(675)
    .url();

  const deadline = deadlineStatus(scholarship.deadline);

  const eligibleCountries = scholarship.eligibleCountries ?? [];
  const sidebarCountries = eligibleCountries.slice(0, 6);
  const remainingCountries = Math.max(
    eligibleCountries.length - sidebarCountries.length,
    0
  );

  const sidebarEligibleCountries =
    sidebarCountries.length > 0
      ? `${sidebarCountries.join(", ")}${
          remainingCountries > 0 ? ` · +${remainingCountries} more` : ""
        }`
      : undefined;

  return (
    <article className="container-page grid grid-cols-1 gap-8 py-6 sm:py-8 lg:grid-cols-3 lg:gap-10">
      {/* Main Content */}
      <div className="min-w-0 lg:col-span-2">
        {/* Featured Image */}
        {img && (
          <div className="relative mb-5 h-[220px] w-full overflow-hidden rounded-xl bg-navy-50 sm:h-[300px] lg:h-[360px]">
            <Image
              src={img}
              alt={scholarship.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
        )}

        {/* Essential Badges Only */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {scholarship.fundingType && (
            <Badge tone="gold">
              {FUNDING_TYPE_LABELS[scholarship.fundingType] ??
                scholarship.fundingType}
            </Badge>
          )}

          {scholarship.degreeLevels?.map((level) => (
            <Badge key={level} tone="navy">
              {DEGREE_LEVEL_LABELS[level] ?? level}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="max-w-3xl break-words font-serif text-2xl font-bold leading-[1.2] text-navy-900 sm:text-3xl lg:text-[32px]">
          {scholarship.title}
        </h1>

        {/* Country / University / Provider */}
        <p className="mt-3 max-w-3xl text-sm leading-6 text-navy-500 sm:text-base">
          {scholarship.country?.name}

          {scholarship.university
            ? ` · ${scholarship.university}`
            : ""}

          {scholarship.provider
            ? ` · ${scholarship.provider}`
            : ""}
        </p>

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

        {/* Main Article */}
        {!!scholarship.body?.length && (
          <div className="prose prose-navy mt-8 max-w-3xl prose-headings:font-serif prose-a:text-navy-700">
            <PortableText value={scholarship.body} />
          </div>
        )}

        {/* Eligible Countries - Full List */}
        {eligibleCountries.length > 0 && (
          <section className="mt-8 max-w-3xl">
            <h2 className="mb-3 font-serif text-xl font-bold text-navy-900">
              Eligible Countries
            </h2>

            <p className="text-sm leading-7 text-navy-700">
              {eligibleCountries.join(", ")}
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

        {/* Required Documents */}
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
            <h2 className="mb-3 font-serif text-xl font-bold text-navy-900">
              Application Process
            </h2>

            <div className="prose prose-navy max-w-none prose-headings:font-serif prose-a:text-navy-700">
              <PortableText value={scholarship.applicationProcess} />
            </div>
          </section>
        )}

        {/* Categories */}
        {!!scholarship.categories?.length && (
          <section className="mt-8 max-w-3xl border-t border-navy-100 pt-6">
            <h2 className="mb-3 text-sm font-semibold text-navy-700">
              Categories
            </h2>

            <div className="flex flex-wrap gap-2">
              {scholarship.categories.map((category) => (
                <Badge key={category.slug} tone="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Related Scholarships */}
        {!!scholarship.relatedScholarships?.length && (
          <section className="mt-10 sm:mt-12">
            <h2 className="mb-5 font-serif text-xl font-bold text-navy-900">
              Related Scholarships
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {scholarship.relatedScholarships.map(
                (relatedScholarship) => (
                  <ScholarshipCard
                    key={relatedScholarship._id}
                    scholarship={relatedScholarship}
                  />
                )
              )}
            </div>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm lg:sticky lg:top-20">
          <h2 className="mb-4 font-serif text-lg font-bold text-navy-900">
            Key Information
          </h2>

          <dl className="space-y-3 text-sm">
            <InfoRow
              label="Country"
              value={scholarship.country?.name}
            />

            <InfoRow
              label="University"
              value={scholarship.university}
            />

            <InfoRow
              label="Provider"
              value={scholarship.provider}
            />

            <InfoRow
              label="Degree Levels"
              value={
                scholarship.degreeLevels?.length
                  ? scholarship.degreeLevels
                      .map(
                        (level) =>
                          DEGREE_LEVEL_LABELS[level] ?? level
                      )
                      .join(", ")
                  : undefined
              }
            />

            <InfoRow
              label="Funding Type"
              value={
                scholarship.fundingType
                  ? FUNDING_TYPE_LABELS[
                      scholarship.fundingType
                    ] ?? scholarship.fundingType
                  : undefined
              }
            />

            <InfoRow
              label="Eligible Countries"
              value={sidebarEligibleCountries}
            />

            <InfoRow
              label="Deadline"
              value={
                scholarship.deadline
                  ? formatDate(scholarship.deadline)
                  : undefined
              }
            />
          </dl>

          <div
            className={`mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              deadline.closed
                ? "bg-red-50 text-red-600"
                : "bg-navy-50 text-navy-700"
            }`}
          >
            <CalendarClock size={16} />
            {deadline.label}
          </div>

          <a
            href={scholarship.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 flex w-full items-center justify-center"
          >
            Apply Now
            <ExternalLink size={16} className="ml-2" />
          </a>
        </div>
      </aside>
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="border-b border-navy-100 pb-3 last:border-b-0">
      <dt className="text-xs font-medium text-navy-500">
        {label}
      </dt>

      <dd className="mt-1 break-words font-medium leading-5 text-navy-900">
        {value}
      </dd>
    </div>
  );
}

function DetailList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section className="mt-8 max-w-3xl">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
        {icon}
        {title}
      </h2>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2 text-sm leading-6 text-navy-700"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
