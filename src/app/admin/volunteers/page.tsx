"use client";

import { useState } from "react";

interface Applicant { id: string; type: string; name: string | null; email: string | null; createdAt: string }
interface Volunteer { id: string; email: string; name: string; status: "invited" | "active" | "suspended"; hasPassword: boolean; createdAt: string; suspendedReason?: string }

const box = "w-full rounded-lg border p-2.5 text-sm";
const btn = "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50";

export default function AdminVolunteersPage() {
  const [key, setKey] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");

  async function call(path: string, init?: RequestInit) {
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", "x-admin-key": key.trim(), ...(init?.headers || {}) } });
    const data = await res.json().catch(() => ({ success: false, message: "Unexpected server response." }));
    return { ok: res.ok && data.success, data };
  }

  async function load() {
    if (!key.trim()) return setNotice("Enter the admin key first.");
    setBusy(true);
    const [a, v] = await Promise.all([call("/api/admin/applicants"), call("/api/admin/volunteers")]);
    setBusy(false);
    if (a.ok) setApplicants(a.data.applicants);
    if (v.ok) setVolunteers(v.data.volunteers);
    const problems = [!a.ok && `Applicants: ${a.data.message}`, !v.ok && `Volunteers: ${v.data.message}`].filter(Boolean);
    setNotice(problems.length ? (problems as string[]).join(" | ") : "Loaded.");
  }

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    const r = await call("/api/admin/volunteers", { method: "POST", body: JSON.stringify(body) });
    setNotice(r.data.message || (r.ok ? "Done." : "Failed."));
    setBusy(false);
    if (r.ok) load();
  }

  async function sendEmail() {
    setBusy(true);
    const r = await call("/api/admin/applicants/email", { method: "POST", body: JSON.stringify({ to, subject, message }) });
    setNotice(r.data.message || (r.ok ? "Sent." : "Failed."));
    setBusy(false);
    if (r.ok) { setSubject(""); setMessage(""); }
  }

  function suspend(v: Volunteer) {
    const reason = window.prompt(`Reason for suspending ${v.email}? (this is saved and can be emailed to them)`);
    if (!reason?.trim()) return;
    const notify = window.confirm("Also email them a suspension notice?");
    act({ action: "suspend", email: v.email, reason, notify });
  }

  const badge = (s: string) =>
    s === "active" ? "bg-green-100 text-green-800" : s === "suspended" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-4xl font-bold">Applicants &amp; Volunteers</h1>
      <p className="mb-6 text-sm text-gray-500">All emails sent from here are marked &quot;do not reply&quot;.</p>

      <div className="mb-4 flex gap-3">
        <input type="password" autoComplete="current-password" className={box} placeholder="Admin key" value={key} onChange={(e) => setKey(e.target.value)} />
        <button className="rounded-lg bg-blue-700 px-5 text-sm text-white disabled:opacity-60" onClick={load} disabled={busy}>Load</button>
      </div>
      {notice && <p className="mb-6 rounded-md bg-gray-100 p-3 text-sm">{notice}</p>}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Applications ({applicants.length})</h2>
        {applicants.length === 0 ? (
          <p className="text-sm text-gray-500">None found. If you expect some, check APPLICATION_TYPES in src/lib/volunteer/config.ts. You can still use the forms below.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Type</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Date</th><th className="p-3" /></tr></thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3">{a.type.replace("Application", "")}</td>
                    <td className="p-3">{a.name || "-"}</td>
                    <td className="p-3">{a.email || "-"}</td>
                    <td className="p-3">{new Date(a.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="space-x-2 p-3 text-right whitespace-nowrap">
                      {a.email && <button className={btn} onClick={() => setTo(a.email!)}>Email</button>}
                      {a.email && a.type.toLowerCase().includes("volunteer") && (
                        <button className={btn} disabled={busy} onClick={() => act({ action: "invite", email: a.email, name: a.name || "Volunteer" })}>Invite as volunteer</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-xl font-semibold">Send an email</h2>
        <input className={box} placeholder="To (applicant email)" value={to} onChange={(e) => setTo(e.target.value)} />
        <input className={box} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea className={box} rows={7} placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="rounded-lg bg-blue-700 px-5 py-2 text-sm text-white disabled:opacity-60" onClick={sendEmail} disabled={busy || !to || !subject || !message}>Send (do-not-reply)</button>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-xl font-semibold">Invite a volunteer</h2>
        <div className="flex flex-wrap gap-3">
          <input className={`${box} flex-1`} placeholder="Full name" value={invName} onChange={(e) => setInvName(e.target.value)} />
          <input className={`${box} flex-1`} type="email" placeholder="Email" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} />
          <button className="rounded-lg bg-blue-700 px-5 text-sm text-white disabled:opacity-60" disabled={busy || !invName || !invEmail} onClick={() => act({ action: "invite", email: invEmail, name: invName })}>Send invite</button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Volunteer accounts ({volunteers.length})</h2>
        {volunteers.length === 0 ? (
          <p className="text-sm text-gray-500">No accounts yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.email} className="border-t align-top">
                    <td className="p-3">{v.name}</td>
                    <td className="p-3">{v.email}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${badge(v.status)}`}>{v.status}</span>
                      {v.suspendedReason && <p className="mt-1 max-w-xs text-xs text-gray-500">{v.suspendedReason}</p>}
                    </td>
                    <td className="space-x-2 p-3 text-right whitespace-nowrap">
                      {v.status !== "suspended" && <button className={btn} disabled={busy} onClick={() => suspend(v)}>Suspend</button>}
                      {v.status === "suspended" && <button className={btn} disabled={busy} onClick={() => act({ action: "reactivate", email: v.email })}>Reactivate</button>}
                      {v.status === "invited" && <button className={btn} disabled={busy} onClick={() => act({ action: "invite", email: v.email, name: v.name })}>Resend invite</button>}
                      <button className={`${btn} text-red-700`} disabled={busy} onClick={() => window.confirm(`Delete ${v.email} permanently?`) && act({ action: "delete", email: v.email })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
