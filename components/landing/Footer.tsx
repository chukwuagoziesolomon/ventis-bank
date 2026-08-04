"use client";

import Link from "next/link";
import { Landmark, Twitter, Instagram, Linkedin } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Checking", "Savings", "Cards", "Transfers"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Blog"],
  },
  {
    title: "Support",
    links: ["Help center", "Contact us", "Security", "Status"],
  },
  {
    title: "Legal",
    links: ["Terms of service", "Privacy policy", "Disclosures", "Accessibility"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950/40">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
                <Landmark className="w-[18px] h-[18px]" />
              </span>
              <span className="font-display text-xl text-bone">MidwesternBank</span>
            </div>
            <p className="text-sm text-bone/40 max-w-xs leading-relaxed">
              Banking that moves with you. Send, receive, and manage your money without the wait.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <span
                  key={i}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 text-bone/40 hover:text-gold-300 transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-[0.15em] text-bone/30 mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-bone/50 hover:text-bone transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-8 border-t border-white/5 text-xs text-bone/30">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4" /> MidwesternBank, N.A. · Member FDIC
          </div>
          <p>© {new Date().getFullYear()} MidwesternBank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
