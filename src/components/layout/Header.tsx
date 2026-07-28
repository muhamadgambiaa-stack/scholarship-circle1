import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image src="/logo.png" alt="The Scholarship Circle logo" fill className="object-cover" sizes="36px" priority />
          </span>
          <span className="font-serif text-lg font-bold text-navy-900">
            The Scholarship Circle
          </span>
        </Link>
        <Navigation />
        <Link href="/scholarships" className="btn-primary hidden sm:inline-flex">
          Find Scholarships
        </Link>
      </div>
    </header>
  );
}
