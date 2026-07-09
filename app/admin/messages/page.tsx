"use client";

import { useState, useEffect } from "react";
import { getMessages, markMessageRead, deleteMessage, sendReply } from "@/app/admin/actions/settingsActions";
import { Mail, Trash2, Check, Loader2, MailOpen, Send } from "lucide-react";

interface Message {
  _id: string; name: string; email: string; message: string; read: boolean; createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    getMessages().then((data) => { setMessages(data || []); setLoading(false); });
  }, []);

  const handleRead = async (id: string) => {
    await markMessageRead(id);
    setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id);
    setMessages(messages.filter(m => m._id !== id));
    if (selected === id) {
      setSelected(null);
      setIsReplying(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setReplyingId(selected);
    setReplyError("");
    try {
      await sendReply(selected, replyText);
      setMessages(messages.map(m => m._id === selected ? { ...m, read: true } : m));
      setReplyText("");
      setIsReplying(false);
      alert("Reply sent successfully!");
    } catch (err: any) {
      setReplyError(err.message || "Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  const unread = messages.filter(m => !m.read).length;
  const selectedMsg = messages.find(m => m._id === selected);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <span className="font-mono text-green-accent text-sm">// messages</span>
        <h1 className="text-2xl font-display text-text-primary mt-1">
          Contact Inbox
          {unread > 0 && (
            <span className="ml-3 text-sm font-mono bg-green-accent text-bg-primary px-2 py-0.5 rounded-full">
              {unread} unread
            </span>
          )}
        </h1>
      </div>

      <div className="flex gap-4 w-full" style={{ height: "calc(100vh - 200px)" }}>
        {/* Message list */}
        <div className="w-80 shrink-0 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-text-tertiary font-mono text-sm">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              No messages yet
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => { 
                  setSelected(msg._id); 
                  setIsReplying(false);
                  if (!msg.read) handleRead(msg._id); 
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selected === msg._id
                    ? "border-green-accent/40 bg-green-accent/5"
                    : msg.read
                    ? "border-border-subtle bg-bg-card hover:border-green-accent/20"
                    : "border-green-accent/20 bg-green-accent/5 hover:border-green-accent/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-green-accent shrink-0 mt-1" />}
                    <div>
                      <p className={`text-sm font-semibold ${msg.read ? "text-text-primary" : "text-green-accent"}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs font-mono text-text-tertiary">{msg.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-text-tertiary shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-2 line-clamp-2">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        {selectedMsg ? (
          <div className="flex-1 bg-bg-card border border-border-subtle rounded-3xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{selectedMsg.name}</h2>
                <a href={`mailto:${selectedMsg.email}`} className="text-sm font-mono text-green-accent hover:underline">
                  {selectedMsg.email}
                </a>
                <p className="text-xs text-text-tertiary font-mono mt-1">
                  {new Date(selectedMsg.createdAt).toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                {!selectedMsg.read && (
                  <button
                    onClick={() => handleRead(selectedMsg._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-green-accent bg-green-accent/10 border border-green-accent/20 rounded-full hover:bg-green-accent/20 transition-colors"
                  >
                    <Check size={11} /> Mark Read
                  </button>
                )}
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full transition-colors ${
                    isReplying 
                      ? "bg-green-accent text-bg-primary" 
                      : "text-text-secondary bg-bg-primary border border-border-subtle hover:text-text-primary"
                  }`}
                >
                  <MailOpen size={11} /> Reply
                </button>
                <button
                  onClick={() => handleDelete(selectedMsg._id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="bg-bg-primary rounded-2xl p-5 border border-border-subtle">
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>

            {isReplying && (
              <div className="mt-6 pt-6 border-t border-border-subtle animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-mono text-text-primary mb-3">Drafting Reply to {selectedMsg.name}</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full bg-bg-primary/50 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-4 text-text-primary outline-none transition-all resize-none font-sans placeholder:text-text-tertiary/50 mb-4"
                />
                
                {replyError && (
                  <p className="text-red-400 text-xs font-mono mb-4">{replyError}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || replyingId !== null}
                    className="flex items-center gap-2 px-6 py-2 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold text-xs rounded-full transition-all disabled:opacity-50"
                  >
                    {replyingId === selectedMsg._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-tertiary font-mono text-sm">
            <div className="text-center">
              <Mail size={40} className="mx-auto mb-3 opacity-20" />
              <p>Select a message to read it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
