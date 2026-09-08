import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(230,171,53,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(79,126,197,0.5), transparent 45%)",
        }}
        aria-hidden
      />

      <div className="container-page relative py-10 sm:py-14">
        <p className="mb-3 inline-flex rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300 sm:text-xs">
          Genuine Scholarships, Verified Weekly
        </p>

        <h1 className="max-w-2xl font-serif text-[30px] font-bold leading-[1.15] text-white sm:text-4xl">
          Discover Fully-Funded Scholarships Worldwide
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-navy-200 sm:text-base sm:leading-7">
          The Scholarship Circle curates genuine bachelor&apos;s, master&apos;s,
          PhD, and fellowship opportunities so you can focus on your
          application, not on spotting scams.
        </p>

        <div className="mt-6 max-w-xl">
          <SearchBar variant="hero" />
        </div>
      </div>
    </section>
  );
}
