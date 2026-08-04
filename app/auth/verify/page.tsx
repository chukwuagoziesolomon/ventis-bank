"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("Enter the 6-digit code sent to your email.");
  const [code, setCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setMessage("Verifying your code…");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to verify your email.");
        return;
      }

      setStatus("success");
      setMessage("Your email has been verified. You can now log in.");
    } catch {
      setStatus("error");
      setMessage("Unable to verify your email. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink-900 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-800 p-10 text-center">
        <div className="mx-auto mb-8 h-20 w-20 rounded-3xl bg-white/5 grid place-items-center text-gold-300">
          {status === "pending" ? <Loader2 className="w-10 h-10 animate-spin" /> : status === "success" ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
        </div>
        <h1 className="font-display text-3xl text-bone mb-4">
          {status === "success" ? "Email verified" : status === "pending" && code ? "Verifying…" : "Verify your email"}
        </h1>
        <p className="text-sm text-bone/50 mb-8">{message}</p>

        {status !== "success" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-bone placeholder:text-bone/25 focus:border-gold-400/50 outline-none font-mono"
            />
            <button
              type="submit"
              disabled={code.length !== 6}
              className="w-full inline-flex items-center justify-center rounded-2xl bg-gold-400 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-gold-300 transition-colors disabled:opacity-50"
            >
              Verify email
            </button>
          </form>
        )}

        <Link href="/login" className="inline-flex items-center justify-center rounded-2xl bg-gold-400 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-gold-300 transition-colors mt-4">
          Back to login
        </Link>
      </div>
    </div>
  );
}
