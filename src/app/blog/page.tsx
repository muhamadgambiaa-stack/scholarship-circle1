import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import type { BlogPost } from "@/types/scholarship";

import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DiscoverMoreSidebar from "@/components/layout/DiscoverMoreSidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Scholarship application guides, study-abroad advice and practical student resources.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await client
    .fetch<BlogPost[]>(allPostsQuery)
    .catch(() => []);

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog" },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="font-serif text-3xl font-bold text-navy-900">
          Scholarship Guides
        </h1>

        <p className="mt-2 text-base leading-7 text-navy-500">
          Practical guidance to help you prepare stronger
          scholarship and study-abroad applications.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">
        <main className="min-w-0">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {posts.map((post) => {
                const image = urlForImage(
                  post.featuredImage
                )
                  ?.width(700)
                  .height(420)
                  .url();

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-navy-100 bg-white transition hover:border-navy-200 hover:shadow-sm"
                  >
                    <div className="relative h-44 w-full bg-navy-50">
                      {image && (
                        <Image
                          src={image}
                          alt={post.featuredImage?.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      )}
                    </div>

                    <div className="p-4">
                      <h2 className="font-serif text-lg font-semibold leading-snug text-navy-900">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy-500">
                          {post.excerpt}
                        </p>
                      )}

                      {post.publishedAt && (
                        <p className="mt-3 text-xs text-navy-400">
                          {formatDate(post.publishedAt)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-navy-500">
              No guides published yet.
            </p>
          )}
        </main>

        <aside>
          <div className="lg:sticky lg:top-20">
            <DiscoverMoreSidebar showGuides={false} />
          </div>
        </aside>
      </div>
    </div>
  );
}
