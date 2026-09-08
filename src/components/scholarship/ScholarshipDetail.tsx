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

  const degreeLevels = scholarship.degreeLevels ?? [];
  const visibleDegreeLevels = degreeLevels.slice(0, 3);
  const extraDegreeLevels = Math.max(
    degreeLevels.length - visibleDegreeLevels.length,
    0
  );

  const degreeLevelText = degreeLevels.length
    ? degreeLevels
        .map((level) => DEGREE_LEVEL_LABELS[level] ?? level)
        .join(", ")
    : undefined;

  const fundingTypeText = scholarship.fundingType
    ? FUNDING_TYPE_LABELS[scholarship.fundingType] ??
      scholarship.fundingType
    : undefined;

  const eligibleCountries = scholarship.eligibleCountries ?? [];

  const mobileEligibleCountries = summarizeList(
    eligibleCountries,
    3
  );

  const desktopEligibleCountries = summarizeList(
    eligibleCountries,
    6
  );

  const university = scholarship.university?.trim();
  const provider = scholarship.provider?.trim();

  const providerForDisplay =
    university &&
    provider &&
    university.toLowerCase() === provider.toLowerCase()
      ? undefined
      : provider;

  const metadataItems = [
    scholarship.country?.name,
    university,
    provider,
  ].filter(
    (value): value is string =>
      Boolean(value && value.trim())
  );

  const uniqueMetadataItems = metadataItems.filter(
    (value, index, allValues) =>
      allValues.findIndex(
        (item) =>
          item.trim().toLowerCase() ===
          value.trim().toLowerCase()
      ) === index
  );

  const metadataLine = uniqueMetadataItems.join(" · ");

  const deadlineDate = scholarship.deadline
    ? formatDate(scholarship.deadline)
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

        {/* Funding + Degree Levels */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {scholarship.fundingType && (
            <Badge tone="gold">
              {fundingTypeText}
            </Badge>
          )}

          {visibleDegreeLevels.map((level) => (
            <Badge key={level} tone="navy">
              {DEGREE_LEVEL_LABELS[level] ?? level}
            </Badge>
          ))}

          {extraDegreeLevels > 0 && (
            <span className="inline-flex items-center rounded-full border border-navy-200 bg-white px-2.5 py-0.5 text-xs font-medium text-navy-500">
              +{extraDegreeLevels} more
            </span>
          )}
        </div>

        {/* Page Title */}
        <h1 className="max-w-3xl break-words font-serif text-2xl font-bold leading-[1.2] text-navy-900 sm:text-3xl lg:text-[32px]">
          {scholarship.title}
        </h1>

        {/* Metadata */}
        {metadataLine && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-navy-500 sm:text-base">
            {metadataLine}
          </p>
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

        {/* Mobile Key Information */}
        <div className="mt-6 lg:hidden">
          <KeyInformationCard
            country={scholarship.country?.name}
            university={university}
            provider={providerForDisplay}
            degreeLevels={degreeLevelText}
            fundingType={fundingTypeText}
            eligibleCountries={mobileEligibleCountries}
            deadlineDate={deadlineDate}
            deadlineLabel={deadline.label}
            deadlineClosed={deadline.closed}
            applicationLink={scholarship.applicationLink}
            compact
          />
        </div>

        {/* Main Article */}
        {!!scholarship.body?.length && (
          <div className="prose prose-navy mt-8 max-w-3xl prose-headings:font-serif prose-headings:text-navy-900 prose-h1:mb-4 prose-h1:mt-8 prose-h1:text-2xl prose-h1:leading-tight prose-h2:mb-3 prose-h2:mt-7 prose-h2:text-xl prose-h2:leading-snug prose-h3:text-lg prose-p:my-4 prose-p:text-[15px] prose-p:leading-7 prose-li:text-[15px] prose-li:leading-7 prose-a:text-navy-700 sm:prose-h1:text-3xl sm:prose-h2:text-2xl sm:prose-p:text-base sm:prose-li:text-base">
            <PortableText value={scholarship.body} />
          </div>
        )}

        {/* Full Eligible Countries */}
        {eligibleCountries.length > 0 && (
          <section className="mt-8 max-w-3xl">
            <h2 className="mb-3 font-serif text-lg font-bold text-navy-900 sm:text-xl">
              Eligible Countries
            </h2>

            <p className="text-[15px] leading-7 text-navy-700 sm:text-base">
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
            <h2 className="mb-3 font-serif text-lg font-bold text-navy-900 sm:text-xl">
              Application Process
            </h2>

            <div className="prose prose-navy max-w-none prose-headings:font-serif prose-headings:text-navy-900 prose-h1:text-2xl prose-h1:leading-tight prose-h2:text-xl prose-h2:leading-snug prose-h3:text-lg prose-p:text-[15px] prose-p:leading-7 prose-li:text-[15px] prose-li:leading-7 prose-a:text-navy-700 sm:prose-h1:text-3xl sm:prose-h2:text-2xl sm:prose-p:text-base sm:prose-li:text-base">
              <PortableText
                value={scholarship.applicationProcess}
              />
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
                <Badge
                  key={category.slug}
                  tone="outline"
                >
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

      {/* Desktop Key Information */}
      <aside className="hidden lg:col-span-1 lg:block">
        <div className="sticky top-20">
          <KeyInformationCard
            country={scholarship.country?.name}
            university={university}
            provider={providerForDisplay}
            degreeLevels={degreeLevelText}
            fundingType={fundingTypeText}
            eligibleCountries={desktopEligibleCountries}
            deadlineDate={deadlineDate}
            deadlineLabel={deadline.label}
            deadlineClosed={deadline.closed}
            applicationLink={scholarship.applicationLink}
          />
        </div>
      </aside>
    </article>
  );
}

function KeyInformationCard({
  country,
  university,
  provider,
  degreeLevels,
  fundingType,
  eligibleCountries,
  deadlineDate,
  deadlineLabel,
  deadlineClosed,
  applicationLink,
  compact = false,
}: {
  country?: string;
  university?: string;
  provider?: string;
  degreeLevels?: string;
  fundingType?: string;
  eligibleCountries?: string;
  deadlineDate?: string;
  deadlineLabel: string;
  deadlineClosed: boolean;
  applicationLink: string;
  compact?: boolean;
}) {
  return (
    <section className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5">
      <h2
        className={`font-serif font-bold text-navy-900 ${
          compact
            ? "mb-3 text-base"
            : "mb-4 text-lg"
        }`}
      >
        Key Information
      </h2>

      <dl className="text-sm">
        <InfoRow
          label="Country"
          value={country}
          compact={compact}
        />

        <InfoRow
          label="University"
          value={university}
          compact={compact}
        />

        <InfoRow
          label="Provider"
          value={provider}
          compact={compact}
        />

        <InfoRow
          label="Degree Levels"
          value={degreeLevels}
          compact={compact}
        />

        <InfoRow
          label="Funding"
          value={fundingType}
          compact={compact}
        />

        <InfoRow
          label="Eligible"
          value={eligibleCountries}
          compact={compact}
        />

        <InfoRow
          label="Deadline"
          value={deadlineDate}
          compact={compact}
        />
      </dl>

      <div
        className={`mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
          deadlineClosed
            ? "bg-red-50 text-red-600"
            : "bg-navy-50 text-navy-700"
        }`}
      >
        <CalendarClock
          size={16}
          className="shrink-0"
        />

        <span>{deadlineLabel}</span>
      </div>

      <a
        href={applicationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 flex w-full items-center justify-center"
      >
        Apply Now
        <ExternalLink
          size={16}
          className="ml-2"
        />
      </a>
    </section>
  );
}

function InfoRow({
  label,
  value,
  compact = false,
}: {
  label: string;
  value?: string;
  compact?: boolean;
}) {
  if (!value) return null;

  if (compact) {
    return (
      <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 border-b border-navy-100 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
        <dt className="text-xs font-medium text-navy-500">
          {label}
        </dt>

        <dd className="break-words text-right text-sm font-medium leading-5 text-navy-900">
          {value}
        </dd>
      </div>
    );
  }

  return (
    <div className="border-b border-navy-100 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
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
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold text-navy-900 sm:text-xl">
        {icon}
        {title}
      </h2>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2 text-[15px] leading-7 text-navy-700 sm:text-base"
          >
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function summarizeList(
  items: string[],
  limit: number
): string | undefined {
  if (!items.length) return undefined;

  const visible = items.slice(0, limit);
  const remaining = items.length - visible.length;

  return `${visible.join(", ")}${
    remaining > 0
      ? ` · +${remaining} more`
      : ""
  }`;
}