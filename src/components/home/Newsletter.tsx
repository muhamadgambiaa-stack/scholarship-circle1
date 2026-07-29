"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.message || "We could not complete your subscription.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Thanks for subscribing!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("We could not complete your subscription. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-sm font-medium text-navy-800">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
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
            <button type="submit" className="btn-primary shrink-0" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {message && status === "error" && (
          <p className="text-sm font-medium text-red-600">{message}</p>
        )}
      </div>
    </section>
  );
}
