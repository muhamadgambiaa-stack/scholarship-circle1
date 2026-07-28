import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { CategoryRef } from "@/types/scholarship";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Scholarship Categories",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await client.fetch<CategoryRef[]>(allCategoriesQuery).catch(() => []);
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Categories" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Scholarship Categories</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-semibold text-navy-900">{cat.name}</h2>
            {cat.description && <p className="mt-2 text-sm text-navy-500">{cat.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
