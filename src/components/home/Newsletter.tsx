"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire this up to your email provider (Resend, Mailchimp, ConvertKit, etc.)
    setStatus("success");
  }

  return (
    <section className="bg-navy-50/60 py-14">
      <div className="container-page flex flex-col items-center gap-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-gold-400">
          <Mail size={22} />
        </span>
        <h2 className="section-heading">Never Miss a Scholarship</h2>
        <p className="max-w-md text-sm text-navy-500">
          Subscribe to get new scholarship opportunities delivered to your inbox.
        </p>
        {status === "success" ? (
          <p className="text-sm font-medium text-navy-800">Thanks for subscribing! 🎉</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-navy-500"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
