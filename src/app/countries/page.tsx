import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { allCountriesQuery } from "@/sanity/lib/queries";
import type { CountryRef } from "@/types/scholarship";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CountriesPage() {
  const countries = await client
    .fetch<CountryRef[]>(allCountriesQuery)
    .catch(() => []);

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Countries" },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-3xl font-bold text-navy-900">
          Scholarship Countries
        </h1>

        <p className="mt-2 text-base leading-7 text-navy-500">
          Explore scholarship opportunities and funding
          guidance by destination.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">
        <main className="min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/countries/${country.slug}`}
                className="rounded-xl border border-navy-100 bg-white p-5 transition hover:border-navy-200 hover:shadow-sm"
              >
                <h2 className="font-serif text-lg font-semibold text-navy-900">
                  {country.name}
                </h2>

                {country.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy-500">
                    {country.description}
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
