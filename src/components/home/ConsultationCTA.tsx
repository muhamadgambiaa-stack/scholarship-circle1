export default function ConsultationCTA() {
  return (
    <section className="container-page py-14">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gold-200 bg-gold-50 p-10 text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-900">
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
