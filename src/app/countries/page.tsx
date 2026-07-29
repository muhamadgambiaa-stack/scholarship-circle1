import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { allCountriesQuery } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CountriesPage() {
  const countries = await client.fetch(allCountriesQuery).catch(() => []);

  return (
    <div className="container-page py-10">
      <h1 className="font-serif text-3xl font-bold text-navy-900">Scholarship Countries</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country: { slug: string; name: string }) => (
          <Link
            key={country.slug}
            href={`/countries/${country.slug}`}
            className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-semibold text-navy-900">{country.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}