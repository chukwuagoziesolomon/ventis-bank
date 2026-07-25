"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Snowflake, Trash2, Sun } from "lucide-react";
import { useVantis } from "@/lib/store";
import { Card } from "@/lib/types";
import BankCard from "@/components/BankCard";
import Modal from "@/components/Modal";
import { formatCurrency } from "@/lib/utils";

const colorOptions: Card["color"][] = ["gold", "teal", "ink"];

export default function CardsPage() {
  const { cards, accounts, user, createCard, toggleFreezeCard, deleteCard } = useVantis();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    label: "",
    type: "virtual" as Card["type"],
    network: "visa" as Card["network"],
    limit: "1000",
    color: "gold" as Card["color"],
    accountId: "",
    holder: user?.name ?? "",
  });

  useEffect(() => {
    if (!form.accountId && accounts.length > 0) {
      setForm((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts, form.accountId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim() || !form.accountId) return;
    await createCard({
      label: form.label,
      type: form.type,
      network: form.network,
      limit: parseFloat(form.limit) || 0,
      color: form.color,
      accountId: form.accountId,
      holder: form.holder,
    });
    setModalOpen(false);
    setForm({ label: "", type: "virtual", network: "visa", limit: "1000", color: "gold", accountId: form.accountId, holder: user?.name ?? "" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl text-bone">Your cards</h1>
      </div>
      <p className="text-sm text-bone/40 mb-8">Create virtual cards instantly, or manage physical ones.</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="space-y-4"
          >
            <BankCard card={card} />
            <div className="rounded-xl border border-white/5 bg-ink-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-bone font-medium">{card.label}</p>
                <span className="text-xs text-bone/40 capitalize">{card.network}</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-bone/40 mb-1.5">
                  <span>Spent</span>
                  <span className="font-mono">
                    {formatCurrency(card.spent)} / {formatCurrency(card.limit)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                    style={{ width: `${Math.min((card.spent / card.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFreezeCard(card.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-white/5 text-bone/70 hover:text-bone hover:bg-white/10 transition-colors"
                >
                  {card.frozen ? <Sun className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
                  {card.frozen ? "Unfreeze" : "Freeze"}
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        <button
          onClick={() => setModalOpen(true)}
          className="min-h-[280px] rounded-2xl border border-dashed border-white/10 grid place-items-center text-bone/40 hover:text-gold-300 hover:border-gold-400/30 transition-colors"
        >
          <span className="flex flex-col items-center gap-2 text-sm">
            <Plus className="w-6 h-6" /> Create a new card
          </span>
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a card">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Account</label>
            <select
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
              className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id} className="bg-ink-800">
                  {a.name} — {formatCurrency(a.balance)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Cardholder name</label>
            <input
              value={form.holder}
              onChange={(e) => setForm({ ...form, holder: e.target.value })}
              placeholder="Name on card"
              className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Card name</label>
            <input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Travel Card"
              className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["virtual", "physical"] as Card["type"][]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`py-2.5 rounded-xl text-sm font-medium capitalize border transition-colors ${
                    form.type === t
                      ? "bg-gold-400 text-ink-950 border-gold-400"
                      : "bg-ink-700/40 text-bone/60 border-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Monthly limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40 font-mono">$</span>
              <input
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                type="number"
                className="w-full bg-ink-700/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-bone text-sm font-mono focus:border-gold-400/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Color</label>
            <div className="flex gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    form.color === c ? "scale-110 border-bone" : "border-transparent"
                  } ${c === "gold" ? "bg-gold-400" : c === "teal" ? "bg-teal-400" : "bg-white/20"}`}
                  aria-label={`${c} card color`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
          >
            Create card
          </button>
        </form>
      </Modal>
    </div>
  );
}
