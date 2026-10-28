"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [adminKey, setAdminKey] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(test: boolean) {
    if (!adminKey.trim()) {
      alert("Enter your admin key.");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      alert("Subject and message are required.");
      return;
    }

    if (test && !testEmail.trim()) {
      alert("Enter the email address to send the test to.");
      return;
    }

    if (!test && !window.confirm("Send this newsletter to ALL active subscribers now? This cannot be undone.")) {
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
          ...(test ? { testEmail: testEmail.trim() } : {}),
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
        This dashboard requires the private admin key. Every email includes an unsubscribe link. Send yourself a test first.
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

        <div className="rounded-lg border p-4">
          <label className="mb-2 block font-semibold">
            Send a test first
          </label>

          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              className="min-w-[16rem] flex-1 rounded-lg border p-3"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <button
              onClick={() => send(true)}
              disabled={loading}
              className="rounded-lg border border-blue-700 px-5 py-3 text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send test
            </button>
          </div>
        </div>

        <button
          onClick={() => send(false)}
          disabled={loading}
          className="rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send to all subscribers"}
        </button>
      </div>
    </main>
  );
}
