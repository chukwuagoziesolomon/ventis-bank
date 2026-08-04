"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck, Eye, BellRing } from "lucide-react";

const points = [
  {
    icon: Lock,
    title: "Encrypted, end to end",
    desc: "Every transfer and login is protected with bank-grade encryption, both in transit and at rest.",
  },
  {
    icon: ShieldCheck,
    title: "FDIC-insured",
    desc: "Your deposits are insured up to $250,000 per depositor, the same protection as any national bank.",
  },
  {
    icon: Eye,
    title: "24/7 fraud monitoring",
    desc: "Unusual activity is flagged automatically, and you can freeze any card instantly from the app.",
  },
  {
    icon: BellRing,
    title: "Real-time alerts",
    desc: "Get notified the moment money moves, so nothing happens on your account without you knowing.",
  },
];

export default function SecuritySection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
      <div className="grid lg:grid-cols-2 gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">Security</p>
          <h2 className="font-display text-3xl sm:text-4xl text-bone mb-5">
            Held to the same standard as banks a century old.
          </h2>
          <p className="text-bone/45 leading-relaxed max-w-md">
            Being new doesn't mean being careless with your money. MidwesternBank is built on the same regulatory
            foundation as traditional banks, with modern tooling layered on top.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/5 bg-ink-800 p-5"
            >
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-teal-400/10 text-teal-300 mb-3">
                <p.icon className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-bone mb-1.5">{p.title}</h3>
              <p className="text-xs text-bone/40 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
