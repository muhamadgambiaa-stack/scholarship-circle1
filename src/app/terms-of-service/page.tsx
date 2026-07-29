import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Review the terms of use for The Scholarship Circle, including responsibilities, limitations, and conditions for using our site.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms govern your use of The Scholarship Circle website and the scholarship information we publish."
    >
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using The Scholarship Circle website, you agree to be bound by these Terms
        of Service and all applicable laws and regulations.
      </p>

      <h2>Website Purpose</h2>
      <p>
        The Scholarship Circle provides scholarship and study-abroad information for educational
        purposes. We aim to help users discover opportunities, but we do not guarantee eligibility,
        funding, or success.
      </p>

      <h2>User Responsibilities</h2>
      <p>
        You agree to use the site responsibly and not to misuse, scrape, or interfere with the
        availability or security of the platform.
      </p>

      <h2>Accuracy of Information</h2>
      <p>
        Scholarship information may change at any time. Users should always verify details on the
        official scholarship provider&apos;s website before applying or submitting any documents.
      </p>

      <h2>External Links</h2>
      <p>
        The site may contain links to third-party websites, institutions, and scholarship providers.
        We are not responsible for the content, quality, or accuracy of those external sources.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All original content on this website, including text, design, and branding, is owned by The
        Scholarship Circle unless otherwise stated. You may not reproduce or reuse our content
        without permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        The Scholarship Circle shall not be liable for any direct, indirect, or consequential damages
        arising from the use of this website, including loss of data, missed opportunities, or
        reliance on published information.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We may update these Terms of Service at any time. Continued use of the site after changes
        constitutes acceptance of the revised terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of the jurisdiction in which The Scholarship Circle
        operates, without regard to conflict of law principles.
      </p>

      <h2>Contact Information</h2>
      <p>
        For questions about these terms, please contact us at
        <a href="mailto:muhammedjbah84@gmail.com">muhammedjbah84@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
