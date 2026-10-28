import type { Metadata } from "next";
import UnsubscribeButton from "./UnsubscribeButton";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default function NewsletterUnsubscribePage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || "";
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy-900">Unsubscribe</h1>
      {token ? (
        <>
          <p className="mt-4 text-navy-500">Do you want to stop receiving The Scholarship Circle newsletter?</p>
          <UnsubscribeButton token={token} />
        </>
      ) : (
        <p className="mt-4 text-navy-500">
          This unsubscribe link is out of date. Please use the Unsubscribe link at the bottom of our latest newsletter, or
          contact us through the contact page and we will remove you.
        </p>
      )}
    </div>
  );
}
