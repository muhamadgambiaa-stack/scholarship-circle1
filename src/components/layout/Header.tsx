import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/80 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-14 items-center gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="The Scholarship Circle home"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full sm:h-8 sm:w-8">
            <Image
              src="/logo.png"
              alt="The Scholarship Circle logo"
              fill
              className="object-cover"
              sizes="32px"
              priority
            />
          </span>

          <span className="truncate whitespace-nowrap font-serif text-sm font-bold leading-none text-navy-900 sm:text-base">
            The Scholarship Circle
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center">
          <Navigation />
        </div>

        <Link
          href="/scholarships"
          className="hidden h-9 shrink-0 items-center justify-center rounded-md bg-navy-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-700 lg:inline-flex"
        >
          Find Scholarships
        </Link>
      </div>
    </header>
  );
}
