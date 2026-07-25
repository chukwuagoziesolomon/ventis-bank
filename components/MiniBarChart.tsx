"use client";

import { motion } from "framer-motion";

export default function MiniBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2.5 sm:gap-4 h-40">
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full h-32 rounded-lg bg-white/[0.03] overflow-hidden flex items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-lg bg-gradient-to-t from-gold-600 via-gold-400 to-gold-200"
            />
          </div>
          <span className="text-[11px] text-bone/40">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
