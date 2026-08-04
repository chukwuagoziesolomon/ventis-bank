"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Account,
  Card,
  Transaction,
  VantisUser,
  SupportConversation,
  SupportMessage,
} from "./types";
import { generateAccountNumber, generateCardNumber, generateId } from "./utils";

interface VantisState {
  user: VantisUser | null;
  isAuthenticated: boolean;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  loading: boolean;
  initialized: boolean;
}

interface SendMoneyInput {
  recipient: string;
  accountNumber: string;
  amount: number;
  note?: string;
  fromAccountId: string;
}

interface CreateCardInput {
  label: string;
  type: "physical" | "virtual";
  network: "visa" | "mastercard";
  limit: number;
  color: "gold" | "teal" | "ink";
  accountId: string;
  holder: string;
}

interface VantisContextValue extends VantisState {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; pending?: boolean; pendingCode?: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string; pending?: boolean }>;
  logout: () => void;
  sendMoney: (input: SendMoneyInput) => Promise<{ ok: boolean; error?: string }>;
  createCard: (input: CreateCardInput) => Promise<Card>;
  toggleFreezeCard: (cardId: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  updateProfile: (patch: Partial<VantisUser>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  fetchPendingUsers: () => Promise<Array<{ id: string; name: string; email: string; createdAt: string; status: string; balance: number }>>;
  approveUser: (userId: string, balance?: number) => Promise<{ ok: boolean; error?: string }>;
  rejectUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  blockUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  unblockUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  lockUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  unlockUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  toggleAdmin: (userId: string, currentRole: string) => Promise<{ ok: boolean; role?: string; error?: string }>;
  backfillUser: (userId: string) => Promise<{ ok: boolean; count?: number; error?: string }>;
  fetchSupportConversation: () => Promise<SupportConversation>;
  sendSupportMessage: (text: string) => Promise<{ ok: boolean; error?: string }>;
  fetchAllSupportConversations: () => Promise<Array<SupportConversation & { name: string; email: string }>>;
  sendAdminSupportReply: (userId: string, text: string) => Promise<{ ok: boolean; error?: string }>;
  refreshData: () => Promise<void>;
  totalBalance: number;
  myAccountForReceiving: Account;
}

const VantisContext = createContext<VantisContextValue | null>(null);

function loadInitialState(): VantisState {
  return {
    user: null,
    isAuthenticated: false,
    accounts: [],
    cards: [],
    transactions: [],
    loading: true,
    initialized: false,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VantisState>(loadInitialState());

  const refreshData = useCallback(async () => {
    if (!state.user?.id) return;
    try {
      const res = await fetch("/api/dashboard/overview", {
        headers: { "x-user-id": state.user.id },
      });
      if (!res.ok) return;
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        accounts: data.accounts ?? [],
        cards: data.cards ?? [],
        transactions: data.recentTransactions ?? [],
        initialized: true,
        loading: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, initialized: true, loading: false }));
    }
  }, [state.user?.id]);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, initialized: false }));

    async function restoreSession() {
      try {
        const res = await fetch("/api/auth/session", { method: "GET", headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        if (!res.ok || !data.user) {
          if (!cancelled) {
            setState((prev) => ({ ...prev, initialized: true, loading: false, isAuthenticated: false, user: null, accounts: [], cards: [], transactions: [] }));
          }
          return;
        }

        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: data.user,
          accounts: [],
          cards: [],
          transactions: [],
        }));

        try {
          const overviewRes = await fetch("/api/dashboard/overview", {
            headers: { "x-user-id": data.user.id },
          });
          if (!overviewRes.ok) {
            if (!cancelled) {
              setState((prev) => ({ ...prev, initialized: true, loading: false }));
            }
            return;
          }
          const overview = await overviewRes.json();
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              accounts: overview.accounts ?? [],
              cards: overview.cards ?? [],
              transactions: overview.recentTransactions ?? [],
              initialized: true,
              loading: false,
            }));
          }
        } catch {
          if (!cancelled) {
            setState((prev) => ({ ...prev, initialized: true, loading: false }));
          }
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, initialized: true, loading: false }));
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setState((prev) => ({ ...prev, loading: false }));
      if (data.pending) {
        return { ok: false, error: data.error ?? "Your account is pending approval.", pending: true };
      }
      return { ok: false, error: data.error ?? "Invalid credentials." };
    }

    if (data.pendingCode) {
      setState((prev) => ({ ...prev, loading: false }));
      return { ok: false, pendingCode: true, message: data.message ?? "Login code sent to your email." };
    }

    const sessionRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: data.user.id }),
    });

    if (!sessionRes.ok) {
      setState((prev) => ({ ...prev, loading: false }));
      return { ok: false, error: "Failed to create session." };
    }

    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: data.user,
      accounts: [],
      cards: [],
      transactions: [],
    }));

    if (data.user?.id) {
      try {
        const overviewRes = await fetch("/api/dashboard/overview", {
          headers: { "x-user-id": data.user.id },
        });
        if (!overviewRes.ok) {
          const errorText = await overviewRes.text();
          setState((prev) => ({ ...prev, loading: false }));
          return { ok: false, error: `Failed to load dashboard data: ${overviewRes.status}` };
        }
        const overview = await overviewRes.json();
        setState((prev) => ({
          ...prev,
          accounts: overview.accounts ?? [],
          cards: overview.cards ?? [],
          transactions: overview.recentTransactions ?? [],
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false }));
        return { ok: false, error: `Failed to load dashboard data: ${err instanceof Error ? err.message : "Unknown error"}` };
      }
    }
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Something went wrong." };
    }
    return { ok: true, pending: true };
  }, []);

  const logout = useCallback(() => {
    fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    setState({
      user: null,
      isAuthenticated: false,
      accounts: [],
      cards: [],
      transactions: [],
      loading: false,
      initialized: true,
    });
  }, []);

  const sendMoney = useCallback(async ({ recipient, accountNumber, amount, note, fromAccountId }: SendMoneyInput) => {
    if (!state.user?.id) return { ok: false, error: "Not authenticated." };

    if (state.user.locked) {
      return { ok: false, error: "Your account is locked. Please contact support." };
    }

    const tempId = generateId("tx");

    setState((prev) => {
      const account = prev.accounts.find((a) => a.id === fromAccountId);
      if (!account) return prev;
      if (amount <= 0) return prev;
      if (amount > account.balance) return prev;

      const newTx: Transaction = {
        id: tempId,
        title: `To ${recipient}`,
        category: "Transfer",
        amount: -amount,
        date: new Date().toISOString(),
        accountId: fromAccountId,
        direction: "debit",
        counterparty: `${recipient} · ${accountNumber}`,
        status: "pending",
      };

      return {
        ...prev,
        accounts: prev.accounts.map((a) =>
          a.id === fromAccountId ? { ...a, balance: a.balance - amount } : a
        ),
        transactions: [newTx, ...prev.transactions],
      };
    });

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": state.user.id,
        },
        body: JSON.stringify({ title: `To ${recipient}`, category: "Transfer", amount: -amount, accountId: fromAccountId, direction: "debit", counterparty: `${recipient} · ${accountNumber}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState((prev) => {
          const account = prev.accounts.find((a) => a.id === fromAccountId);
          if (!account) return prev;
          return {
            ...prev,
            accounts: prev.accounts.map((a) =>
              a.id === fromAccountId ? { ...a, balance: a.balance + amount } : a
            ),
            transactions: prev.transactions.filter((t) => t.id !== tempId),
          };
        });
        return { ok: false, error: data.error ?? "Transfer failed." };
      }

      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === tempId
            ? { ...t, id: data.id ?? t.id, status: data.status ?? "pending" }
            : t
        ),
      }));

      return { ok: true };
    } catch {
      setState((prev) => {
        const account = prev.accounts.find((a) => a.id === fromAccountId);
        if (!account) return prev;
        return {
          ...prev,
          accounts: prev.accounts.map((a) =>
            a.id === fromAccountId ? { ...a, balance: a.balance + amount } : a
          ),
          transactions: prev.transactions.filter((t) => t.id !== tempId),
        };
      });
      return { ok: false, error: "Network error." };
    }
  }, [state.user?.id]);

  const createCard = useCallback(async (input: CreateCardInput) => {
    if (!state.user?.id) throw new Error("Not authenticated");

    const tempId = generateId("card");
    const tempCard: Card = {
      id: tempId,
      label: input.label,
      holder: input.holder || state.user?.name || "You",
      last4: generateCardNumber(),
      expiry: "12/30",
      type: input.type,
      network: input.network,
      frozen: false,
      limit: input.limit,
      spent: 0,
      color: input.color,
      accountId: input.accountId,
    };

    setState((prev) => ({ ...prev, cards: [tempCard, ...prev.cards] }));

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": state.user.id,
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setState((prev) => ({ ...prev, cards: prev.cards.filter((c) => c.id !== tempId) }));
        throw new Error(data.error ?? "Failed to create card.");
      }
      setState((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => (c.id === tempId ? data : c)),
      }));
      return data;
    } catch (err) {
      setState((prev) => ({ ...prev, cards: prev.cards.filter((c) => c.id !== tempId) }));
      throw err;
    }
  }, [state.user?.id]);

  const toggleFreezeCard = useCallback(async (cardId: string) => {
    if (!state.user?.id) return;

    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)),
    }));

    const res = await fetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": state.user.id,
      },
      body: JSON.stringify({ frozen: !state.cards.find((c) => c.id === cardId)?.frozen }),
    });
    if (!res.ok) {
      setState((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)),
      }));
    }
  }, [state.user?.id, state.cards]);

  const deleteCard = useCallback(async (cardId: string) => {
    if (!state.user?.id) return;

    setState((prev) => ({ ...prev, cards: prev.cards.filter((c) => c.id !== cardId) }));

    const res = await fetch(`/api/cards/${cardId}`, {
      method: "DELETE",
      headers: { "x-user-id": state.user.id },
    });
    if (!res.ok) {
      await refreshData();
    }
  }, [state.user?.id, refreshData]);

  const updateProfile = useCallback(async (patch: Partial<VantisUser>) => {
    if (!state.user?.id) return;

    setState((prev) => (prev.user ? { ...prev, user: { ...prev.user, ...patch } } : prev));

    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": state.user.id,
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setState((prev) => (prev.user ? { ...prev, user: { ...prev.user, ...patch } } : prev));
    }
  }, [state.user?.id]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!state.user?.id) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/user/avatar", {
      method: "POST",
      headers: { "x-user-id": state.user.id },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed.");

    setState((prev) => (prev.user ? { ...prev, user: { ...prev.user, image: data.imageUrl } } : prev));
    return data.imageUrl;
  }, [state.user?.id]);

  const fetchPendingUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    return data.users ?? [];
  }, []);

  const approveUser = useCallback(async (userId: string, balance: number = 0) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved", balance }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const rejectUser = useCallback(async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const backfillUser = useCallback(async (userId: string) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true, count: data.count };
  }, []);

  const blockUser = useCallback(async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "blocked" }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const unblockUser = useCallback(async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const lockUser = useCallback(async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: true }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const unlockUser = useCallback(async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: false }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  }, []);

  const toggleAdmin = useCallback(async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true, role: data.user?.role };
  }, []);

  const fetchSupportConversation = useCallback(async () => {
    if (!state.user?.id) throw new Error("Not authenticated");
    const res = await fetch("/api/support/conversation", {
      headers: { "x-user-id": state.user.id },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load support conversation.");
    return data.conversation as SupportConversation;
  }, [state.user?.id]);

  const sendSupportMessage = useCallback(async (text: string) => {
    if (!state.user?.id) return { ok: false, error: "Not authenticated." };
    const res = await fetch("/api/support/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": state.user.id,
      },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to send support message." };
    return { ok: true };
  }, [state.user?.id]);

  const fetchAllSupportConversations = useCallback(async () => {
    const res = await fetch("/api/admin/support");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load support conversations.");
    return data.conversations as Array<SupportConversation & { name: string; email: string }>;
  }, []);

  const sendAdminSupportReply = useCallback(async (userId: string, text: string) => {
    const res = await fetch("/api/admin/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to send reply." };
    return { ok: true };
  }, []);

  const totalBalance = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  const myAccountForReceiving = state.accounts[0] ?? {
    id: "acc_temp",
    name: "Everyday Checking",
    number: generateAccountNumber(),
    balance: 0,
    currency: "USD",
    type: "checking" as const,
  };

  const value: VantisContextValue = {
    ...state,
    login,
    signup,
    logout,
    sendMoney,
    createCard,
    toggleFreezeCard,
    deleteCard,
    updateProfile,
    uploadAvatar,
    fetchPendingUsers,
    approveUser,
    rejectUser,
    blockUser,
    unblockUser,
    lockUser,
    unlockUser,
    toggleAdmin,
    backfillUser,
    fetchSupportConversation,
    sendSupportMessage,
    fetchAllSupportConversations,
    sendAdminSupportReply,
    refreshData,
    totalBalance,
    myAccountForReceiving,
  };

  return <VantisContext.Provider value={value}>{children}</VantisContext.Provider>;
}

export function useVantis() {
  const ctx = useContext(VantisContext);
  if (!ctx) throw new Error("useVantis must be used within StoreProvider");
  return ctx;
}
