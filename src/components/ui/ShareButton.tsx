"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { trackAction } from "@/lib/analytics/track";

export default function ShareButton({
  title,
  description,
  className,
  label = "Share",
  url,
  message,
}: {
  title: string;
  description?: string;
  className?: string;
  label?: string;
  url?: string;
  message?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;

    const currentUrl = url
      ? url.startsWith("http")
        ? url
        : `${window.location.origin}${url}`
      : window.location.href;

    const shareData = message
      ? { title, text: message }
      : {
          title: `${title} | The Scholarship Circle`,
          text: description || title,
          url: currentUrl,
        };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share(shareData);
        trackAction("share");
        return;
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }
    }

    const copyValue = message || currentUrl;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(copyValue);
        trackAction("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fall back to manual copying.
    }

    window.prompt(
      message ? "Copy this message:" : "Copy this link:",
      copyValue
    );
  }

  const buttonClass =
    className ||
    "inline-flex items-center justify-center gap-2 rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 transition hover:border-navy-300 hover:text-navy-900";

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Share ${title}`}
        className={buttonClass}
        style={{
          display: "inline-flex",
          zIndex: 10,
          position: "relative",
        }}
      >
        {copied ? (
          <Check size={16} />
        ) : (
          <Share2 size={16} />
        )}
        <span>{copied ? "Copied" : label}</span>
      </button>

      {message && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          onClick={() => trackAction("whatsapp")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${title} on WhatsApp`}
          className={buttonClass}
        >
          WhatsApp
        </a>
      )}

      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
