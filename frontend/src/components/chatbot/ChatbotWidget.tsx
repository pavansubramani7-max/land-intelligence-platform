"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import api from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Best area to invest?",
  "Price in Koramangala?",
  "How does AI valuation work?",
  "Cheapest areas in Bangalore?",
];

function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className={i > 0 ? "mt-1" : ""}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-bold text-white">{part}</strong> : part
        )}
      </p>
    );
  });
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hi! I'm **Land IQ Assistant**.\n\nAsk me about Bangalore land prices, valuations, fraud detection, or investment advice!",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimized]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chatbot/chat", {
        message: msg,
        history: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, couldn't connect. Make sure the backend is running." }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: 360, height: minimized ? 56 : 500, background: "rgba(10,10,15,0.97)", border: "1px solid rgba(201,168,76,0.3)", transition: "height 0.3s ease" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(232,196,106,0.08))", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#c9a84c,#e8c46a)" }}>
                <Bot size={14} className="text-dark-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Land IQ Assistant</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online · Explainable AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimized(m => !m)} className="text-white/30 hover:text-white/70 transition-colors"><Minimize2 size={14} /></button>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70 transition-colors"><X size={16} /></button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={msg.role === "user" ? { background: "linear-gradient(135deg,#c9a84c,#e8c46a)" } : { background: "rgba(255,255,255,0.08)" }}>
                      {msg.role === "user" ? <User size={10} className="text-dark-900" /> : <Bot size={10} className="text-gold-400" />}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg,#c9a84c,#e8c46a)", color: "#0a0a0f" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}>
                      {formatContent(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <Bot size={10} className="text-gold-400" />
                    </div>
                    <div className="px-3 py-2 rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex gap-1">
                        {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[10px] px-2.5 py-1 rounded-full text-white/50 hover:text-gold-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 flex gap-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Ask about Bangalore land..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl text-white placeholder-white/30 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  disabled={loading}
                />
                <button onClick={() => send()} disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#c9a84c,#e8c46a)" }}>
                  <Send size={12} className="text-dark-900" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg,#c9a84c,#e8c46a)", boxShadow: "0 8px 32px rgba(201,168,76,0.5)" }}>
        {open ? <X size={22} className="text-dark-900" /> : <MessageCircle size={22} className="text-dark-900" />}
        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-dark-900" />}
      </button>
    </>
  );
}
