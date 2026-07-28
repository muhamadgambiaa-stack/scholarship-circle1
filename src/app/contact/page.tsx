import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with The Scholarship Circle via email or WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page max-w-2xl py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Contact Us</h1>
      <p className="mt-3 text-navy-500">
        Have a question about a scholarship, or want to book a free consultation? Reach us
        directly using either channel below.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href="mailto:muhammedjbah84@gmail.com"
          className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white p-5 shadow-sm hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-gold-400">
            <Mail size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-900">Email</p>
            <p className="text-sm text-navy-500">muhammedjbah84@gmail.com</p>
          </div>
        </a>

        <a
          href="https://wa.me/6285642062883"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white p-5 shadow-sm hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-gold-400">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-900">WhatsApp</p>
            <p className="text-sm text-navy-500">+62 856-4206-2883</p>
          </div>
        </a>
      </div>

      <div className="mt-10 rounded-lg border border-navy-100 bg-navy-50/60 p-5 text-xs leading-relaxed text-navy-500">
        The Scholarship Circle is currently not active on any social media platforms. Our only
        official public platform is our WhatsApp Channel. Any social media account claiming to
        represent The Scholarship Circle is not affiliated with us. Official WhatsApp group
        links are shared only through our WhatsApp Channel.
      </div>
    </div>
  );
}
