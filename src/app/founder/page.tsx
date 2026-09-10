import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Founder: Muhammed J Bah",
  description:
    "Meet Muhammed J Bah, founder of The Scholarship Circle, and learn why he created the platform for students searching for scholarship opportunities.",
  path: "/founder",
});

export default function FounderPage() {
  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder" },
        ]}
      />

      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">
        Meet the Founder
      </h1>

      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-navy-100">
          <Image
            src="/founder.jpg"
            alt="Muhammed J Bah, Founder of The Scholarship Circle"
            fill
            className="object-cover"
            sizes="160px"
            priority
          />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            Muhammed J Bah
          </h2>

          <p className="text-navy-500">
            Founder, The Scholarship Circle
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href="mailto:muhammedjbah84@gmail.com"
              className="flex items-center gap-2 text-navy-700 hover:text-navy-900"
            >
              <Mail size={16} />
              muhammedjbah84@gmail.com
            </a>

            <a
              href="https://www.whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-navy-700 hover:text-navy-900"
            >
              <MessageCircle size={16} />
              Official WhatsApp Channel
            </a>
          </div>
        </div>
      </div>

      <article className="prose prose-navy mt-10 max-w-none prose-headings:font-serif">
        <h2>Background</h2>

        <p>
          Muhammed J Bah is a Gambian undergraduate student studying
          in Indonesia on a fully funded scholarship. His experience
          studying abroad helped strengthen his interest in making
          educational opportunities easier for students to discover
          and understand.
        </p>

        <h2>Why The Scholarship Circle Was Created</h2>

        <p>
          Scholarship information is often scattered across university,
          government, foundation and program websites. Students may also
          encounter incomplete, outdated or misleading information while
          searching through social media and third-party platforms.
        </p>

        <p>
          The Scholarship Circle was created to bring useful opportunities
          together in one place while encouraging applicants to verify
          important details through the organization responsible for each
          opportunity.
        </p>

        <h2>Editorial Approach</h2>

        <p>
          The platform focuses on scholarships, fellowships, internships,
          exchange programs, research opportunities and practical
          application guidance. The aim is not simply to collect links,
          but to present information in a clearer and more useful format
          for students.
        </p>

        <p>
          The Scholarship Circle is independent and does not award
          scholarships or control admission decisions. Applicants are
          encouraged to confirm deadlines, eligibility, funding and
          application requirements with official providers before applying.
        </p>

        <p>
          You can read more about how opportunities are reviewed in our{" "}
          <Link href="/editorial-policy">
            Editorial and Verification Policy
          </Link>.
        </p>
      </article>
    </div>
  );
}
