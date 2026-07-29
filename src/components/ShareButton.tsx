"use client";

import { Share } from "lucide-react";

type ShareButtonProps = {
  title: string;
};

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch {
        alert("Unable to copy the link.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      <Share size={18} />
      <span>Share</span>
    </button>
  );
}