"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cx } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/categories", label: "Categories" },
  { href: "/countries", label: "Countries" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/founder", label: "Founder" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cx(
              "text-sm font-medium text-navy-700 transition-colors hover:text-navy-900",
              pathname === link.href && "text-navy-900 font-semibold"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        className="inline-flex items-center justify-center rounded-md p-2 text-navy-800 lg:hidden"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-30 border-b border-navy-100 bg-white p-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/scholarships" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Find Scholarships
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
