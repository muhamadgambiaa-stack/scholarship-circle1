export default function ConsultationCTA() {
  return (
    <section className="container-page py-10 sm:py-12">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gold-200 bg-gold-50 p-6 text-center sm:p-8">
        <h2 className="font-serif text-xl font-bold sm:text-2xl text-navy-900">
          Need Help Choosing the Right Scholarship?
        </h2>
        <p className="max-w-xl text-sm text-navy-600">
          Book a free consultation and get personalized guidance on finding and applying to
          scholarships that match your profile.
        </p>
        <a href="/contact" className="btn-primary">
          Book a Free Consultation
        </a>
      </div>
    </section>
  );
}

