"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send, QrCode, Plus, TrendingUp } from "lucide-react";
import { useVantis } from "@/lib/store";
import { useRouter } from "next/navigation";
import AnimatedNumber from "@/components/AnimatedNumber";
import MiniBarChart from "@/components/MiniBarChart";
import TransactionRow from "@/components/TransactionRow";
import BankCard from "@/components/BankCard";

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
            <TransactionRow key={tx.id} tx={tx} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTotal(data: { value: number }[]) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return `$${total.toLocaleString()}`;
}
