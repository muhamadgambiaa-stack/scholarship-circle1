import type { ReactNode } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface LegalPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <main className="mt-6">
        <header className="rounded-2xl border border-navy-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Legal Information
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-navy-700">{description}</p>
        </header>

        <section className="prose prose-navy mt-8 max-w-none prose-headings:font-serif prose-h2:text-2xl prose-h3:text-xl">
          {children}
        </section>
      </main>
    </div>
  );
}
