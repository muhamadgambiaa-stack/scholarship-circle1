import Link from "next/link";
import * as Icons from "lucide-react";
import type { CategoryRef } from "@/types/scholarship";

export default function CategoriesGrid({ items }: { items: CategoryRef[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-navy-50/60 py-14">
      <div className="container-page">
        <h2 className="section-heading mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((cat) => {
            const iconKey = cat.icon
              ? (cat.icon
                  .split("-")
                  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                  .join("") as keyof typeof Icons)
              : "GraduationCap";
            const Icon = (Icons[iconKey] as Icons.LucideIcon) || Icons.GraduationCap;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-start gap-3 rounded-lg border border-navy-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-gold-400">
                  <Icon size={20} />
                </span>
                <span className="font-semibold text-navy-900">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
