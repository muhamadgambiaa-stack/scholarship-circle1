import { MessageCircle } from "lucide-react";

export default function WhatsAppChannel() {
  return (
    <section className="bg-navy-950 py-14">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-400">
          <MessageCircle size={28} />
        </span>
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          Join Our Official WhatsApp Channel
        </h2>
        <p className="max-w-xl text-sm text-navy-300">
          Get new scholarship alerts and application deadlines the moment we publish them. This
          is currently our only official public platform.
        </p>
        <a
          href="https://whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Join the WhatsApp Channel
        </a>
        <p className="max-w-2xl text-xs leading-relaxed text-navy-500">
          The Scholarship Circle is currently not active on any social media platforms. Any
          social media account claiming to represent The Scholarship Circle is not affiliated
          with us. Official WhatsApp group links are shared only through our WhatsApp Channel.
        </p>
      </div>
    </section>
  );
}
