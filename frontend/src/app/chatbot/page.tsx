"use client";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import api from "@/services/api";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTIONS = [
  "What is the price in Koramangala?",
  "Which area is best to invest?",
  "Compare Indiranagar vs Whitefield",
  "How does the AI valuation work?",
  "What is the forecast for Electronic City?",
  "How is fraud detected?",
  "What are the cheapest areas in Bangalore?",
];

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  // Render markdown-like bold text
  const formatted = msg.content
    .split("\n")
    .map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-bold text-white">{part}</strong> : part
          )}
        </p>
      );
    });

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? "bg-gold-500" : "bg-dark-700"
      }`} style={isUser ? { background: "linear-gradient(135deg,#c9a84c,#e8c46a)" } : { background: "rgba(255,255,255,0.08)" }}>
        {isUser ? <User size={14} className="text-dark-900" /> : <Bot size={14} className="text-gold-400" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "rounded-tr-sm text-dark-900 font-medium"
          : "rounded-tl-sm text-white/80"
      }`}
        style={isUser
          ? { background: "linear-gradient(135deg,#c9a84c,#e8c46a)" }
          : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {formatted}
        <p className={`text-[10px] mt-1.5 ${isUser ? "text-dark-900/50 text-right" : "text-white/20"}`}>{msg.time}</p>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hi! I'm **Land IQ Assistant** — your AI guide for Bangalore real estate.\n\nI can explain valuations, live prices, fraud detection, dispute risk, and investment recommendations.\n\nWhat would you like to know?",
    time: new Date().toLocaleTimeString(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await api.post("/chatbot/chat", {
        message: msg,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        time: new Date().toLocaleTimeString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again.",
        time: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", background: "rgba(17,17,24,0.8)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#c9a84c,#e8c46a)" }}>
                <Bot size={18} className="text-dark-900" />
              </div>
              <div>
                <p className="font-bold text-white">Land IQ Assistant</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online · Explainable AI
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}>
                    <Bot size={14} className="text-gold-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gold-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Ask about Bangalore land prices, valuations, fraud..."
                  className="input-field flex-1"
                  disabled={loading}
                />
                <button onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="gold-btn px-4 py-2 rounded-xl disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions sidebar */}
          <div className="w-64 p-4 overflow-y-auto"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.5)" }}>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">💬 Quick Questions</p>
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="w-full text-left text-xs text-white/50 hover:text-gold-400 p-2.5 rounded-xl transition-all hover:bg-gold-500/5"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <p className="text-xs font-bold text-gold-400 mb-2">🤖 AI Capabilities</p>
              <ul className="text-xs text-white/40 space-y-1">
                <li>• Live price queries</li>
                <li>• Investment advice</li>
                <li>• Model explanations</li>
                <li>• Area comparisons</li>
                <li>• Fraud & dispute info</li>
                <li>• Price forecasts</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
