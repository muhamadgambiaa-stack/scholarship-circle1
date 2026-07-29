import { client } from "@/sanity/lib/client";
import { homepageQuery } from "@/sanity/lib/queries";
import type { HomepageData } from "@/types/scholarship";
import Hero from "@/components/home/Hero";
import FeaturedScholarships from "@/components/home/FeaturedScholarships";
import LatestScholarships from "@/components/home/LatestScholarships";
import ClosingSoon from "@/components/home/ClosingSoon";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import PopularDestinations from "@/components/home/PopularDestinations";
import WhatsAppChannel from "@/components/home/WhatsAppChannel";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import Newsletter from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await client.fetch<HomepageData>(homepageQuery).catch(
    () =>
      ({
        featured: [],
        latest: [],
        closingSoon: [],
        categories: [],
        popularCountries: [],
      }) as HomepageData
  );

  return (
    <>
      <Hero />
      <FeaturedScholarships items={data.featured} />
      <LatestScholarships items={data.latest} />
      <ClosingSoon items={data.closingSoon} />
      <CategoriesGrid items={data.categories} />
      <PopularDestinations items={data.popularCountries} />
      <WhatsAppChannel />
      <ConsultationCTA />
      <Newsletter />
    </>
  );
}
