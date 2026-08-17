import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

const aboutQuery = `*[_type == "aboutPage"][0]{
  title,
  intro,
  featuredImage,
  body,
  mission,
  vision,
  seoTitle,
  seoDescription
}`;

async function getAboutPage() {
  return await client.fetch(aboutQuery);
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();

  return buildMetadata({
    title:
      about?.seoTitle ||
      "About The Scholarship Circle | Scholarships & Study Abroad Opportunities",
    description:
      about?.seoDescription ||
      "Learn about The Scholarship Circle, our mission, founder, and commitment to helping students discover scholarships, fellowships, internships, exchange programmes, grants, and study abroad opportunities worldwide.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About" },
        ]}
      />

      <article className="mt-6">
        <h1 className="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
          {about?.title || "About The Scholarship Circle"}
        </h1>

        {about?.intro && (
          <p className="mt-6 text-lg leading-8 text-gray-700">
            {about.intro}
          </p>
        )}

        <div className="prose prose-navy mt-8 max-w-none prose-headings:font-serif">
          {about?.body && <PortableText value={about.body} />}

          {about?.mission && (
            <>
              <h2>Our Mission</h2>
              <p>{about.mission}</p>
            </>
          )}

          {about?.vision && (
            <>
              <h2>Our Vision</h2>
              <p>{about.vision}</p>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
