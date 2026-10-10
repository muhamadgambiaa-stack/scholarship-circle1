import type { Metadata } from "next";
import VolunteerForm from "./VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer with The Scholarship Circle",
  description:
    "Apply to volunteer with The Scholarship Circle. Contribute to scholarship research, writing, design, community, or growth.",
  alternates: { canonical: "/volunteer" },
  openGraph: {
    title: "Volunteer with The Scholarship Circle",
    description:
      "Join the team behind The Scholarship Circle. Research, write, design, or help us grow.",
    url: "/volunteer",
    type: "website",
  },
};

export default function VolunteerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Get involved
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          Volunteer with The Scholarship Circle
        </h1>
        <p className="mt-4 text-base leading-relaxed text-navy-700">
          We are a small, volunteer-run team helping students find and apply
          for scholarships. Tell us a bit about yourself and how you would
          like to help. We review every application carefully.
        </p>
        <p className="mt-3 text-sm text-navy-600">
          Submitting an application does not guarantee selection. We will
          reach out if there is a good fit and a role available.
        </p>
      </header>

      <VolunteerForm />
    </main>
  );
}
