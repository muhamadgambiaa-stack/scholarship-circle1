"use client";

import { useState } from "react";

export default function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function go() {
    setState("busy");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      setMessage(data.message || "");
      setState(res.ok && data.success ? "done" : "error");
    } catch {
      setMessage("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "done") return <p className="mt-6 font-medium text-navy-800">You have been unsubscribed. You will not receive further newsletters.</p>;
  return (
    <div className="mt-6">
      <button className="btn-primary" onClick={go} disabled={state === "busy"}>
        {state === "busy" ? "Please wait..." : "Yes, unsubscribe me"}
      </button>
      {state === "error" && <p className="mt-3 text-sm font-medium text-red-600">{message || "Something went wrong."}</p>}
    </div>
  );
}
