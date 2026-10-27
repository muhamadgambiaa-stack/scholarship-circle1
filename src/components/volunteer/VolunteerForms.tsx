"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SUBMISSION_CATEGORIES } from "@/lib/volunteer/config";

const input = "w-full rounded-md border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-navy-500";

async function post(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({ success: false, message: "Unexpected server response." }));
  return { ok: res.ok && json.success, message: (json.message as string) || "" };
}

function Message({ error, text }: { error: boolean; text: string }) {
  if (!text) return null;
  return <p className={`text-sm font-medium ${error ? "text-red-600" : "text-navy-800"}`}>{text}</p>;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await post("/api/volunteer/login", { email, password });
    setBusy(false);
    if (!r.ok) return setError(r.message || "Login failed.");
    router.push("/volunteer");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input className={input} type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={input} type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Message error text={error} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      <p className="text-center text-sm text-navy-500">
        <Link href="/volunteer/forgot" className="underline">Forgot your password?</Link>
      </p>
    </form>
  );
}

export function SetupForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("The two passwords do not match.");
    setBusy(true);
    setError("");
    const r = await post("/api/volunteer/setup", { token, password });
    setBusy(false);
    if (!r.ok) return setError(r.message || "Could not save your password.");
    router.push("/volunteer");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input className={input} type="password" required minLength={10} autoComplete="new-password" placeholder="New password (10+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input className={input} type="password" required minLength={10} autoComplete="new-password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <Message error text={error} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Saving..." : "Save password and continue"}</button>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({ error: false, text: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await post("/api/volunteer/forgot", { email });
    setBusy(false);
    setState({ error: !r.ok, text: r.message });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input className={input} type="email" required autoComplete="email" placeholder="Your volunteer email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Message error={state.error} text={state.text} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Sending..." : "Email me a reset link"}</button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="text-sm underline text-navy-500"
      onClick={async () => {
        await post("/api/volunteer/logout", {});
        router.push("/volunteer/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

export function SubmissionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(SUBMISSION_CATEGORIES[0].value);
  const [link, setLink] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({ error: false, text: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState({ error: false, text: "" });
    const r = await post("/api/volunteer/submissions", { title, category, link, body });
    setBusy(false);
    setState({ error: !r.ok, text: r.message });
    if (r.ok) {
      setTitle("");
      setLink("");
      setBody("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <input className={input} required maxLength={150} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
        {SUBMISSION_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.title}</option>
        ))}
      </select>
      <input className={input} type="url" placeholder="Official link (optional) https://..." value={link} onChange={(e) => setLink(e.target.value)} />
      <textarea className={input} rows={10} required minLength={20} maxLength={8000} placeholder="Write your content here. Include deadlines, eligibility and the official source." value={body} onChange={(e) => setBody(e.target.value)} />
      <Message error={state.error} text={state.text} />
      <button className="btn-primary" disabled={busy}>{busy ? "Submitting..." : "Submit for review"}</button>
    </form>
  );
}
