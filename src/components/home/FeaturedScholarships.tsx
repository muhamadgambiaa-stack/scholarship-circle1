import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

export default function FeaturedScholarships({ items }: { items: ScholarshipCardType[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page py-14">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="section-heading">Featured Scholarships</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>
    </section>
  );
}
