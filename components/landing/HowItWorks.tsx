"use client";

import { motion } from "framer-motion";
import { UserPlus, ArrowDownToLine, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Open your account",
    desc: "Verify your identity in under a minute. No paperwork, no branch visit, no waiting period.",
  },
  {
    number: "02",
    icon: ArrowDownToLine,
    title: "Add money",
    desc: "Link an existing bank, transfer a balance, or receive your first deposit directly by account number.",
  },
  {
    number: "03",
    icon: Send,
    title: "Send, spend, save",
    desc: "Move money to anyone, create a card for a subscription, and watch your savings earn 4.25% APY.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-xl mb-16"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">The process</p>
        <h2 className="font-display text-3xl sm:text-4xl text-bone">From sign-up to first transfer, in minutes.</h2>
      </motion.div>

      <div className="relative grid sm:grid-cols-3 gap-10 sm:gap-8">
        <div className="hidden sm:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="relative z-10 grid place-items-center w-12 h-12 rounded-full bg-ink-800 border border-gold-400/30 text-gold-300">
                <step.icon className="w-5 h-5" />
              </span>
              <span className="font-mono text-sm text-bone/25">{step.number}</span>
            </div>
            <h3 className="font-display text-xl text-bone mb-2">{step.title}</h3>
            <p className="text-sm text-bone/45 leading-relaxed max-w-xs">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
