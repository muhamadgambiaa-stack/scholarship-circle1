import Link from "next/link";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

export default function LatestScholarships({
  items,
}: {
  items: ScholarshipCardType[];
}) {
  if (!items.length) return null;

  return (
    <section className="bg-navy-50/50 py-10 sm:py-12">
      <div className="container-page">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-heading">Latest Scholarships</h2>
            <p className="mt-1 text-xs text-navy-500 sm:text-sm">
              Recently published opportunities.
            </p>
          </div>

          <Link
            href="/scholarships"
            className="shrink-0 text-xs font-semibold text-navy-700 transition-colors hover:text-navy-950 sm:text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((scholarship) => (
            <ScholarshipCard
              key={scholarship._id}
              scholarship={scholarship}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
