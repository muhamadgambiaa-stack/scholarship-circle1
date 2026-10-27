import { SetupForm } from "@/components/volunteer/VolunteerForms";

export const dynamic = "force-dynamic";

export default function VolunteerSetupPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || "";
  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-navy-900">Choose your password</h1>
      {token ? (
        <SetupForm token={token} />
      ) : (
        <p className="mt-4 text-navy-500">This link is incomplete. Open the link from your email again.</p>
      )}
    </>
  );
}
