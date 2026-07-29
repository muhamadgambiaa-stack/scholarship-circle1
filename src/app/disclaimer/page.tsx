import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Read the disclaimer for The Scholarship Circle, including guidance on accuracy, external links, and the independent nature of our platform.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="The Scholarship Circle is an independent scholarship information platform. This disclaimer explains the limits of our responsibility and the nature of the information we provide."
    >
      <h2>Educational Purpose</h2>
      <p>
        The information published on The Scholarship Circle is provided for educational and research
        purposes. It is intended to help users explore scholarship opportunities and understand
        available options.
      </p>

      <h2>No Guarantee of Scholarships</h2>
      <p>
        We do not guarantee that any scholarship listed will be awarded, that any application will be
        successful, or that funding will be available at the time of application.
      </p>

      <h2>Accuracy of Information</h2>
      <p>
        We make every effort to keep the information accurate and up to date, but scholarship details
        may change without notice. Users should always confirm deadlines, eligibility, and official
        application instructions through the relevant provider.
      </p>

      <h2>External Links</h2>
      <p>
        Our website may include links to third-party websites and scholarship providers. We do not
        endorse or assume responsibility for the content or practices of those sites.
      </p>

      <h2>Independent Platform Statement</h2>
      <p>
        The Scholarship Circle is an independent scholarship information platform and is not
        affiliated with universities, governments, or scholarship providers unless explicitly
        stated. We are not an admissions office, scholarship agency, or official representative of
        any institution.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you have questions about this disclaimer, please contact us at
        <a href="mailto:muhammedjbah84@gmail.com">muhammedjbah84@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
