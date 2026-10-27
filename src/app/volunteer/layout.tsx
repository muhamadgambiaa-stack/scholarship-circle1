import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer area",
  robots: { index: false, follow: false },
};

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <div className="container-page max-w-2xl py-10">{children}</div>;
}
