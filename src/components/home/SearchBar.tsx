"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cx } from "@/lib/utils";

export default function SearchBar({
  variant = "default",
}: {
  variant?: "hero" | "default";
}) {
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
        "flex items-center rounded-lg bg-white p-1.5",
        variant === "hero"
          ? "shadow-md"
          : "border border-navy-100 shadow-sm"
      )}
      role="search"
    >
      <Search
        size={18}
        className="ml-2 shrink-0 text-navy-400"
        aria-hidden
      />

      <label htmlFor="scholarship-search" className="sr-only">
        Search scholarships
      </label>

      <input
        id="scholarship-search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search scholarships..."
        className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-sm text-navy-900 outline-none placeholder:text-navy-400"
      />

      <button
        type="submit"
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-navy-800 px-3 text-xs font-semibold text-white transition-colors hover:bg-navy-700 sm:px-4 sm:text-sm"
      >
        Search
      </button>
    </form>
  );
}
