"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function TransactionRow({ tx, index = 0, onClick }: { tx: Transaction; index?: number; onClick?: () => void }) {
  const isCredit = tx.direction === "credit";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={onClick}
      className={`flex items-center gap-3 sm:gap-4 py-3.5 border-b border-white/5 last:border-0 ${onClick ? "cursor-pointer hover:bg-white/[0.02] transition-colors" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${
          isCredit ? "bg-teal-400/10 text-teal-300" : "bg-white/5 text-bone/60"
        }`}
      >
        {isCredit ? <ArrowDownLeft className="w-[18px] h-[18px]" /> : <ArrowUpRight className="w-[18px] h-[18px]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-bone truncate">{tx.title}</p>
        <p className="text-xs text-bone/40 mt-0.5">{tx.category} · {formatDateTime(tx.date)}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-mono text-sm ${isCredit ? "text-teal-300" : "text-coral"}`}>
          {isCredit ? "+" : "−"}
          {formatCurrency(Math.abs(tx.amount)).replace("-", "")}
        </p>
        {tx.status === "pending" && (
          <p className="flex items-center justify-end gap-1 text-[11px] text-gold-300/80 mt-0.5">
            <ArrowRight className="w-3 h-3 animate-[pulse_1.2s_ease-in-out_infinite]" /> Pending
          </p>
        )}
      </div>
    </motion.div>
  );
}
