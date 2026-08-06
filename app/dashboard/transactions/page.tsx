"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, ArrowDownLeft, ArrowUpRight, Clock, X } from "lucide-react";
import { useVantis } from "@/lib/store";
import TransactionRow from "@/components/TransactionRow";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type Filter = "all" | "credit" | "debit";

export default function TransactionsPage() {
  const { user } = useVantis();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const limit = 20;

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filter !== "all") params.set("direction", filter);
    if (query.trim()) params.set("q", query.trim());

    fetch(`/api/transactions?${params.toString()}`, {
      cache: "no-store",
      headers: { "x-user-id": user.id },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions ?? []);
        setTotalPages(data.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id, page, filter, query]);

  return (
    <div>
      <h1 className="font-display text-3xl text-bone mb-1">Transactions</h1>
      <p className="text-sm text-bone/40 mb-8">Every payment, transfer, and deposit in one place.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-bone/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search transactions"
            className="w-full bg-ink-800 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-bone placeholder:text-bone/25 focus:border-gold-400/40 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "credit", "debit"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize border transition-colors ${
                filter === f
                  ? "bg-gold-400 text-ink-950 border-gold-400"
                  : "bg-ink-800 text-bone/50 border-white/5 hover:text-bone"
              }`}
            >
              {f === "credit" ? "Money in" : f === "debit" ? "Money out" : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-ink-800 px-5 sm:px-6">
        {loading ? (
          <p className="py-10 text-center text-sm text-bone/30">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-bone/30">No transactions match your search.</p>
        ) : (
          <>
            {transactions.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                index={i}
                onClick={() => setSelectedTx(tx)}
              />
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 mt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-bone/60 hover:text-bone hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-bone/40">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-bone/60 hover:text-bone hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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
                  {selectedTx.direction === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
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

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-bone/40">{label}</span>
      <span className={`text-sm text-bone ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
