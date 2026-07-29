import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description:
    "Learn how The Scholarship Circle uses cookies and similar technologies, including Google Analytics and Google AdSense cookies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="This policy explains what cookies are, how we use them, and how you can manage your preferences."
    >
      <h2>What Cookies Are</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help us
        remember preferences and understand how visitors interact with the site.
      </p>

      <h2>Types of Cookies Used</h2>
      <p>
        We may use several types of cookies, including essential cookies for site functionality,
        analytics cookies to measure traffic, and advertising cookies to personalize or improve ad
        delivery.
      </p>

      <h2>Analytics Cookies</h2>
      <p>
        We may use Google Analytics cookies to collect information about how visitors use the site,
        such as pages visited, time spent on the site, and referral sources.
      </p>

      <h2>Advertising Cookies</h2>
      <p>
        We may use Google AdSense cookies to deliver relevant advertisements and measure ad
        performance. These cookies may be set by Google or other advertising partners.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can manage or disable cookies through your browser settings. Please note that disabling
        some cookies may affect the functionality of the website.
      </p>

      <h2>Third-Party Cookies</h2>
      <p>
        Some cookies may be placed by third-party services, including analytics and advertising
        providers such as Google. These third parties may use their own cookies according to their
        respective privacy policies.
      </p>
    </LegalPage>
  );
}
