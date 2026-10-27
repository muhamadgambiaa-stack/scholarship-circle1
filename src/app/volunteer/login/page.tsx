import { redirect } from "next/navigation";
import { getCurrentVolunteer } from "@/lib/volunteer/session";
import { LoginForm } from "@/components/volunteer/VolunteerForms";

export const dynamic = "force-dynamic";

export default async function VolunteerLoginPage() {
  if (await getCurrentVolunteer()) redirect("/volunteer");
  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-navy-900">Volunteer sign in</h1>
      <p className="mt-3 text-navy-500">
        Volunteer accounts are created by invitation after your application is approved.
      </p>
      <LoginForm />
    </>
  );
}
