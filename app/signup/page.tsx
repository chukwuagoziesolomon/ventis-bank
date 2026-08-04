"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Landmark, Loader2, Check, Clock } from "lucide-react";
import { useVantis } from "@/lib/store";
import Modal from "@/components/Modal";

const steps = ["Your details", "Secure it", "Under review"];

export default function SignupPage() {
  const { signup } = useVantis();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [pendingReview, setPendingReview] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (stepIndex === 0 && (!form.name.trim() || !form.email.includes("@"))) {
      setError("Enter your name and a valid email.");
      return;
    }
    if (stepIndex === 1 && form.password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (stepIndex < 1) {
      setStepIndex((s) => s + 1);
      return;
    }
    createAccount();
  }

  async function createAccount() {
    setLoading(true);
    const result = await signup(form.name, form.email, form.password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStepIndex(2);
    setPendingReview(true);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-900">
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-ink-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 bottom-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl"
        />
        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
            <Landmark className="w-5 h-5" />
          </span>
          <span className="font-display text-2xl text-bone">Vantis</span>
        </Link>
        <div className="relative z-10 max-w-md space-y-6">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center text-xs font-medium border ${
                  i <= stepIndex
                    ? "bg-gold-400 border-gold-400 text-ink-950"
                    : "border-white/15 text-bone/40"
                }`}
              >
                {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={i <= stepIndex ? "text-bone" : "text-bone/40"}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
              <Landmark className="w-[18px] h-[18px]" />
            </span>
            <span className="font-display text-xl text-bone">Vantis</span>
          </Link>

          {stepIndex < 2 ? (
            <>
              <h1 className="font-display text-3xl text-bone mb-2">
                {stepIndex === 0 ? "Create your account" : "Choose a password"}
              </h1>
              <p className="text-sm text-bone/40 mb-8">
                {stepIndex === 0
                  ? "Takes about a minute."
                  : "Make it something only you would know."}
              </p>

              <form onSubmit={handleNext} className="space-y-5">
                {stepIndex === 0 && (
                  <>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                        Full name
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
                        placeholder="Jordan Rivera"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                        Email
                      </label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email"
                        className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                  </>
                )}

                {stepIndex === 1 && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">
                      Password
                    </label>
                    <input
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      type="password"
                      className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm focus:border-gold-400/50 outline-none"
                      placeholder="At least 6 characters"
                    />
                  </div>
                )}

                {error && <p className="text-sm text-coral">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-ink-950 font-semibold py-3.5 rounded-xl transition-colors"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Creating account…" : stepIndex === 0 ? "Continue" : "Create account"}
                </button>

                {stepIndex === 1 && (
                  <button
                    type="button"
                    onClick={() => setStepIndex(0)}
                    className="w-full text-sm text-bone/40 hover:text-bone"
                  >
                    Back
                  </button>
                )}
              </form>

              <p className="text-sm text-bone/40 mt-8 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-gold-300 hover:text-gold-200 font-medium">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 grid place-items-center mx-auto mb-5"
              >
                <Clock className="w-7 h-7 text-gold-300" />
              </motion.div>
              <p className="font-display text-2xl text-bone">Account under review</p>
              <p className="text-sm text-bone/40 mt-2">We're reviewing your details, {form.name.split(" ")[0]}.</p>
            </motion.div>
          )}
        </motion.div>
        <Modal open={pendingReview} onClose={() => setPendingReview(false)} title="Details under review">
          <div className="space-y-3">
            <p className="text-sm text-bone/60">
              Thanks for signing up, {form.name.split(" ")[0]}! Your account details are currently being reviewed by our team.
            </p>
            <p className="text-sm text-bone/40">
              We also sent a verification link to your email address. Verify your email to prepare your account for login once approval is complete.
            </p>
            <p className="text-sm text-bone/40">
              This usually takes a few minutes. If you don't see the message, check your spam folder.
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold py-3 rounded-xl transition-colors"
              >
                Go to login
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
