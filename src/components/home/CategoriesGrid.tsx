import Link from "next/link";
import * as Icons from "lucide-react";
import type { CategoryRef } from "@/types/scholarship";

export default function CategoriesGrid({
  items,
}: {
  items: CategoryRef[];
}) {
  if (!items.length) return null;

  return (
    <section className="bg-navy-50/50 py-10 sm:py-12">
      <div className="container-page">
        <h2 className="section-heading mb-5">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((category) => {
            const iconKey = category.icon
              ? (category.icon
                  .split("-")
                  .map(
                    (part) =>
                      part.charAt(0).toUpperCase() + part.slice(1)
                  )
                  .join("") as keyof typeof Icons)
              : "GraduationCap";

            const Icon =
              (Icons[iconKey] as Icons.LucideIcon) ||
              Icons.GraduationCap;

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group flex min-h-24 flex-col items-start gap-2.5 rounded-lg border border-navy-100 bg-white p-4 transition duration-200 hover:border-navy-200 hover:shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-gold-400">
                  <Icon size={18} />
                </span>

                <span className="text-sm font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
