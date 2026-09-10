"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [adminKey, setAdminKey] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendNewsletter() {
    if (!adminKey.trim()) {
      alert("Enter your admin key.");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      alert("Subject and message are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({
        message: "Unexpected server response.",
      }));

      alert(
        data.message ||
          (res.ok
            ? "Newsletter sent."
            : "Newsletter could not be sent.")
      );
    } catch {
      alert("Newsletter could not be sent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-3 text-4xl font-bold">
        Newsletter Dashboard
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        This dashboard requires the private newsletter admin key.
      </p>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold">
            Admin Key
          </label>

          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border p-3"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Subject
          </label>

          <input
            className="w-full rounded-lg border p-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Newsletter subject"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Message
          </label>

          <textarea
            rows={12}
            className="w-full rounded-lg border p-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your newsletter..."
          />
        </div>

        <button
          onClick={sendNewsletter}
          disabled={loading}
          className="rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Newsletter"}
        </button>
      </div>
    </main>
  );
}
