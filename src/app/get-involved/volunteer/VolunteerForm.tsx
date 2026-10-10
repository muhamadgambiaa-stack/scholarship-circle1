"use client";

import { useState, type FormEvent } from "react";

const CONTRIBUTION_AREAS = [
  "Scholarship research and verification",
  "Writing and editing scholarship articles",
  "Social media and content creation",
  "Graphic design and visual content",
  "Website and technology",
  "Community management",
  "Marketing and growth",
  "Partnerships and outreach",
  "Other",
] as const;

const AVAILABILITY_OPTIONS = [
  "A few hours per week",
  "5-10 hours per week",
  "More than 10 hours per week",
  "Flexible, depending on the task",
] as const;

const ROLE_OPTIONS = ["Student", "Graduate", "Professional", "Other"] as const;

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 block w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-navy-900 shadow-sm placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";
const labelClass = "block text-sm font-medium text-navy-800";

export default function VolunteerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedContributions, setSelectedContributions] = useState<string[]>(
    [],
  );

  function toggleContribution(area: string) {
    setSelectedContributions((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      fullName: String(fd.get("fullName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      country: String(fd.get("country") || "").trim(),
      currentRole: String(fd.get("currentRole") || "").trim(),
      skills: String(fd.get("skills") || "").trim(),
      motivation: String(fd.get("motivation") || "").trim(),
      ideas: String(fd.get("ideas") || "").trim(),
      contributions: selectedContributions,
      availability: String(fd.get("availability") || "").trim(),
      additionalInfo: String(fd.get("additionalInfo") || "").trim(),
      _website: String(fd.get("_website") || ""),
    };

    try {
      const res = await fetch("/api/volunteer", {
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
      setSelectedContributions([]);
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
          Thank you - your application was submitted.
        </h2>
        <p className="mt-2 text-sm text-navy-700">
          We have received your details and will review them. Because we are a
          volunteer team, this may take a little time. We will contact you by
          email if we would like to move forward.
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
          About you
        </legend>

        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Country of residence <span className="text-red-600">*</span>
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

        <div>
          <label htmlFor="currentRole" className={labelClass}>
            Current role <span className="text-red-600">*</span>
          </label>
          <select
            id="currentRole"
            name="currentRole"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Please choose...
            </option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-lg font-semibold text-navy-900">
          How you can help
        </legend>

        <div>
          <label htmlFor="skills" className={labelClass}>
            What skills, experience, or knowledge can you contribute?{" "}
            <span className="text-red-600">*</span>
          </label>
          <textarea
            id="skills"
            name="skills"
            rows={5}
            required
            minLength={20}
            maxLength={3000}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="motivation" className={labelClass}>
            Why do you want to volunteer with The Scholarship Circle?{" "}
            <span className="text-red-600">*</span>
          </label>
          <textarea
            id="motivation"
            name="motivation"
            rows={4}
            required
            minLength={20}
            maxLength={3000}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="ideas" className={labelClass}>
            What ideas do you have for improving or growing The Scholarship
            Circle? <span className="text-red-600">*</span>
          </label>
          <textarea
            id="ideas"
            name="ideas"
            rows={4}
            required
            minLength={10}
            maxLength={3000}
            className={inputClass}
          />
        </div>

        <fieldset>
          <legend className={labelClass}>
            Which areas would you like to contribute to?{" "}
            <span className="text-red-600">*</span>
          </legend>
          <p className="mt-1 text-xs text-navy-500">Select all that apply.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {CONTRIBUTION_AREAS.map((area) => {
              const checked = selectedContributions.includes(area);
              return (
                <label
                  key={area}
                  className={
                    "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm " +
                    (checked
                      ? "border-navy-500 bg-navy-50"
                      : "border-navy-200 bg-white")
                  }
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={checked}
                    onChange={() => toggleContribution(area)}
                  />
                  <span className="text-navy-800">{area}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="availability" className={labelClass}>
            How much time can you contribute?{" "}
            <span className="text-red-600">*</span>
          </label>
          <select
            id="availability"
            name="availability"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Please choose...
            </option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="additionalInfo" className={labelClass}>
            Additional information (optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={3}
            maxLength={2000}
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
          {status === "submitting" ? "Submitting..." : "Submit application"}
        </button>
        <span className="text-xs text-navy-500">
          We will only use your details to review your application.
        </span>
      </div>
    </form>
  );
}
