import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Founder: Muhammed J Bah",
  description: "Meet Muhammed J Bah, founder of The Scholarship Circle.",
  path: "/founder",
});

export default function FounderPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Founder" }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-navy-900">Meet the Founder</h1>

      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-navy-100">
          <Image
            src="/founder.jpg"
            alt="Muhammed J Bah, Founder of The Scholarship Circle"
            fill
            className="object-cover"
            sizes="160px"
            priority
          />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-900">Muhammed J Bah</h2>
          <p className="text-navy-500">Founder, The Scholarship Circle</p>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href="mailto:muhammedjbah84@gmail.com" className="flex items-center gap-2 text-navy-700 hover:text-navy-900">
              <Mail size={16} /> muhammedjbah84@gmail.com
            </a>
            <a
              href="https://wa.me/6285642062883"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-navy-700 hover:text-navy-900"
            >
              <MessageCircle size={16} /> +62 856-4206-2883
            </a>
          </div>
        </div>
      </div>

      <div className="prose prose-navy mt-8 max-w-none">
        <p>
          Muhammed J Bah is a Gambian student currently pursuing his undergraduate studies in
          Indonesia on a fully funded scholarship. He founded The Scholarship Circle to help
          students around the world discover genuine scholarship opportunities and make
          study-abroad information easier to access.
        </p>
      </div>
    </div>
  );
}
