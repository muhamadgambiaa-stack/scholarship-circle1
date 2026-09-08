import Link from "next/link";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

export default function FeaturedScholarships({
  items,
}: {
  items: ScholarshipCardType[];
}) {
  if (!items.length) return null;

  return (
    <section className="container-page py-10 sm:py-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-heading">Featured Scholarships</h2>
          <p className="mt-1 text-xs text-navy-500 sm:text-sm">
            Selected opportunities worth exploring.
          </p>
        </div>

        <Link
          href="/scholarships"
          className="shrink-0 text-xs font-semibold text-navy-700 transition-colors hover:text-navy-950 sm:text-sm"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((scholarship) => (
          <ScholarshipCard
            key={scholarship._id}
            scholarship={scholarship}
          />
        ))}
      </div>
    </section>
  );
}
