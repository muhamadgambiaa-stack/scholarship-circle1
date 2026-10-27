import { redirect } from "next/navigation";
import { getCurrentVolunteer } from "@/lib/volunteer/session";
import { listSubmissionRecords, type SubmissionRecord } from "@/lib/volunteer/store";
import { getFormOptions, submissionStatuses, type Option, type SubmissionStatus } from "@/lib/volunteer/sanity";
import { LogoutButton } from "@/components/volunteer/VolunteerForms";
import { SubmissionForm } from "@/components/volunteer/SubmissionForm";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  published: "Published",
  pending: "Pending review",
  removed: "Not published",
};

export default async function VolunteerDashboard() {
  const volunteer = await getCurrentVolunteer();
  if (!volunteer) redirect("/volunteer/login");

  let records: SubmissionRecord[] = [];
  let statuses: Record<string, SubmissionStatus> = {};
  let options: { countries: Option[]; categories: Option[] } = { countries: [], categories: [] };
  let loadError = false;
  try {
    [records, options] = await Promise.all([listSubmissionRecords(volunteer.id), getFormOptions()]);
    statuses = await submissionStatuses(records.map((r) => r.id));
  } catch (error) {
    console.error("Dashboard load error", error);
    loadError = true;
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Hello, {volunteer.name}</h1>
          <p className="mt-2 text-navy-500">
            Submit scholarships, application tips and articles. Our team reviews everything before it goes live.
          </p>
        </div>
        <LogoutButton />
      </div>

      {loadError && (
        <p className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-700">
          Some information could not be loaded. Please refresh the page.
        </p>
      )}

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">New submission</h2>
      <SubmissionForm countries={options.countries} categories={options.categories} />

      <h2 className="mt-12 font-serif text-xl font-bold text-navy-900">Your submissions</h2>
      {records.length === 0 ? (
        <p className="mt-3 text-sm text-navy-500">Nothing yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-navy-100 rounded-md border border-navy-100">
          {records.map((r) => {
            const status = statuses[r.id] ?? "pending";
            return (
              <li key={r.id} className="p-4">
                <p className="font-medium text-navy-900">{r.title}</p>
                <p className="mt-1 text-xs text-navy-500">
                  {r.type === "scholarship" ? "Scholarship" : "Blog post"} · {new Date(r.createdAt).toLocaleDateString("en-GB")} ·{" "}
                  <span className={status === "published" ? "font-semibold text-green-700" : ""}>{STATUS_LABEL[status]}</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
