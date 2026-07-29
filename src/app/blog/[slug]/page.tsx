import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, allPostsQuery } from "@/sanity/lib/queries";
import type { BlogPost } from "@/types/scholarship";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ShareButton from "@/components/ui/ShareButton";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await client.fetch<BlogPost[]>(allPostsQuery).catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug: params.slug });
  const image = urlForImage(post?.featuredImage)?.width(1200).height(630).url();
  return buildMetadata({
    title: post?.seoTitle || post?.title || "Blog Post",
    description: post?.seoDescription || post?.excerpt,
    path: `/blog/${params.slug}`,
    image,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug: params.slug });
  if (!post) notFound();

  const img = urlForImage(post.featuredImage)?.width(1200).height(600).url();

  return (
    <article className="container-page py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title }]} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="max-w-3xl font-serif text-3xl font-bold text-navy-900">{post.title}</h1>
          <p className="mt-2 text-sm text-navy-400">{formatDate(post.publishedAt)}</p>
        </div>
        <ShareButton
          title={post.title}
          description={post.excerpt || post.seoDescription || post.title}
          className="rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 transition hover:border-navy-300 hover:text-navy-900"
          label="Share this post"
        />
      </div>
      {img && (
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-lg bg-navy-50 sm:h-96">
          <Image src={img} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        </div>
      )}
      {post.body && (
        <div className="prose prose-navy mt-8 max-w-3xl prose-headings:font-serif prose-a:text-navy-700">
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
