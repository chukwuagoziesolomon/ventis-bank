"use client";

import { useState, useEffect } from "react";
import { Landmark, Clock, Check, X, Shield, Ban, Unlock, RefreshCw } from "lucide-react";
import { useVantis } from "@/lib/store";

type UserStatus = "pending" | "approved" | "rejected" | "blocked";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: UserStatus;
  balance: number;
  transactionCount?: number;
}

export default function AdminUsersPage() {
  const { fetchPendingUsers, approveUser, rejectUser, blockUser, unblockUser, backfillUser } = useVantis();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approvalBalance, setApprovalBalance] = useState<Record<string, number>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const allUsers = await fetchPendingUsers();
      setUsers(allUsers as AdminUser[]);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    const balance = approvalBalance[id] ?? 0;
    setActionLoading(id);
    const result = await approveUser(id, balance);
    setActionLoading(null);
    if (result.ok) {
      await loadUsers();
      setApprovalBalance((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    const result = await rejectUser(id);
    setActionLoading(null);
    if (result.ok) {
      await loadUsers();
    }
  }

  async function handleBlock(id: string) {
    setActionLoading(id);
    const result = await blockUser(id);
    setActionLoading(null);
    if (result.ok) {
      await loadUsers();
    }
  }

  async function handleUnblock(id: string) {
    setActionLoading(id);
    const result = await unblockUser(id);
    setActionLoading(null);
    if (result.ok) {
      await loadUsers();
    }
  }

  async function handleBackfill(id: string) {
    setActionLoading(id);
    const result = await backfillUser(id);
    setActionLoading(null);
    if (result.ok) {
      alert(`Success! ${result.count} transactions created.`);
      await loadUsers();
    } else {
      alert(result.error || "Failed to backfill transactions");
    }
  }

  function getStatusBadge(status: UserStatus) {
    const styles = {
      pending: "bg-gold-400/10 text-gold-300 border-gold-400/20",
      approved: "bg-teal-400/10 text-teal-300 border-teal-400/20",
      rejected: "bg-coral/10 text-coral border-coral/20",
      blocked: "bg-red-400/10 text-red-300 border-red-400/20",
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}>
        {status === "blocked" && <Ban className="w-3 h-3" />}
        {status === "approved" && <Shield className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
            <Landmark className="w-5 h-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-bone">Admin Dashboard</h1>
            <p className="text-sm text-bone/40">Manage users, approvals, balances, and account status</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="ml-3 text-sm text-bone/40">Loading users…</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/5 bg-ink-800">
            <Clock className="w-8 h-8 text-bone/30 mx-auto mb-3" />
            <p className="text-bone/40">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-ink-800">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-bone font-medium">{user.name}</p>
                    {getStatusBadge(user.status)}
                  </div>
                  <p className="text-sm text-bone/40">{user.email}</p>
                  <p className="text-xs text-bone/30 mt-1">
                    {new Date(user.createdAt).toLocaleString()} · Balance: ${user.balance.toLocaleString()}
                    {user.transactionCount !== undefined && ` · ${user.transactionCount} transactions`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.status === "pending" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-bone/40">$</span>
                        <input
                          type="number"
                          placeholder="Starting balance"
                          value={approvalBalance[user.id] ?? ""}
                          onChange={(e) => setApprovalBalance((prev) => ({ ...prev, [user.id]: parseFloat(e.target.value) || 0 }))}
                          className="w-32 bg-ink-700/60 border border-white/10 rounded-xl px-3 py-2 text-bone text-sm font-mono focus:border-gold-400/50 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-400/10 text-teal-300 border border-teal-400/20 hover:bg-teal-400/20 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral/10 text-coral border border-coral/20 hover:bg-coral/20 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {user.status === "approved" && (
                    <>
                      <button
                        onClick={() => handleBackfill(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-400/10 text-gold-300 border border-gold-400/20 hover:bg-gold-400/20 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4" /> Backfill History
                      </button>
                      <button
                        onClick={() => handleBlock(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-400/10 text-red-300 border border-red-400/20 hover:bg-red-400/20 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <Ban className="w-4 h-4" /> Block
                      </button>
                    </>
                  )}
                  {user.status === "blocked" && (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      disabled={actionLoading === user.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-400/10 text-teal-300 border border-teal-400/20 hover:bg-teal-400/20 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Unlock className="w-4 h-4" /> Unblock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
