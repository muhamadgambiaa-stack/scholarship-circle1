import type { Metadata } from "next";
import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import {
  postBySlugQuery,
  allPostsQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

import type {
  BlogPost,
  BlogPostCard,
} from "@/types/scholarship";

import { formatDate } from "@/lib/utils";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ShareButton from "@/components/ui/ShareButton";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import StructuredData from "@/components/seo/StructuredData";

import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const blogComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-3 mt-9 font-serif text-2xl font-bold leading-tight text-navy-900">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mb-2 mt-7 font-serif text-xl font-bold leading-snug text-navy-900">
        {children}
      </h3>
    ),

    normal: ({ children }) => (
      <p className="my-4 text-base leading-7 text-navy-700">
        {children}
      </p>
    ),

    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold-500 pl-4 text-base italic leading-7 text-navy-600">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-navy-700">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-navy-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-7">
        {children}
      </li>
    ),

    number: ({ children }) => (
      <li className="text-base leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    link: ({ children, value }) => {
      const href =
        typeof value?.href === "string"
          ? value.href
          : "#";

      const internal = href.startsWith("/");

      if (internal) {
        return (
          <Link
            href={href}
            className="font-medium text-navy-800 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-navy-800 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value)
        ?.width(1200)
        .height(675)
        .url();

      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={
              typeof value?.alt === "string"
                ? value.alt
                : "Article illustration"
            }
            width={1200}
            height={675}
            className="h-auto w-full rounded-xl object-cover"
          />

          {value?.caption && (
            <figcaption className="mt-2 text-center text-xs leading-5 text-navy-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateStaticParams() {
  const posts = await client
    .fetch<BlogPost[]>(allPostsQuery)
    .catch(() => []);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string) {
  return client.fetch<BlogPost | null>(
    postBySlugQuery,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found",
      path: `/blog/${params.slug}`,
    });
  }

  const image = urlForImage(post.featuredImage)
    ?.width(1200)
    .height(630)
    .url();

  return buildMetadata({
    title:
      post.seoTitle ||
      post.title,
    description:
      post.seoDescription ||
      post.excerpt,
    path: `/blog/${post.slug}`,
    image,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) notFound();

  const baseUrl = SITE_URL.replace(/\/$/, "");

  const pageUrl =
    `${baseUrl}/blog/${post.slug}`;

  const featuredImage = urlForImage(
    post.featuredImage
  )
    ?.width(1200)
    .height(630)
    .url();

  const description =
    post.seoDescription ||
    post.excerpt ||
    post.title;

  return (
    <>
      <StructuredData
        data={articleJsonLd({
          title: post.title,
          description,
          url: pageUrl,
          image: featuredImage,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          authorName: post.authorName,
        })}
      />

      <StructuredData
        data={breadcrumbJsonLd([
          {
            name: "Home",
            url: `${baseUrl}/`,
          },
          {
            name: "Blog",
            url: `${baseUrl}/blog`,
          },
          {
            name: post.title,
            url: pageUrl,
          },
        ])}
      />

      <article className="container-page py-8 sm:py-10">
        <Breadcrumbs
          items={[
            {
              name: "Home",
              href: "/",
            },
            {
              name: "Blog",
              href: "/blog",
            },
            {
              name: post.title,
            },
          ]}
        />

        <header className="mt-5 max-w-3xl">
          <h1 className="font-serif text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg leading-8 text-navy-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-400">
            {post.publishedAt && (
              <span>
                Published {formatDate(post.publishedAt)}
              </span>
            )}

            {post.authorName && (
              <>
                <span aria-hidden="true">
                  {" \u00B7 "}
                </span>

                <span>
                  By {post.authorName}
                </span>
              </>
            )}

            {post.lastReviewedAt && (
              <>
                <span aria-hidden="true">
                  {" \u00B7 "}
                </span>

                <span>
                  Last reviewed{" "}
                  {formatDate(post.lastReviewedAt)}
                </span>
              </>
            )}
          </div>

          <div className="mt-5">
            <ShareButton
              title={post.title}
              description={description}
              className="rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 transition hover:border-navy-300 hover:text-navy-900"
              label="Share this post"
            />
          </div>
        </header>

        {featuredImage && (
          <div className="relative mt-7 h-[240px] w-full overflow-hidden rounded-xl bg-navy-50 sm:h-[380px]">
            <Image
              src={featuredImage}
              alt={
                post.featuredImage?.alt ||
                post.title
              }
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {!!post.body?.length && (
          <div className="mt-9 max-w-3xl">
            <PortableText
              value={post.body}
              components={blogComponents}
            />
          </div>
        )}

        {!!post.sourceLinks?.length && (
          <section className="mt-10 max-w-3xl border-t border-navy-100 pt-7">
            <h2 className="font-serif text-xl font-bold text-navy-900">
              Sources and further reading
            </h2>

            <p className="mt-2 text-sm leading-6 text-navy-500">
              These are sources used or recommended for readers who want to verify information or explore the subject in more detail.
            </p>

            <ul className="mt-4 space-y-3">
              {post.sourceLinks.map(
                (source, index) => (
                  <li
                    key={`${source.url}-${index}`}
                    className="text-sm leading-6"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy-700 underline decoration-navy-200 underline-offset-4 hover:text-navy-950"
                    >
                      {source.title}
                    </a>
                  </li>
                )
              )}
            </ul>
          </section>
        )}

        {!!post.relatedScholarships?.length && (
          <section className="mt-12 border-t border-navy-100 pt-8">
            <div className="max-w-3xl">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                Related Scholarship Opportunities
              </h2>

              <p className="mt-2 text-sm leading-6 text-navy-500">
                Current opportunities related to the topic covered in this guide.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedScholarships.map(
                (scholarship) => (
                  <ScholarshipCard
                    key={scholarship._id}
                    scholarship={scholarship}
                  />
                )
              )}
            </div>
          </section>
        )}

        {!!post.relatedPosts?.length && (
          <section className="mt-12 border-t border-navy-100 pt-8">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              Related Guides
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {post.relatedPosts.map(
                (relatedPost) => (
                  <RelatedGuide
                    key={relatedPost._id}
                    post={relatedPost}
                  />
                )
              )}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function RelatedGuide({
  post,
}: {
  post: BlogPostCard;
}) {
  const image = urlForImage(post.featuredImage)
    ?.width(700)
    .height(394)
    .url();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-xl border border-navy-100 bg-white transition hover:border-navy-200 hover:shadow-sm"
    >
      {image && (
        <div className="relative h-44 w-full overflow-hidden bg-navy-50">
          <Image
            src={image}
            alt={
              post.featuredImage?.alt ||
              post.title
            }
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="font-serif text-lg font-bold leading-snug text-navy-900">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy-500">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}