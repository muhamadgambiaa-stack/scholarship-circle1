import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/scholarships", label: "All Scholarships" },
      { href: "/categories", label: "Categories" },
      { href: "/countries", label: "Countries" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/founder", label: "Founder" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-950 text-navy-100">
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-serif text-lg font-bold text-white">The Scholarship Circle</span>
          <p className="mt-3 text-sm text-navy-300">
            Helping students around the world discover genuine, fully-funded scholarship
            opportunities and access reliable study-abroad information.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Contact</h3>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="mailto:muhammedjbah84@gmail.com"
              aria-label="Email us at muhammedjbah84@gmail.com"
              title="Email us"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-navy-200 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://wa.me/6285642062883"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message us on WhatsApp"
              title="WhatsApp us"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-navy-200 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800 bg-navy-950">
        <div className="container-page py-4 text-xs text-navy-400">
          © {new Date().getFullYear()} The Scholarship Circle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
