import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { Scholarship } from "@/types/scholarship";

export default function VerificationBox({
  scholarship,
}: {
  scholarship: Scholarship;
}) {
  if (
    !scholarship.officialSourceUrl &&
    !scholarship.lastVerifiedAt
  ) {
    return null;
  }

  return (
    <section className="mt-10 max-w-3xl rounded-xl border border-navy-100 bg-navy-50/60 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck
          size={21}
          className="mt-0.5 shrink-0 text-gold-600"
        />

        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold text-navy-900">
            Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-navy-600">
            We review key scholarship details against information
            published by the official provider. Scholarship information
            can change, so applicants should confirm the latest details
            before submitting an application.
          </p>

          <div className="mt-4 space-y-2 text-sm text-navy-600">
            {scholarship.officialSourceUrl && (
              <p>
                <span className="font-semibold text-navy-800">
                  Official source:{" "}
                </span>

                <a
                  href={scholarship.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy-700 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
                >
                  {scholarship.officialSourceName ||
                    "View official information"}
                </a>
              </p>
            )}

            {scholarship.lastVerifiedAt && (
              <p>
                <span className="font-semibold text-navy-800">
                  Last verified:{" "}
                </span>

                <time dateTime={scholarship.lastVerifiedAt}>
                  {formatDate(scholarship.lastVerifiedAt)}
                </time>
              </p>
            )}
          </div>

          <Link
            href="/editorial-policy"
            className="mt-4 inline-flex text-xs font-semibold text-navy-700 underline decoration-gold-400 underline-offset-4 hover:text-navy-950"
          >
            Read our editorial and verification policy
          </Link>
        </div>
      </div>
    </section>
  );
}
