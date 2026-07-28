import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "Learn about The Scholarship Circle's mission to make study-abroad information accessible to students worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">About The Scholarship Circle</h1>
      <div className="prose prose-navy mt-6 max-w-none prose-headings:font-serif">
        <p>
          The Scholarship Circle exists to make one thing simple: finding genuine, verified
          scholarship opportunities without wading through scams, outdated listings, or
          confusing application requirements.
        </p>
        <p>
          We curate bachelor&apos;s, master&apos;s, PhD, fellowship, internship, and exchange
          opportunities from around the world, and break each one down into the details that
          actually matter &mdash; eligibility, funding type, deadlines, required documents, and
          the official application link.
        </p>
        <h2>Our Mission</h2>
        <p>
          To help students everywhere access study-abroad opportunities on merit, not on who
          happens to know where to look. We believe reliable information should be free and
          easy to find.
        </p>
        <h2>What Makes Us Different</h2>
        <ul>
          <li>Every scholarship we publish is checked for legitimacy before it goes live.</li>
          <li>We link directly to official application pages &mdash; no middlemen, no paid placements.</li>
          <li>New opportunities are shared as soon as we verify them, through our WhatsApp Channel.</li>
        </ul>
      </div>
    </div>
  );
}
