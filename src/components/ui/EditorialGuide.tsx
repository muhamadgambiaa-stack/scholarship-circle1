import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "sanity";

import { formatDate } from "@/lib/utils";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 font-serif text-xl font-bold leading-tight text-navy-900 sm:text-2xl">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 font-serif text-lg font-bold leading-snug text-navy-900 sm:text-xl">
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
      <ul className="my-4 list-disc space-y-2 pl-6 text-navy-700">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-navy-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-7">{children}</li>
    ),

    number: ({ children }) => (
      <li className="text-base leading-7">{children}</li>
    ),
  },
};

export default function EditorialGuide({
  content,
  lastReviewedAt,
}: {
  content?: PortableTextBlock[];
  lastReviewedAt?: string;
}) {
  if (!content?.length) return null;

  return (
    <section className="mt-8 max-w-3xl border-t border-navy-100 pt-7">
      <PortableText
        value={content}
        components={components}
      />

      {lastReviewedAt && (
        <p className="mt-6 text-xs leading-5 text-navy-400">
          Last reviewed: {formatDate(lastReviewedAt)}
        </p>
      )}
    </section>
  );
}