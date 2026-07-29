import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read The Scholarship Circle's privacy policy to learn how we collect, use, and protect your information while you explore scholarship opportunities.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="The Scholarship Circle provides scholarship information only and respects your privacy. This policy explains what information we collect and how we use it."
    >
      <h2>Introduction</h2>
      <p>
        At The Scholarship Circle, we are committed to protecting the privacy of visitors who use our
        website to discover scholarships, study-abroad opportunities, and related educational
        resources.
      </p>
      <p>
        We provide scholarship information for informational purposes only and we take reasonable
        steps to protect the personal information you share with us.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information that you voluntarily provide, such as your name, email address,
        or message content when you contact us, subscribe to updates, or interact with our site.
      </p>
      <p>
        We may also collect limited technical information automatically, including browser type,
        device information, IP address, and usage patterns through analytics tools.
      </p>

      <h2>How We Use Information</h2>
      <p>
        We use collected information to improve the website, respond to enquiries, provide updates,
        understand user behaviour, and ensure our scholarship content remains relevant and useful.
      </p>

      <h2>Cookies</h2>
      <p>
        Our website may use cookies and similar technologies to remember preferences, analyze traffic,
        and improve the browsing experience.
      </p>

      <h2>Google Analytics</h2>
      <p>
        We may use Google Analytics to understand how visitors interact with the site. This helps us
        improve navigation, content quality, and overall performance.
      </p>

      <h2>Google AdSense</h2>
      <p>
        We may use Google AdSense to display relevant advertisements. AdSense may use cookies and
        other tracking technologies to show ads based on browsing behaviour and interests.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We may use third-party services such as analytics platforms, email tools, social media
        integrations, and advertising networks. These services operate under their own privacy
        policies.
      </p>

      <h2>External Links</h2>
      <p>
        Our website may contain links to external scholarship providers, institutions, and other
        third-party websites. We are not responsible for the privacy practices or content of those
        external sites.
      </p>

      <h2>Data Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect information against
        unauthorized access, misuse, or loss. However, no method of transmission over the Internet
        is completely secure.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our site is not intended for children under the age of 13. We do not knowingly collect
        personal information from children without parental consent.
      </p>

      <h2>Changes to this Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with an updated effective date.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at
        <a href="mailto:muhammedjbah84@gmail.com">muhammedjbah84@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
