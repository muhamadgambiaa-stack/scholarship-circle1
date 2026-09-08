import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { CountryRef } from "@/types/scholarship";

export default function PopularDestinations({
  items,
}: {
  items: CountryRef[];
}) {
  if (!items.length) return null;

  return (
    <section className="container-page py-10 sm:py-12">
      <h2 className="section-heading mb-5">
        Popular Scholarship Destinations
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((country) => {
          const img = urlForImage(country.flagImage)
            ?.width(160)
            .height(160)
            .url();

          return (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-navy-100 bg-white p-3 text-center transition duration-200 hover:border-navy-200 hover:shadow-sm"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-navy-50 sm:h-12 sm:w-12">
                {img && (
                  <Image
                    src={img}
                    alt={country.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                )}
              </div>

              <span className="text-xs font-medium text-navy-800 group-hover:text-navy-950 sm:text-sm">
                {country.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
