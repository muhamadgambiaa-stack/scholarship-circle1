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
      <div className="container-page relative py-20 sm:py-28">
        <p className="mb-3 inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
          Genuine Scholarships, Verified Weekly
        </p>
        <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
          Discover Fully-Funded Scholarships Worldwide
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-navy-200">
          The Scholarship Circle curates genuine bachelor&apos;s, master&apos;s, PhD, and
          fellowship opportunities so you can focus on your application, not on spotting
          scams.
        </p>
        <div className="mt-8 max-w-2xl">
          <SearchBar variant="hero" />
        </div>
      </div>
    </section>
  );
}
