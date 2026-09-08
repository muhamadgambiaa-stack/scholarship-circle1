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
      <nav
        className="hidden items-center gap-4 lg:flex xl:gap-5"
        aria-label="Main navigation"
      >
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                "whitespace-nowrap text-[13px] font-medium text-navy-600 transition-colors hover:text-navy-950 xl:text-sm",
                active && "font-semibold text-navy-950"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-navy-100 bg-white text-navy-800 transition-colors hover:bg-navy-50 lg:hidden"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>

      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-50 border-b border-navy-100 bg-white shadow-md lg:hidden"
        >
          <nav
            className="container-page flex flex-col py-3"
            aria-label="Mobile navigation"
          >
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "rounded-md px-3 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950",
                    active && "bg-navy-50 font-semibold text-navy-950"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
