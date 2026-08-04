"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  Send,
  QrCode,
  CreditCard,
  ShieldCheck,
  History,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import BankCard from "@/components/BankCard";
import { Card } from "@/lib/types";
import StatsBar from "@/components/landing/StatsBar";
import TrustBar from "@/components/landing/TrustBar";
import HowItWorks from "@/components/landing/HowItWorks";
import ProductShowcase from "@/components/landing/ProductShowcase";
import SecuritySection from "@/components/landing/SecuritySection";
import Testimonials from "@/components/landing/Testimonials";
import FaqAccordion from "@/components/landing/FaqAccordion";
import Footer from "@/components/landing/Footer";

const previewCard: Card = {
  id: "preview",
  label: "Everyday Card",
  holder: "Amara Okafor",
  last4: "4821",
  expiry: "09/29",
  type: "physical",
  network: "visa",
  frozen: false,
  limit: 5000,
  spent: 1200,
  color: "gold",
  accountId: "acc_checking",
};

const features = [
  {
    icon: Send,
    title: "Send in seconds",
    desc: "Move money to anyone, anywhere, with instant confirmation and full transparency on fees.",
    big: true,
  },
  {
    icon: QrCode,
    title: "Get paid effortlessly",
    desc: "Share a code or a link. Money lands the moment it's sent.",
  },
  {
    icon: CreditCard,
    title: "Cards on demand",
    desc: "Spin up a virtual card in seconds, or freeze a physical one remotely.",
  },
  {
    icon: History,
    title: "Total clarity",
    desc: "Every transaction, categorized and searchable, so you always know where it went.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    desc: "2FA, instant card freezing, and 24/7 fraud monitoring, built in from day one.",
    big: true,
  },
];

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingPage() {
  return (
    <div className="bg-ink-900 min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-ink-900/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
              <Landmark className="w-[18px] h-[18px]" />
            </span>
            <span className="font-display text-xl text-bone">MidwesternBank</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-bone/50 hover:text-bone transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-bone/60 hover:text-bone px-3 py-2">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-gold-400 hover:bg-gold-300 text-ink-950 px-4 py-2.5 rounded-xl transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-400/10 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -left-24 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"
        />
        <div className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Now live in the US
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-bone">
              Banking that <span className="italic text-gold-300">moves</span> with you.
            </h1>
            <p className="text-base sm:text-lg text-bone/50 mt-6 max-w-md">
              Send, receive, and manage your money without the wait. MidwesternBank gives you full control of every dollar, in real time.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                Open an account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-bone font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                See a demo
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-xs text-bone/30">
              <span>FDIC-insured up to $250,000</span>
              <span className="w-1 h-1 rounded-full bg-bone/20" />
              <span>No monthly fees</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-sm mx-auto lg:mx-0 w-full"
          >
            <div className="animate-float">
              <BankCard card={previewCard} />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-8 -left-6 sm:-left-10 bg-ink-800 border border-white/10 rounded-xl p-4 shadow-card w-48"
            >
              <p className="text-[11px] text-bone/40 uppercase tracking-[0.15em]">Sent</p>
              <p className="font-mono text-lg text-teal-300 mt-1">$620.00</p>
              <p className="text-xs text-bone/40 mt-0.5">to Alex Morgan</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-6 -right-4 sm:-right-8 bg-ink-800 border border-white/10 rounded-xl px-4 py-3 shadow-card"
            >
              <p className="text-xs text-bone/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" /> Card frozen
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.a
          href="#features"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="hidden sm:flex flex-col items-center gap-1 absolute bottom-8 left-1/2 -translate-x-1/2 text-bone/25"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.a>
      </section>

      <TrustBar />
      <StatsBar />

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-xl mb-14"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-300/70 mb-3">Everything, handled</p>
          <h2 className="font-display text-3xl sm:text-4xl text-bone">
            One account. Every way you move money.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border border-white/5 bg-ink-800 p-6 hover:border-gold-400/20 transition-colors ${
                f.big ? "lg:col-span-2" : ""
              }`}
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400/10 text-gold-300 mb-4">
                <f.icon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-bone mb-2">{f.title}</h3>
              <p className="text-sm text-bone/45 leading-relaxed max-w-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <ProductShowcase />

      <div id="security">
        <SecuritySection />
      </div>

      <Testimonials />

      <div id="faq">
        <FaqAccordion />
      </div>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-ink-800 border border-white/5 p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-foil bg-[length:250%_250%] animate-shimmer opacity-30 pointer-events-none" />
          <h2 className="relative font-display text-3xl sm:text-4xl text-bone mb-4">
            Your money, finally on your terms.
          </h2>
          <p className="relative text-bone/50 max-w-md mx-auto mb-8">
            Open a MidwesternBank account in under two minutes. No paperwork, no branch visit.
          </p>
          <Link
            href="/signup"
            className="relative inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Open an account <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
