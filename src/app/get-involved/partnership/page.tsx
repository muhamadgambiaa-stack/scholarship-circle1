import type { Metadata } from "next";
import PartnershipForm from "./PartnershipForm";

export const metadata: Metadata = {
  title: "Partner with The Scholarship Circle",
  description:
    "Universities, scholarship providers, NGOs, government bodies, and companies can partner with The Scholarship Circle to publish their scholarships.",
  alternates: { canonical: "/get-involved/partnership" },
  openGraph: {
    title: "Partner with The Scholarship Circle",
    description:
      "Reach our audience of scholarship-seeking students. Submit a partnership application.",
    url: "/get-involved/partnership",
    type: "website",
  },
};

export default function PartnershipPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Partnership
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          Partner with The Scholarship Circle
        </h1>
        <p className="mt-4 text-base leading-relaxed text-navy-700">
          If you are a university, scholarship provider, NGO, government
          body, or company with a scholarship or program you want students
          to know about, tell us about it here.
        </p>
        <p className="mt-3 text-sm text-navy-600">
          We review every partnership application carefully. Submitting this
          form does not guarantee publication. We will follow up by email if
          there is a good fit.
        </p>
      </header>

      <PartnershipForm />
    </main>
  );
}
