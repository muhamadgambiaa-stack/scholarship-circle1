"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cx } from "@/lib/utils";

export default function SearchBar({ variant = "default" }: { variant?: "hero" | "default" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    setTerm(q);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = term.trim();

    if (!trimmed) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cx(
        "flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg",
        variant === "hero" ? "shadow-xl" : "border border-navy-100"
      )}
      role="search"
    >
      <Search size={20} className="ml-2 shrink-0 text-navy-400" aria-hidden />
      <label htmlFor="scholarship-search" className="sr-only">
        Search scholarships by country, degree level, university, or title
      </label>
      <input
        id="scholarship-search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by country, university, degree level..."
        className="w-full border-none py-2 text-sm text-navy-900 outline-none placeholder:text-navy-400"
      />
      <button type="submit" className="btn-primary shrink-0">
        Search
      </button>
    </form>
  );
}
