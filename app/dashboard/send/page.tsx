"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Send, Loader2, Clock } from "lucide-react";
import { useVantis } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

type Step = "form" | "review" | "sending" | "success";
type TransferType = "local" | "international";

export default function SendMoneyPage() {
  const { accounts, sendMoney } = useVantis();
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    recipient: "",
    accountNumber: "",
    amount: "",
    note: "",
    fromAccountId: "",
    transferType: "local" as TransferType,
    bankName: "",
    swiftCode: "",
    routingNumber: "",
  });

  useEffect(() => {
    if (!form.fromAccountId && accounts.length > 0) {
      setForm((prev) => ({ ...prev, fromAccountId: accounts[0].id }));
    }
  }, [accounts, form.fromAccountId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.recipient || !form.accountNumber || !form.amount) {
      setError("Please fill in every field.");
      return;
    }
    if (form.transferType === "international" && !form.bankName) {
      setError("Please enter the recipient's bank name.");
      return;
    }
    setStep("review");
  }

  async function handleConfirm() {
    setStep("sending");
    await new Promise((r) => setTimeout(r, 1400));
    const result = await sendMoney({
      recipient: form.recipient,
      accountNumber: form.accountNumber,
      amount: parseFloat(form.amount),
      note: form.note,
      fromAccountId: form.fromAccountId,
    });
    if (!result.ok) {
      setError(result.error ?? "Transfer failed.");
      setStep("review");
      return;
    }
    setStep("success");
  }

  const selectedAccount = accounts.find((a) => a.id === form.fromAccountId);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display text-3xl text-bone mb-1">Send money</h1>
      <p className="text-sm text-bone/40 mb-8">Move money to anyone, instantly.</p>

      <div className="rounded-2xl border border-white/5 bg-ink-800 p-6 sm:p-8 min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  From account
                </label>
                <select
                  value={form.fromAccountId}
                  onChange={(e) => setForm({ ...form, fromAccountId: e.target.value })}
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
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  Transfer type
                </label>
                <div className="flex gap-2">
                  {(["local", "international"] as TransferType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, transferType: type })}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        form.transferType === type
                          ? "bg-gold-400 text-ink-950 border-gold-400"
                          : "bg-ink-700/60 text-bone/60 border-white/10 hover:text-bone"
                      }`}
                    >
                      {type === "local" ? "Local Bank" : "International Bank"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  Recipient name
                </label>
                <input
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  placeholder="e.g. Tolu Adebayo"
                  className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  Recipient account number
                </label>
                <input
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder="10-digit account number"
                  className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40 font-mono">$</span>
                  <input
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-ink-700/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono"
                  />
                </div>
              </div>

              {form.transferType === "international" && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                      Bank name
                    </label>
                    <input
                      value={form.bankName}
                      onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      placeholder="e.g. Barclays Bank"
                      className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                      SWIFT code
                    </label>
                    <input
                      value={form.swiftCode}
                      onChange={(e) => setForm({ ...form, swiftCode: e.target.value })}
                      placeholder="e.g. BARCGB22"
                      className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                      Routing number (optional)
                    </label>
                    <input
                      value={form.routingNumber}
                      onChange={(e) => setForm({ ...form, routingNumber: e.target.value })}
                      placeholder="9-digit routing number"
                      className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                  Note (optional)
                </label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="What's this for?"
                  className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
                />
              </div>

              {error && <p className="text-sm text-coral">{error}</p>}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
              >
                Review transfer <Send className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button
                onClick={() => setStep("form")}
                className="inline-flex items-center gap-1 text-sm text-bone/40 hover:text-bone"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-bone/40">You're sending</p>
                <p className="font-mono text-4xl text-bone mt-2">
                  {formatCurrency(parseFloat(form.amount || "0"))}
                </p>
              </div>

              <div className="rounded-xl bg-ink-700/40 border border-white/5 divide-y divide-white/5">
                <Row label="To" value={form.recipient} />
                <Row label="Account" value={form.accountNumber} mono />
                <Row label="Type" value={form.transferType === "local" ? "Local Bank" : "International Bank"} />
                {form.transferType === "international" && form.bankName && (
                  <Row label="Bank" value={form.bankName} />
                )}
                {form.transferType === "international" && form.swiftCode && (
                  <Row label="SWIFT Code" value={form.swiftCode} mono />
                )}
                <Row label="From" value={selectedAccount?.name ?? ""} />
                {form.note && <Row label="Note" value={form.note} />}
              </div>

              {error && <p className="text-sm text-coral">{error}</p>}

              <button
                onClick={handleConfirm}
                className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
              >
                Confirm & send
              </button>
            </motion.div>
          )}

          {step === "sending" && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[320px] flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-gold-300 animate-spin" />
              <p className="text-sm text-bone/50">Sending your transfer…</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[320px] flex flex-col items-center justify-center gap-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 grid place-items-center"
              >
                <Clock className="w-8 h-8 text-gold-300" />
              </motion.div>
              <div>
                <p className="font-display text-2xl text-bone">Transfer pending</p>
                <p className="text-sm text-bone/40 mt-1">
                  {formatCurrency(parseFloat(form.amount || "0"))} is on its way to {form.recipient} via {form.transferType === "local" ? "local bank" : "international bank"}.
                </p>
                <p className="text-xs text-bone/30 mt-2">This usually takes a few minutes to complete.</p>
              </div>
              <button
                onClick={() => {
                  setForm({ recipient: "", accountNumber: "", amount: "", note: "", fromAccountId: accounts[0]?.id ?? "", transferType: "local", bankName: "", swiftCode: "", routingNumber: "" });
                  setStep("form");
                }}
                className="mt-2 text-sm text-gold-300 hover:text-gold-200"
              >
                Send another transfer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-bone/40">{label}</span>
      <span className={`text-sm text-bone ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
