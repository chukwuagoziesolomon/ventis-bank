"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Landmark, Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { useVantis } from "@/lib/store";

type LoginMode = "password" | "code";

export default function LoginPage() {
  const { login } = useVantis();
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("demo@vantis.bank");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard");
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCodeLoading(true);
    try {
      const res = await fetch("/api/auth/login-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setCodeSent(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setCodeLoading(false);
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Invalid code.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-900">
      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-ink-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-24 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl"
        />
        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
            <Landmark className="w-5 h-5" />
          </span>
          <span className="font-display text-2xl text-bone">MidwesternBank</span>
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="font-display italic text-3xl text-bone leading-snug">
            "Money, moving at the speed of trust."
          </p>
          <p className="text-sm text-bone/40 mt-4">
            Send, receive, and manage your accounts with a bank built for how you actually live.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
              <Landmark className="w-[18px] h-[18px]" />
            </span>
            <span className="font-display text-xl text-bone">MidwesternBank</span>
          </Link>

          <h1 className="font-display text-3xl text-bone mb-2">Welcome back</h1>
          <p className="text-sm text-bone/40 mb-6">Log in to manage your money.</p>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMode("password"); setError(""); setCodeSent(false); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                mode === "password"
                  ? "bg-gold-400 text-ink-950 border-gold-400"
                  : "bg-ink-800 text-bone/60 border-white/10 hover:text-bone"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setMode("code"); setError(""); setCodeSent(false); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                mode === "code"
                  ? "bg-gold-400 text-ink-950 border-gold-400"
                  : "bg-ink-800 text-bone/60 border-white/10 hover:text-bone"
              }`}
            >
              Login code
            </button>
          </div>

          {mode === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-[0.15em] text-bone/40">Password</label>
                  <button type="button" className="text-xs text-gold-300/80 hover:text-gold-300">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Any password works in this demo"
                    className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bone/30 hover:text-bone/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-coral">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Logging in…" : "Log in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setCodeSent(false); }}
                  type="email"
                  required
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
                />
              </div>

              {!codeSent ? (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={codeLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
                >
                  {codeLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {codeLoading ? "Sending code…" : "Send login code"}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">Enter code</label>
                    <div className="relative">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        required
                        className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 pl-11 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono tracking-widest"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/30" />
                    </div>
                    <p className="text-xs text-bone/30 mt-2">Code sent to {email}</p>
                  </div>

                  {error && <p className="text-sm text-coral">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Verifying…" : "Log in with code"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={codeLoading}
                    className="w-full text-sm text-gold-300 hover:text-gold-200 font-medium"
                  >
                    {codeLoading ? "Sending…" : "Resend code"}
                  </button>
                </>
              )}
            </form>
          )}

          <p className="text-sm text-bone/40 mt-8 text-center">
            New to MidwesternBank?{" "}
            <Link href="/signup" className="text-gold-300 hover:text-gold-200 font-medium">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
