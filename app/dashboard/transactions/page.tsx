"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useVantis } from "@/lib/store";
import TransactionRow from "@/components/TransactionRow";

type Filter = "all" | "credit" | "debit";

export default function TransactionsPage() {
  const { user } = useVantis();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
              <TransactionRow key={tx.id} tx={tx} index={i} />
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
    </div>
  );
}
