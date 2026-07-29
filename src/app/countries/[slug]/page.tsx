import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { countryBySlugQuery, scholarshipsByCountryQuery, allCountriesQuery } from "@/sanity/lib/queries";
import type { CountryRef, ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const countries = await client.fetch<CountryRef[]>(allCountriesQuery).catch(() => []);
  return countries.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = await client.fetch<CountryRef | null>(countryBySlugQuery, { slug: params.slug });
  return buildMetadata({
    title: country ? `Scholarships in ${country.name}` : "Country",
    description: country?.description,
    path: `/countries/${params.slug}`,
  });
}

export default async function CountryPage({ params }: { params: { slug: string } }) {
  const [country, scholarships] = await Promise.all([
    client.fetch<CountryRef | null>(countryBySlugQuery, { slug: params.slug }),
    client.fetch<ScholarshipCardType[]>(scholarshipsByCountryQuery, { slug: params.slug }),
  ]);

  if (!country) notFound();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Countries", href: "/countries" }, { name: country.name }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Scholarships in {country.name}</h1>
      {country.description && <p className="mt-2 max-w-2xl text-navy-500">{country.description}</p>}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((s) => (
          <ScholarshipCard key={s._id} scholarship={s} />
        ))}
      </div>
      {scholarships.length === 0 && <p className="mt-10 text-navy-500">No scholarships for {country.name} yet.</p>}
    </div>
  );
}
