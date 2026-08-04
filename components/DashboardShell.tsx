"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  Send,
  QrCode,
  History,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Landmark,
  User,
  Shield,
  MessageCircle,
} from "lucide-react";
import { useVantis } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/send", label: "Send money", icon: Send },
  { href: "/dashboard/receive", label: "Receive money", icon: QrCode },
  { href: "/dashboard/transactions", label: "Transactions", icon: History },
  { href: "/dashboard/cards", label: "Cards", icon: CreditCard },
  { href: "/dashboard/support", label: "Support", icon: MessageCircle },
  { href: "/admin/users", label: "Admin", icon: Shield, adminOnly: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useVantis();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5 mb-8">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
          <Landmark className="w-[18px] h-[18px]" />
        </span>
        <span className="font-display text-xl tracking-wide text-bone">MidwesternBank</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.filter((item) => !item.adminOnly || user?.role === "admin").map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-ink-700 border border-white/5"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <Icon
                className={`relative w-[18px] h-[18px] shrink-0 ${
                  active ? "text-gold-300" : "text-bone/50 group-hover:text-bone/80"
                }`}
              />
              <span className={`relative ${active ? "text-bone" : "text-bone/60 group-hover:text-bone/85"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 grid place-items-center text-ink-950 text-xs font-semibold overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.initials ?? "VB"
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-bone truncate">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-bone/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="mt-2 flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-bone/60 hover:text-coral hover:bg-coral/5 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalBalance, user } = useVantis();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-ink-900 bg-grid">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-white/5 bg-ink-900/80 backdrop-blur px-4 py-6 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 w-72 bg-ink-900 border-r border-white/10 px-4 py-6"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-4 text-bone/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 bg-ink-900/70 backdrop-blur border-b border-white/5">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-bone/70 hover:text-bone"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-bone/40">Total balance</p>
            <p className="font-mono text-lg text-bone">
              {totalBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
              All systems normal
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 grid place-items-center text-ink-950 text-xs font-semibold overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.initials ?? "VB"
              )}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
