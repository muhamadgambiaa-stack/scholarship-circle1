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

  keywords: [
    "The Scholarship Circle",
    "Scholarship Circle",
    "Scholarships",
    "Scholarship Opportunities",
    "Fully Funded Scholarships",
    "International Scholarships",
    "Study Abroad",
    "Study Abroad Scholarships",
    "Scholarships for International Students",
    "Scholarships for African Students",
    "Bachelor Scholarships",
    "Bachelor's Scholarships",
    "Master's Scholarships",
    "Masters Scholarships",
    "MBA Scholarships",
    "PhD Scholarships",
    "Doctoral Scholarships",
    "Postdoctoral Fellowships",
    "Research Scholarships",
    "Research Grants",
    "University Scholarships",
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
    "Scholarships in Indonesia",
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
    "Scholarship Applications",
    "Scholarship Deadlines",
    "Scholarship News",
    "Verified Scholarships",
    "Genuine Scholarships",
  ],

  other: {
    "google-adsense-account": "ca-pub-9760558565445583",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://thescholarshipcircle.com/#website",
        name: "The Scholarship Circle",
        alternateName: [
          "Scholarship Circle",
          "thescholarshipcircle.com",
        ],
        url: "https://thescholarshipcircle.com/",
        description:
          "The Scholarship Circle is a global scholarship platform helping students discover scholarships, fellowships, internships, exchange programs, and study abroad opportunities.",
        inLanguage: "en",
        publisher: {
          "@id": "https://thescholarshipcircle.com/#organization",
        },
      },

      {
        "@type": "Organization",
        "@id": "https://thescholarshipcircle.com/#organization",
        name: "The Scholarship Circle",
        alternateName: "Scholarship Circle",
        url: "https://thescholarshipcircle.com/",
        description:
          "The Scholarship Circle helps students around the world discover genuine scholarship opportunities and study abroad information.",
        logo: {
          "@type": "ImageObject",
          "@id": "https://thescholarshipcircle.com/#logo",
          url: "https://thescholarshipcircle.com/logo.png",
          contentUrl: "https://thescholarshipcircle.com/logo.png",
        },
        founder: {
          "@type": "Person",
          name: "Muhammed J Bah",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({
                'gtm.start': new Date().getTime(),
                event:'gtm.js'
              });

              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';

              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;

              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MQL82SLQ');
          `}
        </Script>

        {/* Google Site Name + Organization Schema */}
        <Script
          id="site-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema),
          }}
        />
      </head>

      <body className="flex min-h-screen flex-col">
        {/* Google Tag Manager - noscript */}
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