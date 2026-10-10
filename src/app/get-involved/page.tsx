import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get Involved | The Scholarship Circle",
  description:
    "Volunteer with The Scholarship Circle, or partner with us as a university, scholarship provider, or organization to publish your scholarships.",
  alternates: { canonical: "/get-involved" },
  openGraph: {
    title: "Get Involved | The Scholarship Circle",
    description:
      "Two ways to work with us: volunteer your time, or partner with us to publish your scholarships.",
    url: "/get-involved",
    type: "website",
  },
};

export default function GetInvolvedPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Get involved
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          Work with The Scholarship Circle
        </h1>
        <p className="mt-4 text-base leading-relaxed text-navy-700">
          We are a small, volunteer-run team helping students find and apply
          for scholarships. There are two ways you can work with us.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/get-involved/volunteer"
          className="group flex flex-col rounded-lg border border-navy-200 bg-white p-6 shadow-sm transition hover:border-navy-500 hover:shadow-md"
        >
          <h2 className="font-serif text-xl font-semibold text-navy-900">
            Volunteer with us
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">
            Join our team. Contribute to scholarship research, writing,
            design, social media, community management, or growth. We welcome
            students, graduates, and professionals.
          </p>
          <span className="mt-4 text-sm font-semibold text-navy-700 transition group-hover:text-gold-600">
            Apply to volunteer →
          </span>
        </Link>

        <Link
          href="/get-involved/partnership"
          className="group flex flex-col rounded-lg border border-navy-200 bg-white p-6 shadow-sm transition hover:border-navy-500 hover:shadow-md"
        >
          <h2 className="font-serif text-xl font-semibold text-navy-900">
            Partner with us
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">
            Are you a university, scholarship provider, NGO, government body,
            or company with a scholarship you want students to know about?
            We can help you reach our audience.
          </p>
          <span className="mt-4 text-sm font-semibold text-navy-700 transition group-hover:text-gold-600">
            Submit a partnership →
          </span>
        </Link>
      </div>

      <p className="mt-10 text-sm text-navy-600">
        Not sure which applies to you? Email us and we will point you in the
        right direction.
      </p>
    </main>
  );
}
