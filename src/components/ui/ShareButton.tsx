'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ShareButton({
  title,
  description,
  className,
  label = "Share",
  url,
}: {
  title: string;
  description?: string;
  className?: string;
  label?: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") {
      return;
    }

    const currentUrl = url
      ? url.startsWith("http")
        ? url
        : `${window.location.origin}${url}`
      : window.location.href;

    const shareData = {
      title: `${title} | The Scholarship Circle`,
      text: description || title,
      url: currentUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // Ignore share sheet errors and fall back to clipboard.
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Ignore clipboard errors and fall back to prompt.
    }

    window.prompt("Copy this link:", shareData.url);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className || "inline-flex items-center justify-center rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 transition hover:border-navy-300 hover:text-navy-900"}
      style={{ display: "inline-flex", zIndex: 10, position: "relative" }}
    >
      {copied ? "Link copied" : label}
    </button>
  );
}
