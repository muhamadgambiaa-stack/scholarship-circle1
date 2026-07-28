import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

export default function ClosingSoon({ items }: { items: ScholarshipCardType[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page py-14">
      <div className="mb-8">
        <h2 className="section-heading">Scholarships Closing Soon</h2>
        <p className="mt-1 text-sm text-navy-500">Don&apos;t miss these upcoming deadlines.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>
    </section>
  );
}
