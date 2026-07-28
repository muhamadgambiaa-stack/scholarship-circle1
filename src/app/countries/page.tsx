import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allCountriesQuery } from "@/sanity/lib/queries";
import type { CountryRef } from "@/types/scholarship";
import { urlForImage } from "@/sanity/lib/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({ title: "Scholarship Countries", path: "/countries" });

export default async function CountriesPage() {
  const countries = await client.fetch<CountryRef[]>(allCountriesQuery).catch(() => []);
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Countries" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Scholarship Destinations</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {countries.map((country) => {
          const img = urlForImage(country.flagImage)?.width(200).height(200).url();
          return (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-navy-50">
                {img && <Image src={img} alt={country.name} fill className="object-cover" sizes="48px" />}
              </div>
              <span className="font-medium text-navy-900">{country.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
