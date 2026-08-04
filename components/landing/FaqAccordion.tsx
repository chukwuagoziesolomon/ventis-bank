"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is MidwesternBank a real bank?",
    a: "MidwesternBank operates through a partnership with an FDIC-insured bank, so your deposits are insured up to $250,000 per depositor, the same protection you'd get from any national bank.",
  },
  {
    q: "Are there monthly fees?",
    a: "No. Everyday Checking and Growth Savings both have no monthly maintenance fees, no minimum balance requirements, and no fee for standard transfers.",
  },
  {
    q: "How fast do transfers arrive?",
    a: "Transfers between MidwesternBank accounts are instant. Transfers to external banks typically arrive within one business day.",
  },
  {
    q: "Can I freeze a card if I lose it?",
    a: "Yes. Freezing and unfreezing a card takes one tap in the app and applies immediately, no call required.",
  },
  {
    q: "What happens to my money if MidwesternBank shuts down?",
    a: "Your deposits sit with our FDIC-insured partner bank, not with MidwesternBank directly, so they remain insured and accessible regardless of what happens to MidwesternBank as a company.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">Questions</p>
        <h2 className="font-display text-3xl sm:text-4xl text-bone">Before you open an account.</h2>
      </motion.div>

      <div className="divide-y divide-white/5 border-t border-b border-white/5">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm sm:text-base text-bone font-medium">{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-gold-300"
                >
                  <Plus className="w-5 h-5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-bone/45 leading-relaxed pb-5 max-w-xl">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
