import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "The Scholarship Circle | Genuine Scholarship Opportunities Worldwide",
    description:
      "The Scholarship Circle helps students discover genuine, fully funded scholarships, fellowships, internships, exchange programs, grants, and study abroad opportunities from universities, governments, and international organizations worldwide.",
    path: "/",
  }),

  metadataBase: new URL(SITE_URL),

  applicationName: "The Scholarship Circle",

  keywords: [
    "The Scholarship Circle",
    "Scholarship Circle",
    "Scholarships",
    "Fully Funded Scholarships",
    "International Scholarships",
    "Study Abroad",
    "Study Abroad Opportunities",
    "Scholarship Opportunities",
    "Scholarships for International Students",
    "Scholarships for African Students",
    "Bachelor Scholarships",
    "Bachelor's Scholarships",
    "Masters Scholarships",
    "Master's Scholarships",
    "MBA Scholarships",
    "PhD Scholarships",
    "Doctoral Scholarships",
    "Postdoctoral Fellowships",
    "Research Scholarships",
    "Research Grants",
    "University Scholarships",
    "College Scholarships",
    "Government Scholarships",
    "Merit Scholarships",
    "Need-Based Scholarships",
    "Scholarships Without IELTS",
    "Scholarships Without TOEFL",
    "Fully Funded Masters",
    "Fully Funded PhD",
    "Scholarships in USA",
    "Scholarships in Canada",
    "Scholarships in UK",
    "Scholarships in Germany",
    "Scholarships in Australia",
    "Scholarships in Japan",
    "Scholarships in China",
    "Scholarships in South Korea",
    "Scholarships in Italy",
    "Scholarships in France",
    "Scholarships in Netherlands",
    "Scholarships in Switzerland",
    "Scholarships in indonesia",
    "Scholarships in New Zealand",
    "Erasmus Mundus Scholarship",
    "Chevening Scholarship",
    "Commonwealth Scholarship",
    "DAAD Scholarship",
    "MEXT Scholarship",
    "Fulbright Scholarship",
    "Rhodes Scholarship",
    "Gates Cambridge Scholarship",
    "Knight-Hennessy Scholarship",
    "Stipendium Hungaricum",
    "McCall MacBain Scholarship",
    "Jefferson Scholars",
    "Internships",
    "International Internships",
    "Fellowships",
    "Youth Opportunities",
    "Exchange Programs",
    "Student Exchange",
    "University Admissions",
    "Scholarship Application",
    "Scholarship Deadlines",
    "Scholarship News",
    "Verified Scholarships",
    "Genuine Scholarships",
    "Muhammed J bah scholarship circle",
  ],

  creator: "Muhammed J Bah",

  authors: [
    {
      name: "Muhammed J Bah",
      url: "https://thescholarshipcircle.com/founder",
    },
  ],

  publisher: "The Scholarship Circle",

  category: "Education",

  classification: "Scholarships, Education, Study Abroad",

  other: {
    "google-adsense-account": "ca-pub-9760558565445583",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://thescholarshipcircle.com/#organization",
        name: "The Scholarship Circle",
        alternateName: "Scholarship Circle",
        description:
          "Helping students around the world discover genuine scholarship opportunities and study abroad information.",
        url: "https://thescholarshipcircle.com",
        logo: {
          "@type": "ImageObject",
          url: "https://thescholarshipcircle.com/icon.png",
        },
        founder: {
          "@type": "Person",
          name: "Muhammed J Bah",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://thescholarshipcircle.com/#website",
        name: "The Scholarship Circle",
        alternateName: "Scholarship Circle",
        description:
          "A global scholarship platform helping students discover verified scholarships, fellowships, internships, and study abroad opportunities.",
        url: "https://thescholarshipcircle.com",
        inLanguage: "en",
        publisher: {
          "@id": "https://thescholarshipcircle.com/#organization",
        }
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MQL82SLQ');
          `}
        </Script>

        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="flex min-h-screen flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQL82SLQ"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <AnnouncementBar />

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}