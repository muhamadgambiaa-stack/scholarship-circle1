import { redirect } from "next/navigation";
import { SUBMISSION_CATEGORIES } from "@/lib/volunteer/config";
import { getCurrentVolunteer } from "@/lib/volunteer/session";
import { listSubmissions, type SubmissionRow } from "@/lib/volunteer/sanity";
import { LogoutButton, SubmissionForm } from "@/components/volunteer/VolunteerForms";

export const dynamic = "force-dynamic";

export default async function VolunteerDashboard() {
  const volunteer = await getCurrentVolunteer();
  if (!volunteer) redirect("/volunteer/login");

  let submissions: SubmissionRow[] = [];
  try {
    submissions = await listSubmissions(volunteer.id);
  } catch (error) {
    console.error("Dashboard submissions error", error);
  }
  const label = (v: string) => SUBMISSION_CATEGORIES.find((c) => c.value === v)?.title ?? v;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Hello, {volunteer.name}</h1>
          <p className="mt-2 text-navy-500">
            Share scholarship opportunities, tips and guides. Everything is reviewed by our team before it is published.
          </p>
        </div>
        <LogoutButton />
      </div>

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">New submission</h2>
      <SubmissionForm />

      <h2 className="mt-12 font-serif text-xl font-bold text-navy-900">Your submissions</h2>
      {submissions.length === 0 ? (
        <p className="mt-3 text-sm text-navy-500">Nothing yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-navy-100 rounded-md border border-navy-100">
          {submissions.map((s) => (
            <li key={s.id} className="p-4">
              <p className="font-medium text-navy-900">{s.title}</p>
              <p className="mt-1 text-xs text-navy-500">
                {label(s.category)} · {new Date(s.createdAt).toLocaleDateString("en-GB")} ·{" "}
                <span className={s.published ? "font-semibold text-green-700" : ""}>
                  {s.published ? "Approved" : "Pending review"}
                </span>
              </p>
              {s.reviewNote && <p className="mt-2 text-sm text-navy-600">Reviewer note: {s.reviewNote}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
