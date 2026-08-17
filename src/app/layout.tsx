import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { buildMetadata, SITE_URL } from "@/lib/seo";

const SITE_NAME = "The Scholarship Circle";

const SITE_DESCRIPTION =
  "The Scholarship Circle helps students discover genuine scholarship opportunities, fully funded scholarships, fellowships, internships, exchange programs, grants, and study abroad opportunities from universities, governments, and international organizations worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} | Genuine Scholarship Opportunities Worldwide`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  creator: "Muhammed J Bah",

  authors: [
    {
      name: "Muhammed J Bah",
      url: `${SITE_URL}/founder`,
    },
  ],

  publisher: SITE_NAME,

  category: "Education",

  classification: "Scholarships, Education, Study Abroad",

  keywords: [
    "The Scholarship Circle",
    "Scholarship Circle",
    "scholarships",
    "scholarship opportunities",
    "fully funded scholarships",
    "international scholarships",
    "study abroad",
    "study abroad scholarships",
    "scholarships for international students",
    "scholarships for African students",
    "bachelor scholarships",
    "bachelor's scholarships",
    "master's scholarships",
    "masters scholarships",
    "MBA scholarships",
    "PhD scholarships",
    "doctoral scholarships",
    "fellowships",
    "internships",
    "international internships",
    "exchange programs",
    "student exchange programs",
    "research scholarships",
    "research grants",
    "university scholarships",
    "government scholarships",
    "merit scholarships",
    "need based scholarships",
    "scholarship applications",
    "scholarship deadlines",
    "scholarship news",
    "verified scholarships",
    "genuine scholarships",
    "scholarships without IELTS",
    "scholarships without TOEFL",
    "fully funded masters",
    "fully funded PhD",
    "scholarships in USA",
    "scholarships in Canada",
    "scholarships in UK",
    "scholarships in Germany",
    "scholarships in Australia",
    "scholarships in Japan",
    "scholarships in China",
    "scholarships in South Korea",
    "scholarships in Italy",
    "scholarships in France",
    "scholarships in Netherlands",
    "scholarships in Switzerland",
    "scholarships in Indonesia",
    "scholarships in New Zealand",
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
    "university admissions",
    "study abroad opportunities",
    "international education",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Genuine Scholarship Opportunities Worldwide`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Genuine Scholarship Opportunities Worldwide`,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

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
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: "Scholarship Circle",
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },

      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Scholarship Circle",
        url: `${SITE_URL}/`,
        description:
          "The Scholarship Circle is an independent scholarship information platform helping students discover genuine scholarship opportunities and reliable study abroad information.",
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          contentUrl: `${SITE_URL}/logo.png`,
        },
        founder: {
          "@type": "Person",
          name: "Muhammed J Bah",
          url: `${SITE_URL}/founder`,
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

        {/* Google WebSite + Organization structured data */}
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

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}