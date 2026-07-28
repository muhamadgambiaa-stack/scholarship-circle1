import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { searchScholarshipsQuery } from "@/sanity/lib/queries";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import SearchBar from "@/components/home/SearchBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Search Scholarships", path: "/search" });

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const term = searchParams.q?.trim() ?? "";
  const results = term
    ? await client.fetch<ScholarshipCardType[]>(searchScholarshipsQuery, { term }).catch(() => [])
    : [];

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Search" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Search Scholarships</h1>
      <div className="mt-6 max-w-xl">
        <SearchBar />
      </div>

      {term && (
        <p className="mt-6 text-sm text-navy-500">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{term}&rdquo;
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>

      {term && results.length === 0 && (
        <p className="mt-10 text-navy-500">
          No scholarships matched your search. Try a different country, university, or degree level.
        </p>
      )}
    </div>
  );
}
