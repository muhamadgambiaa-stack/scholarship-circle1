"use client";

import { useState, type FormEvent } from "react";

const ORGANIZATION_TYPES = [
  "University",
  "Scholarship provider",
  "NGO / non-profit",
  "Government body",
  "Private company",
  "Other",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 block w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-navy-900 shadow-sm placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";
const labelClass = "block text-sm font-medium text-navy-800";

export default function PartnershipForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      organizationName: String(fd.get("organizationName") || "").trim(),
      organizationType: String(fd.get("organizationType") || "").trim(),
      website: String(fd.get("website") || "").trim(),
      country: String(fd.get("country") || "").trim(),
      contactName: String(fd.get("contactName") || "").trim(),
      contactRole: String(fd.get("contactRole") || "").trim(),
      contactEmail: String(fd.get("contactEmail") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      publishRequest: String(fd.get("publishRequest") || "").trim(),
      scholarshipLink: String(fd.get("scholarshipLink") || "").trim(),
      deadline: String(fd.get("deadline") || "").trim(),
      additionalInfo: String(fd.get("additionalInfo") || "").trim(),
      _website: String(fd.get("_website") || ""),
    };

    try {
      const res = await fetch("/api/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ||
            "We could not submit your application. Please try again.",
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-gold-300 bg-gold-50 p-6 text-navy-900"
      >
        <h2 className="font-serif text-xl font-semibold">
          Thank you - your partnership application was submitted.
        </h2>
        <p className="mt-2 text-sm text-navy-700">
          We have received your details and will review them. We will contact
          you by email if we would like to move forward.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="_website">Leave this field blank</label>
        <input
          id="_website"
          name="_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="font-serif text-lg font-semibold text-navy-900">
          Your organization
        </legend>

        <div>
          <label htmlFor="organizationName" className={labelClass}>
            Organization / university name <span className="text-red-600">*</span>
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            required
            maxLength={200}
            autoComplete="organization"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="organizationType" className={labelClass}>
            Organization type <span className="text-red-600">*</span>
          </label>
          <select
            id="organizationType"
            name="organizationType"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Please choose...
            </option>
            {ORGANIZATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="website" className={labelClass}>
            Website URL <span className="text-red-600">*</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            required
            maxLength={500}
            placeholder="https://"
            autoComplete="url"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Country <span className="text-red-600">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            maxLength={100}
            autoComplete="country-name"
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-lg font-semibold text-navy-900">
          Contact person
        </legend>

        <div>
          <label htmlFor="contactName" className={labelClass}>
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            maxLength={150}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contactRole" className={labelClass}>
            Role / title (optional)
          </label>
          <input
            id="contactRole"
            name="contactRole"
            type="text"
            maxLength={150}
            autoComplete="organization-title"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className={labelClass}>
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={50}
            autoComplete="tel"
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-lg font-semibold text-navy-900">
          About the scholarship
        </legend>

        <div>
          <label htmlFor="publishRequest" className={labelClass}>
            What would you like us to publish?{" "}
            <span className="text-red-600">*</span>
          </label>
          <p className="mt-1 text-xs text-navy-500">
            Describe the scholarship or program. Include who is eligible,
            what is covered, and any key dates.
          </p>
          <textarea
            id="publishRequest"
            name="publishRequest"
            rows={6}
            required
            minLength={30}
            maxLength={5000}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="scholarshipLink" className={labelClass}>
            Link to the scholarship / program page (optional)
          </label>
          <input
            id="scholarshipLink"
            name="scholarshipLink"
            type="url"
            maxLength={500}
            placeholder="https://"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deadline" className={labelClass}>
            Deadline for applicants (optional)
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="additionalInfo" className={labelClass}>
            Anything else we should know? (optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            maxLength={3000}
            className={inputClass}
          />
        </div>
      </fieldset>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center rounded-md bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Submit partnership"}
        </button>
        <span className="text-xs text-navy-500">
          We will only use your details to review your application.
        </span>
      </div>
    </form>
  );
}
