import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "The Scholarship Circle: Genuine Scholarship Opportunities Worldwide",
    path: "/",
  }),
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">

  <Script
    async
    strategy="afterInteractive"
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9760558565445583"
    crossOrigin="anonymous"
  />

  <AnnouncementBar />
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
</body>
    </html>
  );
}
