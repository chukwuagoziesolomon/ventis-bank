"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I switched my whole studio's payroll to Vantis. Everyone got paid the same afternoon instead of three days later.",
    name: "Tolu Adebayo",
    role: "Founder, Ferry & Finch",
    initials: "TA",
  },
  {
    quote:
      "Freezing my card from the app when I lost my wallet took ten seconds. My old bank would have kept me on hold for twenty minutes.",
    name: "Femi Balogun",
    role: "Product designer",
    initials: "FB",
  },
  {
    quote:
      "The savings account actually explains what my interest is doing instead of burying it in a PDF statement once a month.",
    name: "Nia Chen",
    role: "Independent contractor",
    initials: "NC",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-xl mb-14"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">People who moved</p>
        <h2 className="font-display text-3xl sm:text-4xl text-bone">What switching actually feels like.</h2>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/5 bg-ink-800 p-6 flex flex-col"
          >
            <blockquote className="font-display text-lg text-bone/85 leading-snug flex-1">
              "{t.quote}"
            </blockquote>
            <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 grid place-items-center text-ink-950 text-xs font-semibold shrink-0">
                {t.initials}
              </span>
              <div>
                <p className="text-sm text-bone">{t.name}</p>
                <p className="text-xs text-bone/40">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
