import Link from "next/link";
import ScholarshipBrandHeader from "@/components/scholarship/ScholarshipBrandHeader";

import {
  DEGREE_LEVEL_LABELS,
  FUNDING_TYPE_LABELS,
  type ScholarshipCard as ScholarshipCardType,
} from "@/types/scholarship";
import { deadlineStatus } from "@/lib/utils";

import Badge from "@/components/ui/Badge";

export default function ScholarshipCard({
  scholarship,
}: {
  scholarship: ScholarshipCardType;
}) {

  const deadline = deadlineStatus(scholarship.deadline);

  const degreeLevels = scholarship.degreeLevels ?? [];
  const visibleDegreeLevels = degreeLevels.slice(0, 2);
  const extraDegreeLevels = Math.max(
    degreeLevels.length - visibleDegreeLevels.length,
    0
  );

  return (
    <article className="group overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md">
      <Link
        href={`/scholarships/${scholarship.slug}`}
        className="flex h-full flex-col"
      >
        <ScholarshipBrandHeader>
          {scholarship.fundingType && (
            <Badge tone="gold">
              {FUNDING_TYPE_LABELS[scholarship.fundingType] ??
                scholarship.fundingType}
            </Badge>
          )}
        </ScholarshipBrandHeader>

        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          <h3 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-navy-900 transition-colors group-hover:text-navy-700 sm:text-lg">
            {scholarship.title}
          </h3>

          {(scholarship.country?.name || scholarship.university) && (
            <p className="mt-1.5 truncate text-xs text-navy-500 sm:text-sm">
              {scholarship.country?.name}

              {scholarship.country?.name && scholarship.university
                ? " · "
                : ""}

              {scholarship.university}
            </p>
          )}

          {visibleDegreeLevels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {visibleDegreeLevels.map((level) => (
                <Badge key={level} tone="navy">
                  {DEGREE_LEVEL_LABELS[level] ?? level}
                </Badge>
              ))}

              {extraDegreeLevels > 0 && (
                <span className="inline-flex items-center rounded-full border border-navy-100 bg-white px-2.5 py-0.5 text-xs font-medium text-navy-500">
                  +{extraDegreeLevels} more
                </span>
              )}
            </div>
          )}

          <span className="mt-4 text-sm font-semibold text-navy-800 underline decoration-gold-500 underline-offset-4">
            Read full details
          </span>

          <p
            className={`mt-auto pt-3 text-xs font-medium ${
              deadline.closed ? "text-red-500" : "text-navy-600"
            }`}
          >
            {deadline.label}
          </p>
        </div>
      </Link>
    </article>
  );
}
