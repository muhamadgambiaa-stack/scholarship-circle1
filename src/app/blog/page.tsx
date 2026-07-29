import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";
import type { BlogPost } from "@/types/scholarship";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Study-abroad tips, application guides, and scholarship news.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await client.fetch<BlogPost[]>(allPostsQuery).catch(() => []);
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Blog</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const img = urlForImage(post.featuredImage)?.width(600).height(360).url();
          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-40 w-full bg-navy-50">
                {img && <Image src={img} alt={post.title} fill className="object-cover" sizes="33vw" />}
              </div>
              <div className="p-4">
                <h2 className="font-serif text-lg font-semibold text-navy-900">{post.title}</h2>
                {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-navy-500">{post.excerpt}</p>}
                <p className="mt-3 text-xs text-navy-400">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {posts.length === 0 && <p className="mt-10 text-navy-500">No blog posts published yet.</p>}
    </div>
  );
}
