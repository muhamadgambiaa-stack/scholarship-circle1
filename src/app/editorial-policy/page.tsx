import type { Metadata } from "next";
import Link from "next/link";

import LegalPage from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Editorial and Verification Policy",
  description:
    "Learn how The Scholarship Circle researches, verifies, updates and corrects scholarship information.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      title="Editorial and Verification Policy"
      description="How The Scholarship Circle researches, verifies, publishes and updates scholarship information."
    >
      <p><strong>Last updated:</strong> September 11, 2026</p>

      <h2>1. Our Editorial Purpose</h2>
      <p>
        The Scholarship Circle helps students discover and understand
        scholarships, fellowships, internships, research opportunities,
        exchange programs and other educational opportunities. We do not
        award scholarships or control admission and funding decisions.
      </p>

      <h2>2. Sources We Use</h2>
      <p>
        We prioritize official university websites, government agencies,
        scholarship providers, foundations, research institutions,
        international organizations and official application portals.
        Third-party websites and social media may help us discover an
        opportunity, but they are not treated as the final authority.
      </p>

      <h2>3. What We Verify</h2>
      <p>
        Where information is available, we check the scholarship name,
        provider, eligibility, degree level, funding, benefits, deadline,
        documents, application process and official application link.
        Information we cannot confirm should not be presented as verified fact.
      </p>

      <h2>4. Official Sources and Last Verified Dates</h2>
      <p>
        Scholarship pages may show the official source used during our
        review and the date the information was last verified. Providers
        can change information after publication, so applicants should
        always check the official source before applying.
      </p>

      <h2>5. Funding Labels</h2>
      <p>
        We aim to distinguish accurately between fully funded, partially
        funded, tuition-only, stipend-supported, fully sponsored, paid,
        free and self-funded opportunities based on official information.
      </p>

      <h2>6. Deadlines</h2>
      <p>
        Some scholarships have different deadlines depending on country,
        university, program or applicant category. Applicants should use
        the official deadline that applies to their individual situation
        and check any stated time zone.
      </p>

      <h2>7. Updates and Expired Opportunities</h2>
      <p>
        We may update scholarship pages when official information changes.
        A Last Verified date should only be changed after a genuine review.
        Older opportunity pages may remain online for useful reference, but
        a previous cycle does not confirm that a new cycle is open.
      </p>

      <h2>8. Editorial Guides</h2>
      <p>
        Our guides are intended to provide practical educational value on
        applications, documents, interviews, motivation letters, study
        plans and related subjects rather than simply repeat announcements.
      </p>

      <h2>9. Use of Artificial Intelligence</h2>
      <p>
        We may use AI to assist with drafting, organization, language,
        research planning and formatting. AI is not treated as an official
        scholarship source. Scholarship-specific facts should be checked
        against authoritative sources before being presented as verified.
      </p>

      <h2>10. Corrections</h2>
      <p>
        Errors can occur. When important information is found to be
        incorrect or outdated, we aim to correct it as soon as reasonably
        possible. Possible errors can be reported through our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>

      <h2>11. Independence</h2>
      <p>
        The Scholarship Circle is independent and is not affiliated with
        universities, governments, scholarship providers or other
        institutions unless a relationship is explicitly stated.
      </p>

      <h2>12. Applicant Responsibility</h2>
      <p>
        Applicants remain responsible for confirming current eligibility,
        deadlines, required documents, funding and application instructions
        directly with the official provider before applying.
      </p>
    </LegalPage>
  );
}
