import type { Metadata } from "next";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { CategoryRef } from "@/types/scholarship";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: "Scholarship Categories",
  description:
    "Browse scholarships by degree level, funding type and opportunity category.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await client
    .fetch<CategoryRef[]>(allCategoriesQuery)
    .catch(() => []);

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Categories" },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-3xl font-bold text-navy-900">
          Scholarship Categories
        </h1>

        <p className="mt-2 text-base leading-7 text-navy-500">
          Browse opportunities by scholarship type,
          academic level and funding category.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">
        <main className="min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="rounded-xl border border-navy-100 bg-white p-5 transition hover:border-navy-200 hover:shadow-sm"
              >
                <h2 className="font-serif text-lg font-semibold text-navy-900">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy-500">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </main>

        <aside>
          <div className="lg:sticky lg:top-20">
            <DiscoverMoreSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
