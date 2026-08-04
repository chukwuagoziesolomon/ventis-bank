"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useVantis } from "@/lib/store";

export default function SupportPage() {
  const { fetchSupportConversation, sendSupportMessage } = useVantis();
  const [conversation, setConversation] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const convo = await fetchSupportConversation();
        if (mounted) {
          setConversation(convo);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load support conversation.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [fetchSupportConversation]);

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError("");

    const result = await sendSupportMessage(message.trim());
    if (!result.ok) {
      setError(result.error ?? "Could not send message.");
      setSending(false);
      return;
    }

    setMessage("");
    try {
      const convo = await fetchSupportConversation();
      setConversation(convo);
    } catch {
      /* keep existing conversation */
    }
    setSending(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-bone/40">Customer support</p>
          <h1 className="font-display text-3xl text-bone">Chat with MidwesternBank support</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-bone">
          <MessageCircle className="w-4 h-4 text-gold-300" />
          Available 24/7
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-ink-800 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-bone/40">Need help? Send us a message and our team will reply soon.</p>
            <p className="text-xs text-bone/30 mt-1">Your messages appear here for support agents to respond.</p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone/40">Live</span>
        </div>

        <div className="rounded-3xl border border-white/5 bg-ink-900 p-4 min-h-[320px] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-bone/40">Loading conversation…</p>
          ) : conversation?.messages?.length ? (
            <div className="space-y-4">
              {conversation.messages.map((msg: any) => (
                <div key={msg.id} className={`rounded-3xl px-5 py-4 max-w-[85%] ${msg.from === "admin" ? "bg-teal-400/10 self-end text-teal-100" : "bg-white/5 text-bone"}`}>
                  <div className="flex items-center justify-between gap-3 mb-2 text-xs text-bone/40">
                    <span>{msg.from === "admin" ? "MidwesternBank support" : "You"}</span>
                    <span>{new Date(msg.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm leading-6">{msg.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-center py-14">
              <p className="text-sm text-bone/40">No messages yet. Send a quick note to start a conversation.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.18em] text-bone/40">Write to support</label>
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or ask a question..."
              className="flex-1 rounded-3xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:border-gold-400/50 outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-3xl bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950 hover:bg-gold-300 transition-colors disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {error ? <p className="text-sm text-coral">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
