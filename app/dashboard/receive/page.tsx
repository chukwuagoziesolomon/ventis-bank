"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2 } from "lucide-react";
import { useVantis } from "@/lib/store";

export default function ReceiveMoneyPage() {
  const { myAccountForReceiving, user } = useVantis();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const routingNumber = "084009519";
  const shareText = `Send me money on Vantis — account ${myAccountForReceiving.number}, routing ${routingNumber}.`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&color=243-241-236&bgcolor=11-18-32&data=${encodeURIComponent(
    shareText
  )}`;

  function copy(field: string, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1600);
    });
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Vantis account details", text: shareText });
      } catch {
        // user cancelled share sheet
      }
    } else {
      copy("share", shareText);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display text-3xl text-bone mb-1">Receive money</h1>
      <p className="text-sm text-bone/40 mb-8">Share your details or let someone scan your code.</p>

      <div className="rounded-2xl border border-white/5 bg-ink-800 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 pb-8 mb-8 border-b border-white/5"
        >
          <div className="p-3 rounded-2xl bg-ink-950 border border-white/10">
            <img src={qrSrc} alt="Scannable QR code with your Vantis account details" width={220} height={220} className="rounded-lg" />
          </div>
          <p className="text-sm text-bone/40 text-center">
            {user?.name ?? "You"} · Vantis Bank
          </p>
        </motion.div>

        <div className="space-y-4">
          <DetailField
            label="Account holder"
            value={user?.name ?? "—"}
            onCopy={() => copy("name", user?.name ?? "")}
            copied={copiedField === "name"}
          />
          <DetailField
            label="Account number"
            value={myAccountForReceiving.number}
            mono
            onCopy={() => copy("account", myAccountForReceiving.number)}
            copied={copiedField === "account"}
          />
          <DetailField
            label="Routing number"
            value={routingNumber}
            mono
            onCopy={() => copy("routing", routingNumber)}
            copied={copiedField === "routing"}
          />
          <DetailField label="Bank" value="Vantis Bank, N.A." onCopy={() => copy("bank", "Vantis Bank, N.A.")} copied={copiedField === "bank"} />
        </div>

        <button
          onClick={share}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-bone font-medium py-3.5 rounded-xl transition-colors"
        >
          <Share2 className="w-4 h-4" /> Share my details
        </button>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-ink-700/40 border border-white/5 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.15em] text-bone/40">{label}</p>
        <p className={`text-sm text-bone mt-0.5 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 grid place-items-center w-8 h-8 rounded-lg text-bone/40 hover:text-gold-300 hover:bg-white/5 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="w-4 h-4 text-teal-300" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
