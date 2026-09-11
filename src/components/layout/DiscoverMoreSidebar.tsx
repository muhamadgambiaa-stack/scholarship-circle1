import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  Globe2,
  Layers3,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { deadlineStatus } from "@/lib/utils";
import {
  FUNDING_TYPE_LABELS,
  type BlogPostCard,
  type ScholarshipCard,
} from "@/types/scholarship";

const WHATSAPP_CHANNEL =
  "https://www.whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i";

type DiscoverData = {
  scholarships: ScholarshipCard[];
  posts: BlogPostCard[];
};

const discoverQuery = groq`{
  "scholarships": *[
    _type == "scholarship" &&
    defined(slug.current) &&
    slug.current != $excludeScholarshipSlug &&
    (!defined(deadline) || deadline >= $today)
  ] | order(publishedAt desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage,
    fundingType,
    deadline,
    publishedAt,
    "primaryCategory": categories[0]->name
  },

  "posts": *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != $excludePostSlug
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage,
    publishedAt
  }
}`;

export default async function DiscoverMoreSidebar({
  excludeScholarshipSlug,
  excludePostSlug,
}: {
  excludeScholarshipSlug?: string;
  excludePostSlug?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const data = await client
    .fetch<DiscoverData>(discoverQuery, {
      today,
      excludeScholarshipSlug:
        excludeScholarshipSlug || "__none__",
      excludePostSlug:
        excludePostSlug || "__none__",
    })
    .catch(() => ({
      scholarships: [],
      posts: [],
    }));

  return (
    <div className="space-y-7">
      {showScholarships && !!data.scholarships.length && (
        <section>
          <SectionHeading title="More Opportunities" />

          <div className="divide-y divide-navy-100">
            {data.scholarships.map((scholarship) => {
              const image = urlForImage(
                scholarship.featuredImage
              )
                ?.width(160)
                .height(160)
                .url();

              const label =
                scholarship.primaryCategory ||
                (scholarship.fundingType
                  ? FUNDING_TYPE_LABELS[
                      scholarship.fundingType
                    ]
                  : undefined) ||
                "Scholarship";

              const deadline = deadlineStatus(
                scholarship.deadline
              );

              return (
                <Link
                  key={scholarship._id}
                  href={`/scholarships/${scholarship.slug}`}
                  className="group flex gap-3 py-3 first:pt-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-navy-300">
                        Scholarship
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gold-600">
                      {label}
                    </p>

                    <h3 className="line-clamp-2 text-sm font-semibold leading-[1.35] text-navy-900 transition group-hover:text-navy-600">
                      {scholarship.title}
                    </h3>

                    <p className="mt-1 text-[11px] text-navy-400">
                      {deadline.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            href="/scholarships"
            className="mt-3 inline-flex text-xs font-semibold text-navy-700 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
          >
            Browse all scholarships
          </Link>
        </section>
      )}

      {showGuides && !!data.posts.length && (
        <section className="border-t border-navy-100 pt-6">
          <SectionHeading title="Useful Guides" />

          <div className="space-y-2.5">
            {data.posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-2.5 rounded-lg border border-navy-100 bg-white p-3 transition hover:border-navy-200 hover:bg-navy-50"
              >
                <BookOpen
                  size={16}
                  className="mt-0.5 shrink-0 text-gold-600"
                />

                <span className="line-clamp-2 text-sm font-semibold leading-5 text-navy-800 group-hover:text-navy-950">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/blog"
            className="mt-3 inline-flex text-xs font-semibold text-navy-700 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
          >
            View all guides
          </Link>
        </section>
      )}

      <section className="border-t border-navy-100 pt-6">
        <SectionHeading title="Useful Tools" />

        <div className="grid grid-cols-2 gap-2">
          <QuickLink
            href="/search"
            icon={<Search size={15} />}
            label="Search"
          />

          <QuickLink
            href="/countries"
            icon={<Globe2 size={15} />}
            label="Countries"
          />

          <QuickLink
            href="/categories"
            icon={<Layers3 size={15} />}
            label="Categories"
          />

          <QuickLink
            href="/blog"
            icon={<BookOpen size={15} />}
            label="Guides"
          />
        </div>

        <Link
          href="/editorial-policy"
          className="mt-3 flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2.5 text-xs font-medium leading-5 text-navy-700 transition hover:bg-navy-100"
        >
          <ShieldCheck
            size={15}
            className="shrink-0 text-gold-600"
          />
          How we verify scholarships
        </Link>
      </section>

      <section className="rounded-xl bg-navy-950 p-4 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle
            size={18}
            className="text-gold-400"
          />

          <h2 className="text-sm font-semibold">
            Stay Updated
          </h2>
        </div>

        <p className="mt-2 text-xs leading-5 text-navy-200">
          Get scholarship opportunities and application
          updates from The Scholarship Circle.
        </p>

        <a
          href={WHATSAPP_CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-md bg-white px-3 py-2 text-xs font-semibold text-navy-950 transition hover:bg-navy-100"
        >
          Follow WhatsApp Channel
        </a>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-navy-900">
        {title}
      </h2>

      <span className="h-0.5 flex-1 bg-gold-500" />
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2.5 text-xs font-semibold text-navy-700 transition hover:border-navy-200 hover:bg-navy-50 hover:text-navy-950"
    >
      <span className="text-gold-600">
        {icon}
      </span>

      {label}
    </Link>
  );
}
