"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Snowflake } from "lucide-react";
import PhoneFrame from "./PhoneFrame";
import BankCard from "@/components/BankCard";
import { Card } from "@/lib/types";

const previewCard: Card = {
  id: "showcase",
  label: "Travel Card",
  holder: "You",
  last4: "9021",
  expiry: "11/29",
  type: "virtual",
  network: "mastercard",
  frozen: false,
  limit: 2000,
  spent: 640,
  color: "teal",
  accountId: "acc",
};

const mockTx = [
  { title: "Kaya Coffee Roasters", amount: "-$8.50", credit: false },
  { title: "From Alex Morgan", amount: "+$620.00", credit: true },
  { title: "Ondo Electric Co.", amount: "-$142.18", credit: false },
];

function BalanceScreen() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-[10px] uppercase tracking-[0.15em] text-bone/40">Everyday Checking</p>
      <p className="font-mono text-2xl text-bone mt-1">$8,420.52</p>
      <div className="flex items-end gap-1.5 h-16 mt-5 mb-5">
        {[40, 65, 30, 80, 100, 55, 25].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-gold-600 to-gold-300" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="space-y-3 flex-1">
        {mockTx.map((tx) => (
          <div key={tx.title} className="flex items-center gap-2.5">
            <span
              className={`w-7 h-7 rounded-full grid place-items-center shrink-0 ${
                tx.credit ? "bg-teal-400/10 text-teal-300" : "bg-white/5 text-bone/50"
              }`}
            >
              {tx.credit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            </span>
            <p className="text-[11px] text-bone/70 flex-1 truncate">{tx.title}</p>
            <p className={`text-[11px] font-mono ${tx.credit ? "text-teal-300" : "text-bone/70"}`}>{tx.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardScreen() {
  return (
    <div className="h-full flex flex-col justify-center gap-4">
      <BankCard card={previewCard} />
      <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-bone/60 flex items-center gap-1.5">
          <Snowflake className="w-3 h-3" /> Freeze card
        </span>
        <span className="w-8 h-[18px] rounded-full bg-white/10 relative">
          <span className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-bone/60" />
        </span>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 space-y-24 sm:space-y-32">
      <div className="grid sm:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">See everything</p>
          <h2 className="font-display text-3xl sm:text-4xl text-bone mb-4">
            Every dollar, tracked the moment it moves.
          </h2>
          <p className="text-bone/45 leading-relaxed max-w-md">
            MidwesternBank shows you what you spent, where, and with whom, in real time, no waiting for statements to catch up. Categorized automatically, searchable instantly.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1 }}
        >
          <PhoneFrame>
            <BalanceScreen />
          </PhoneFrame>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="sm:order-1 order-2"
        >
          <PhoneFrame>
            <CardScreen />
          </PhoneFrame>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1 }}
          className="sm:order-2 order-1"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">Cards, on your terms</p>
          <h2 className="font-display text-3xl sm:text-4xl text-bone mb-4">
            A virtual card for every subscription. A tap to freeze the physical one.
          </h2>
          <p className="text-bone/45 leading-relaxed max-w-md">
            Spin up a virtual card in seconds with its own spending limit, or freeze your physical card instantly if it's ever misplaced, no phone call required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
