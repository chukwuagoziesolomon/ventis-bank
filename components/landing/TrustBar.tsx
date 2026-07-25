"use client";

const companies = [
  "Halcyon Labs",
  "Ondo Studio",
  "Ferry & Finch",
  "Kaya Collective",
  "Nia Interiors",
  "Merit & Co.",
  "Southbound Goods",
  "Loam Robotics",
];

export default function TrustBar() {
  const doubled = [...companies, ...companies];
  return (
    <div className="py-10 overflow-hidden border-b border-white/5">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-bone/30 mb-6">
        Payroll runs on Vantis at
      </p>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent z-10" />
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-14">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-xl sm:text-2xl italic text-bone/25 whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
