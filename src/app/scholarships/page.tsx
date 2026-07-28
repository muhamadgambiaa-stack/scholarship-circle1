import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allScholarshipsQuery } from "@/sanity/lib/queries";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import SearchBar from "@/components/home/SearchBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "All Scholarships",
  description: "Browse all genuine scholarship opportunities curated by The Scholarship Circle.",
  path: "/scholarships",
});

export default async function ScholarshipsPage() {
  const scholarships = await client.fetch<ScholarshipCardType[]>(allScholarshipsQuery).catch(() => []);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Scholarships" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">All Scholarships</h1>
      <div className="mt-6 max-w-xl">
        <SearchBar />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>
      {scholarships.length === 0 && (
        <p className="mt-10 text-navy-500">No scholarships published yet. Check back soon.</p>
      )}
    </div>
  );
}
