import { ForgotForm } from "@/components/volunteer/VolunteerForms";

export default function VolunteerForgotPage() {
  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-navy-900">Reset your password</h1>
      <p className="mt-3 text-navy-500">Enter the email your volunteer account uses and we will send you a link.</p>
      <ForgotForm />
    </>
  );
}
