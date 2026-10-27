"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEGREE_LEVELS, FUNDING_TYPES, MAX_IMAGE_BYTES, MAX_SOURCE_LINKS, SUBMISSION_TYPES } from "@/lib/volunteer/config";

interface Option { _id: string; name: string }

const input = "w-full rounded-md border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-navy-500";
const label = "mb-1 block text-sm font-medium text-navy-900";
const hint = "mt-1 text-xs text-navy-500";
const FORMAT_HELP =
  "Formatting: leave a blank line between paragraphs. Start a line with ## for a heading, - for a bullet, 1. for a numbered list, > for a quote. Links: [text](https://...)";

function Field({ name, children, help }: { name: string; children: React.ReactNode; help?: string }) {
  return (
    <div>
      <label className={label}>{name}</label>
      {children}
      {help && <p className={hint}>{help}</p>}
    </div>
  );
}

export function SubmissionForm({ countries, categories }: { countries: Option[]; categories: Option[] }) {
  const router = useRouter();
  const [type, setType] = useState<string>(SUBMISSION_TYPES[0].value);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({ error: false, text: "" });
  const today = new Date().toISOString().slice(0, 10);
  const isScholarship = type === "scholarship";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const img = data.get("image");
    if (img instanceof File && img.size > MAX_IMAGE_BYTES) {
      return setState({ error: true, text: "The image is too large. Maximum size is 4 MB." });
    }
    setBusy(true);
    setState({ error: false, text: "" });
    try {
      const res = await fetch("/api/volunteer/submissions", { method: "POST", body: data });
      const json = await res.json().catch(() => ({ success: false, message: "Unexpected server response." }));
      const ok = res.ok && json.success;
      setState({ error: !ok, text: json.message || (ok ? "Submitted." : "Something went wrong.") });
      if (ok) {
        form.reset();
        router.refresh();
      }
    } catch {
      setState({ error: true, text: "Network error. Please try again." });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-5">
      <Field name="What are you submitting?">
        <select className={input} name="type" value={type} onChange={(e) => setType(e.target.value)}>
          {SUBMISSION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.title}</option>
          ))}
        </select>
      </Field>

      <Field name="Title *">
        <input className={input} name="title" required minLength={5} maxLength={150} />
      </Field>

      <Field name={isScholarship ? "Featured image *" : "Featured image (optional)"} help="JPG, PNG or WebP, up to 4 MB.">
        <input className={input} type="file" name="image" accept="image/jpeg,image/png,image/webp" required={isScholarship} />
      </Field>
      <Field name="Image description (alt text) *" help="Describe what is actually visible in the image. Required when you add an image.">
        <input className={input} name="imageAlt" maxLength={200} />
      </Field>

      <Field name="Short excerpt *" help="One or two sentences for the card and search results.">
        <textarea className={input} name="excerpt" rows={3} required minLength={30} maxLength={400} />
      </Field>

      <Field name={isScholarship ? "Full scholarship article *" : "Article body *"} help={FORMAT_HELP}>
        <textarea className={input} name="body" rows={14} required minLength={100} maxLength={20000} />
      </Field>

      {isScholarship ? (
        <>
          <Field name="Host country *">
            <select className={input} name="countryId" required defaultValue="">
              <option value="" disabled>Choose a country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field name="Categories" help="Choose up to 6.">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <label key={c._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="categoryIds" value={c._id} /> {c.name}
                </label>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="University"><input className={input} name="university" maxLength={200} /></Field>
            <Field name="Scholarship provider"><input className={input} name="provider" maxLength={200} /></Field>
          </div>

          <Field name="Degree levels">
            <div className="grid grid-cols-2 gap-2">
              {DEGREE_LEVELS.map((d) => (
                <label key={d.value} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="degreeLevels" value={d.value} /> {d.title}
                </label>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="Funding type">
              <select className={input} name="fundingType" defaultValue="">
                <option value="">Not specified</option>
                {FUNDING_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>{f.title}</option>
                ))}
              </select>
            </Field>
            <Field name="Application deadline">
              <input className={input} type="date" name="deadline" />
            </Field>
          </div>

          <Field name="Eligible countries" help="One country per line.">
            <textarea className={input} name="eligibleCountries" rows={4} />
          </Field>
          <Field name="Benefits" help="One benefit per line.">
            <textarea className={input} name="benefits" rows={4} />
          </Field>
          <Field name="Eligibility requirements" help="One requirement per line.">
            <textarea className={input} name="eligibility" rows={4} />
          </Field>
          <Field name="Required documents" help="One document per line.">
            <textarea className={input} name="requiredDocuments" rows={4} />
          </Field>
          <Field name="Application process" help={FORMAT_HELP}>
            <textarea className={input} name="applicationProcess" rows={6} maxLength={8000} />
          </Field>

          <h3 className="pt-2 font-serif text-lg font-bold text-navy-900">Verification</h3>
          <Field name="Official information source *" help="The university, government, foundation or provider you checked.">
            <input className={input} name="officialSourceName" required minLength={3} maxLength={200} />
          </Field>
          <Field name="Official source URL *" help="The official page you used. Do not use another scholarship blog.">
            <input className={input} type="url" name="officialSourceUrl" required placeholder="https://..." />
          </Field>
          <Field name="Official application link *">
            <input className={input} type="url" name="applicationLink" required placeholder="https://..." />
          </Field>
          <Field name="Last verified *" help="The date you checked the official source and confirmed the details.">
            <input className={input} type="date" name="lastVerifiedAt" required defaultValue={today} max={today} />
          </Field>
        </>
      ) : (
        <>
          <h3 className="pt-2 font-serif text-lg font-bold text-navy-900">Sources and further reading</h3>
          <p className={hint}>Official or trustworthy sources you used (universities, providers, government pages). Optional.</p>
          {Array.from({ length: MAX_SOURCE_LINKS }).map((_, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <input className={input} name="sourceTitle" placeholder={`Source ${i + 1} name`} maxLength={200} />
              <input className={input} type="url" name="sourceUrl" placeholder="https://..." />
            </div>
          ))}
        </>
      )}

      {state.text && <p className={`text-sm font-medium ${state.error ? "text-red-600" : "text-navy-800"}`}>{state.text}</p>}
      <button className="btn-primary" disabled={busy}>{busy ? "Submitting..." : "Submit for review"}</button>
    </form>
  );
}
