"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2, Lock } from "lucide-react";
import { getGeminiResponse } from "@/lib/gemini";
import Link from "next/link";

export default function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Halo! Saya asisten AI Salam. Ada yang bisa saya bantu?", isSecret: false }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleChat = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg, isSecret: false }]);
    setInput("");
    setLoading(true);

    // LOGIKA PINTU RAHASIA (Gak butuh API Google)
    if (userMsg === "SysExpOwn Login") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Akses Owner Terdeteksi. Selamat datang, Boss Salam.",
            isSecret: true,
          },
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const aiText = await getGeminiResponse(userMsg);
      setMessages((prev) => [...prev, { role: "bot", text: aiText, isSecret: false }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Maaf, sistem sedang sibuk.", isSecret: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 left-6 md:left-10 z-[100] w-14 h-14 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center shadow-2xl hover:border-red-600 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-6 md:left-10 z-[100] w-[350px] max-w-[90vw] h-[500px] bg-[#0c0c0c] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-5 bg-zinc-900/50 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">SysExp Assistant</h4>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] shadow-sm ${msg.role === "user" ? "bg-red-600 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-300 border border-white/5 rounded-tl-none"}`}>
                    {msg.text}
                    {msg.isSecret && (
                      <Link
                        href="/login"
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-black rounded-xl hover:bg-red-600 hover:text-white transition-all text-[9px] uppercase tracking-tighter shadow-lg"
                      >
                        <Lock size={12} /> Enter Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 p-3 rounded-2xl">
                    <Loader2 size={16} className="animate-spin text-red-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-900/50 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ketik pesan..."
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-red-600"
              />
              <button onClick={handleChat} className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
