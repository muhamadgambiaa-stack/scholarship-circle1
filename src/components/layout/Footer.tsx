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
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/founder", label: "Founder" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-950 text-navy-100">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <span className="font-serif text-base font-bold text-white">
            The Scholarship Circle
          </span>

          <p className="mt-2 max-w-xs text-xs leading-5 text-navy-300 sm:text-sm">
            Helping students discover genuine scholarship and study-abroad
            opportunities worldwide.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-400">
              {column.title}
            </h3>

            <ul className="mt-3 space-y-1.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-navy-200 transition-colors hover:text-white sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            Contact
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <a
              href="mailto:muhammedjbah84@gmail.com"
              aria-label="Email The Scholarship Circle"
              title="Email us"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 text-navy-200 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <Mail size={16} />
            </a>

            <a
              href="https://www.whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Scholarship Circle official WhatsApp Channel"
              title="Official WhatsApp Channel"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 text-navy-200 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <MessageCircle size={16} />
            </a>
          </div>

          <p className="mt-3 max-w-[190px] text-[11px] leading-4 text-navy-400">
            Our WhatsApp Channel is our official public platform.
          </p>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container-page py-3 text-[11px] text-navy-400 sm:text-xs">
          © {new Date().getFullYear()} The Scholarship Circle. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
