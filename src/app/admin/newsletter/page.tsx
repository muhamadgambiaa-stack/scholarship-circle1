"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendNewsletter() {
    setLoading(true);

    const res = await fetch("/api/newsletter/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        message,
      }),
    });

    const data = await res.json();

    alert(data.message);

    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        Newsletter Dashboard
      </h1>

      <div className="space-y-6">

        <div>
          <label className="font-semibold block mb-2">
            Subject
          </label>

          <input
            className="w-full border rounded-lg p-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Newsletter subject"
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Message
          </label>

          <textarea
            rows={12}
            className="w-full border rounded-lg p-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your newsletter..."
          />
        </div>

        <button
          onClick={sendNewsletter}
          disabled={loading}
          className="rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-800"
        >
          {loading ? "Sending..." : "Send Newsletter"}
        </button>

      </div>
    </main>
  );
}