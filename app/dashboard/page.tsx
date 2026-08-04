"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send, QrCode, Plus, TrendingUp, ArrowDownLeft, ArrowUpRight, X, Lock } from "lucide-react";
import { useVantis } from "@/lib/store";
import { useRouter } from "next/navigation";
import AnimatedNumber from "@/components/AnimatedNumber";
import MiniBarChart from "@/components/MiniBarChart";
import TransactionRow from "@/components/TransactionRow";
import BankCard from "@/components/BankCard";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const weeklySpend = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 118 },
  { label: "Wed", value: 44 },
  { label: "Thu", value: 96 },
  { label: "Fri", value: 210 },
  { label: "Sat", value: 154 },
  { label: "Sun", value: 38 },
];

export default function OverviewPage() {
  const { accounts, transactions, cards, user } = useVantis();
  const router = useRouter();
  const recent = transactions.slice(0, 20);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const isLocked = user?.locked === true;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-bone/40">Good to see you,</p>
          <h1 className="font-display text-3xl sm:text-4xl text-bone mt-1">
            {user?.name?.split(" ")[0] ?? "there"}
          </h1>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => router.push("/dashboard/send")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-400 text-ink-950 text-sm font-semibold hover:bg-gold-300 transition-colors"
          >
            <Send className="w-4 h-4" /> Send
          </button>
          <button
            onClick={() => router.push("/dashboard/receive")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-bone text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors"
          >
            <QrCode className="w-4 h-4" /> Receive
          </button>
        </div>
      </div>

      {isLocked && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4">
          <Lock className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-300">Account is locked</p>
            <p className="text-xs text-amber-300/70 mt-0.5">Please visit customer support or email us to unlock your account.</p>
          </div>
        </div>
      )}

      {/* Account balance cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {accounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-white/5 bg-ink-800 p-6 overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold-400/5 blur-2xl" />
            <p className="text-xs uppercase tracking-[0.2em] text-bone/40">{acc.name}</p>
            <div className="mt-3 font-mono text-3xl text-bone">
              <AnimatedNumber value={acc.balance} prefix="$" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-bone/40 font-mono">•••• {acc.number.slice(-4)}</p>
              {acc.apy ? (
                <span className="inline-flex items-center gap-1 text-xs text-teal-300">
                  <TrendingUp className="w-3.5 h-3.5" /> {acc.apy}% APY
                </span>
              ) : (
                <span className="text-xs text-bone/30 capitalize">{acc.type}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Spending chart */}
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-ink-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl text-bone">This week's spending</h2>
              <p className="text-xs text-bone/40 mt-1">Across all accounts</p>
            </div>
            <span className="font-mono text-sm text-gold-300">
              {formatTotal(weeklySpend)}
            </span>
          </div>
          <MiniBarChart data={weeklySpend} />
        </div>

        {/* Cards preview */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-ink-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-bone">Your cards</h2>
            <Link href="/dashboard/cards" className="text-xs text-bone/40 hover:text-gold-300 flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {cards.length > 0 ? (
            <BankCard card={cards[0]} />
          ) : (
            <Link
              href="/dashboard/cards"
              className="flex-1 min-h-[160px] rounded-2xl border border-dashed border-white/10 grid place-items-center text-bone/40 hover:text-gold-300 hover:border-gold-400/30 transition-colors"
            >
              <span className="flex flex-col items-center gap-2 text-sm">
                <Plus className="w-5 h-5" /> Create your first card
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl border border-white/5 bg-ink-800 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xl text-bone">Recent activity</h2>
          <Link href="/dashboard/transactions" className="text-xs text-bone/40 hover:text-gold-300 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div>
          {recent.map((tx, i) => (
            <TransactionRow key={tx.id} tx={tx} index={i} onClick={() => setSelectedTx(tx)} />
          ))}
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
          <div className="relative w-full max-w-md bg-ink-800 border border-white/10 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-bone">Transaction details</h3>
              <button onClick={() => setSelectedTx(null)} className="text-bone/40 hover:text-bone" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full grid place-items-center shrink-0 ${selectedTx.direction === "credit" ? "bg-teal-400/10 text-teal-300" : "bg-white/5 text-bone/60"}`}>
                  {selectedTx.direction === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">{selectedTx.title}</p>
                  <p className="text-xs text-bone/40 mt-0.5">{selectedTx.category}</p>
                </div>
              </div>
              <div className="rounded-xl bg-ink-700/40 border border-white/5 divide-y divide-white/5">
                <DetailRow label="Amount" value={`${selectedTx.direction === "credit" ? "+" : "−"}${formatCurrency(Math.abs(selectedTx.amount)).replace("-", "")}`} />
                <DetailRow label="Date" value={formatDateTime(selectedTx.date)} />
                <DetailRow label="Status" value={selectedTx.status === "pending" ? "Pending" : "Completed"} />
                <DetailRow label="Direction" value={selectedTx.direction === "credit" ? "Money in" : "Money out"} />
                {selectedTx.counterparty && <DetailRow label="Counterparty" value={selectedTx.counterparty} />}
                {selectedTx.accountId && <DetailRow label="Account ID" value={selectedTx.accountId} mono />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTotal(data: { value: number }[]) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return `$${total.toLocaleString()}`;
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-bone/40">{label}</span>
      <span className={`text-sm text-bone ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
