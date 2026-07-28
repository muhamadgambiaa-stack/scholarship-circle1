import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { categoryBySlugQuery, scholarshipsByCategoryQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import type { CategoryRef, ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await client.fetch<CategoryRef[]>(allCategoriesQuery).catch(() => []);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await client.fetch<CategoryRef | null>(categoryBySlugQuery, { slug: params.slug });
  return buildMetadata({
    title: category ? `${category.name} Scholarships` : "Category",
    description: category?.description,
    path: `/categories/${params.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, scholarships] = await Promise.all([
    client.fetch<CategoryRef | null>(categoryBySlugQuery, { slug: params.slug }),
    client.fetch<ScholarshipCardType[]>(scholarshipsByCategoryQuery, { slug: params.slug }),
  ]);

  if (!category) notFound();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Categories", href: "/categories" }, { name: category.name }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">{category.name} Scholarships</h1>
      {category.description && <p className="mt-2 max-w-2xl text-navy-500">{category.description}</p>}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>
      {scholarships.length === 0 && <p className="mt-10 text-navy-500">No scholarships in this category yet.</p>}
    </div>
  );
}
