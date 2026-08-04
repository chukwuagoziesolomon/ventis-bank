"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Snowflake, Wifi } from "lucide-react";
import { Card } from "@/lib/types";
import { maskCardNumber } from "@/lib/utils";

const palettes: Record<Card["color"], { bg: string; text: string; ring: string }> = {
  gold: {
    bg: "linear-gradient(135deg,#1B2540 0%,#0B1220 55%,#2A2110 100%)",
    text: "#F1E2C0",
    ring: "rgba(212,175,106,0.5)",
  },
  teal: {
    bg: "linear-gradient(135deg,#0F2A2A 0%,#0B1220 55%,#123434 100%)",
    text: "#B9F1E8",
    ring: "rgba(95,207,192,0.5)",
  },
  ink: {
    bg: "linear-gradient(135deg,#20263A 0%,#0B1220 60%,#171D2E 100%)",
    text: "#F3F1EC",
    ring: "rgba(255,255,255,0.25)",
  },
};

export default function BankCard({ card, className }: { card: Card; className?: string }) {
  const palette = palettes[card.color];
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 150, damping: 15 });
  const springRy = useSpring(ry, { stiffness: 150, damping: 15 });
  const transform = useMotionTemplate`perspective(800px) rotateX(${springRx}deg) rotateY(${springRy}deg)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  }

  function handleMouseLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, background: palette.bg, color: palette.text }}
      className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 shadow-card overflow-hidden select-none ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-foil bg-[length:250%_250%] animate-shimmer opacity-70 pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-lg tracking-wide">MidwesternBank</p>
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-70 mt-0.5">
            {card.type === "physical" ? "Physical" : "Virtual"}
          </p>
        </div>
        <Wifi className="w-5 h-5 opacity-70 rotate-90" />
      </div>

      <div className="relative mt-6 sm:mt-8">
        <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#F1E2C0]/80 to-[#A67F3A]/60 mb-3" />
        <p className="font-mono text-base sm:text-lg tracking-widest">
          {maskCardNumber(card.last4)}
        </p>
      </div>

      <div className="relative flex items-end justify-between mt-5 sm:mt-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Card holder</p>
          <p className="text-sm font-medium mt-0.5">{card.holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Expires</p>
          <p className="text-sm font-mono mt-0.5">{card.expiry}</p>
        </div>
        <p className="font-display italic text-xl">
          {card.network === "visa" ? "VISA" : "MC"}
        </p>
      </div>

      {card.frozen && (
        <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10">
          <Snowflake className="w-6 h-6 text-teal-300" />
          <p className="text-xs uppercase tracking-[0.2em] text-teal-200">Frozen</p>
        </div>
      )}
    </motion.div>
  );
}
