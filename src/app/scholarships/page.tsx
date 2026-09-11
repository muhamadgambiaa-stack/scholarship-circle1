import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { allScholarshipsQuery } from "@/sanity/lib/queries";
import type { ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";

import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import SearchBar from "@/components/home/SearchBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: "All Scholarships",
  description:
    "Browse scholarship opportunities curated by The Scholarship Circle.",
  path: "/scholarships",
});

export default async function ScholarshipsPage() {
  const scholarships = await client
    .fetch<ScholarshipCardType[]>(allScholarshipsQuery)
    .catch(() => []);

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Scholarships" },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
          All Scholarships
        </h1>

        <p className="mt-2 text-sm leading-6 text-navy-500 sm:text-base">
          Browse current scholarship opportunities and use the
          search box to find programs relevant to you.
        </p>
      </div>

      <div className="mt-6 max-w-xl">
        <SearchBar />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">
        <main className="min-w-0">
          {scholarships.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {scholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship._id}
                  scholarship={scholarship}
                />
              ))}
            </div>
          ) : (
            <p className="text-navy-500">
              No scholarships published yet. Check back soon.
            </p>
          )}
        </main>

        <aside>
          <div className="lg:sticky lg:top-20">
            <DiscoverMoreSidebar
              showScholarships={false}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
