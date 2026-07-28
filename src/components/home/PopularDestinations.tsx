import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { CountryRef } from "@/types/scholarship";

export default function PopularDestinations({ items }: { items: CountryRef[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page py-14">
      <h2 className="section-heading mb-8">Popular Scholarship Destinations</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((country) => {
          const img = urlForImage(country.flagImage)?.width(200).height(200).url();
          return (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-navy-100 p-4 text-center transition-colors hover:border-navy-300"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-navy-50">
                {img && (
                  <Image src={img} alt={country.name} fill className="object-cover" sizes="56px" />
                )}
              </div>
              <span className="text-sm font-medium text-navy-800 group-hover:text-navy-950">
                {country.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
