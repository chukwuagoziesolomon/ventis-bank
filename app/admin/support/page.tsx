"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageSquare, Send, Search, User, CornerUpLeft } from "lucide-react";
import { useVantis } from "@/lib/store";

export default function AdminSupportPage() {
  const { fetchAllSupportConversations, sendAdminSupportReply } = useVantis();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoading(true);
    try {
      const convos = await fetchAllSupportConversations();
      setConversations(convos);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  const selectedConversation = conversations.find((conv) => conv.userId === selectedUserId);
  const filtered = conversations.filter((conv) => {
    if (!search.trim()) return true;
    return (
      conv.name.toLowerCase().includes(search.toLowerCase()) ||
      conv.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function handleSendReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUserId || !reply.trim()) return;
    setSending(true);
    const result = await sendAdminSupportReply(selectedUserId, reply.trim());
    setSending(false);
    if (!result.ok) return;
    setReply("");
    await loadConversations();
  }

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      <div className="rounded-3xl border border-white/10 bg-ink-800 p-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="grid place-items-center w-11 h-11 rounded-3xl bg-gold-400/10 text-gold-300">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm text-bone/40">Support inbox</p>
            <h2 className="text-lg font-semibold text-bone">Customer conversations</h2>
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-3xl border border-white/10 bg-ink-900/80 py-3 pl-12 pr-4 text-sm text-bone placeholder:text-bone/40 focus:border-gold-400/50 outline-none"
          />
        </div>

        {loading ? (
          <p className="text-sm text-bone/40">Loading conversations…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-bone/40">No customer conversations found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedUserId(conv.userId)}
                className={`w-full text-left rounded-3xl p-4 transition-colors ${selectedUserId === conv.userId ? "bg-gold-400/10 border border-gold-400/20" : "bg-white/5 border border-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-bone">{conv.name}</p>
                    <p className="text-xs text-bone/40">{conv.email}</p>
                  </div>
                  <span className="text-xs text-bone/40">{conv.messages.length} msgs</span>
                </div>
                <p className="text-sm text-bone/40 line-clamp-2">{conv.messages[conv.messages.length - 1]?.text ?? "No messages yet."}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-ink-800 p-6 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-bone/40">Conversation with</p>
                <p className="text-lg font-semibold text-bone">{selectedConversation.name}</p>
                <p className="text-xs text-bone/50">{selectedConversation.email}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-bone/40">
                <CornerUpLeft className="w-3.5 h-3.5" /> reply
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6">
              {selectedConversation.messages.map((msg: any) => (
                <div key={msg.id} className={`max-w-[90%] ${msg.from === "admin" ? "ml-auto bg-teal-400/10 text-teal-100" : "bg-white/5 text-bone"} rounded-3xl px-5 py-4`}>
                  <div className="flex items-center justify-between gap-3 mb-2 text-xs text-bone/40">
                    <span>{msg.from === "admin" ? "You" : <><User className="inline-block w-3.5 h-3.5" /> Customer</>}</span>
                    <span>{new Date(msg.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm leading-6">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.18em] text-bone/40">Reply</label>
              <div className="flex gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-3xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:border-gold-400/50 outline-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-3xl bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950 hover:bg-gold-300 transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="grid place-items-center text-center flex-1">
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10">
              <MessageSquare className="mx-auto mb-4 h-10 w-10 text-gold-300" />
              <p className="text-sm text-bone/40">Select a customer conversation to view and reply.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
