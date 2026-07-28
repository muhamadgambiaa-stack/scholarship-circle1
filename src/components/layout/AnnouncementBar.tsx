"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-navy-950 text-navy-100">
      <div className="container-page flex items-center gap-3 py-2 pr-8 text-xs leading-snug sm:text-[13px]">
        <MessageCircle size={16} className="hidden shrink-0 text-gold-400 sm:block" />
        <p className="flex-1">
          We are currently not active on any social media platform. Our only official public
          platform is our{" "}
          <a
            href="https://whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold-400 underline underline-offset-2 hover:text-gold-300"
          >
            WhatsApp Channel
          </a>
          . Any account elsewhere claiming to represent us is not affiliated with The
          Scholarship Circle.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss notice"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white sm:static sm:translate-y-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
