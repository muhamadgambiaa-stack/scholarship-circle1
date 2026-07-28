import Link from "next/link";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

export default function LatestScholarships({ items }: { items: ScholarshipCardType[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-navy-50/60 py-14">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-heading">Latest Scholarships</h2>
          <Link href="/scholarships" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <ScholarshipCard key={s._id} scholarship={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
