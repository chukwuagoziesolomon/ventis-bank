"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "@/components/AnimatedNumber";

const stats = [
  { value: 82000, prefix: "", suffix: "+", decimals: 0, label: "People banking with MidwesternBank" },
  { value: 148, prefix: "$", suffix: "M+", decimals: 0, label: "Moved between accounts monthly" },
  { value: 4.9, prefix: "", suffix: "/5", decimals: 1, label: "Average app rating" },
  { value: 60, prefix: "", suffix: "s", decimals: 0, label: "Average time to open an account" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-ink-950/40">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            className="text-center sm:text-left"
          >
            <p className="font-display text-3xl sm:text-4xl text-bone">
              <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </p>
            <p className="text-xs sm:text-sm text-bone/40 mt-2 leading-snug">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
