import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Subscription", robots: { index: false, follow: false } };

export default function NewsletterConfirmedPage({ searchParams }: { searchParams: { status?: string } }) {
  const ok = searchParams.status === "ok";
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy-900">
        {ok ? "You are subscribed" : "This link is not valid"}
      </h1>
      <p className="mt-4 text-navy-500">
        {ok
          ? "Thank you for confirming. You will now receive scholarship and study-abroad updates from The Scholarship Circle."
          : "The confirmation link is invalid or has expired. Please subscribe again from the home page to get a new one."}
      </p>
      <Link href="/" className="btn-primary mt-8 inline-block">Back to home</Link>
    </div>
  );
}
