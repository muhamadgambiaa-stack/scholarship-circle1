import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-3 sm:h-16">
        {/* Brand */}
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2"
          aria-label="The Scholarship Circle home"
        >
          {/* Logo */}
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9">
            <Image
              src="/logo.png"
              alt="The Scholarship Circle logo"
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </span>

          {/* Site Name */}
          <span className="whitespace-nowrap font-serif text-sm font-bold leading-none text-navy-900 sm:text-base lg:text-lg">
            The Scholarship Circle
          </span>
        </Link>

        {/* Navigation */}
        <div className="ml-auto flex shrink-0 items-center">
          <Navigation />
        </div>

        {/* Desktop CTA */}
        <Link
          href="/scholarships"
          className="btn-primary hidden shrink-0 lg:inline-flex"
        >
          Find Scholarships
        </Link>
      </div>
    </header>
  );
}
