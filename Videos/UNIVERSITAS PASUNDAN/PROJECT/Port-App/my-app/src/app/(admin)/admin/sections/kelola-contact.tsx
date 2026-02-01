"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, User, MessageSquare, Search, Loader2, ChevronRight, CheckCircle2, Inbox, Send, ShieldAlert, RefreshCcw, X, AlertCircle, HelpCircle } from "lucide-react";

export default function KelolaContact() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // STATE POPUP
  const [showNotify, setShowNotify] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [popupStatus, setPopupStatus] = useState<"success" | "error">("success");
  const [popupMsg, setPopupMsg] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal sinkronisasi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedMessage = messages.find((m) => m.id === selectedId);

  // TRIGGER KONFIRMASI
  const triggerDelete = (id: string) => {
    setIdToDelete(id);
    setShowConfirm(true);
  };

  // EKSEKUSI HAPUS REAL (DATABASE)
  const executeDelete = async () => {
    if (!idToDelete) return;
    setShowConfirm(false); // Tutup popup tanya

    try {
      const res = await fetch(`/api/contact?id=${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== idToDelete));
        if (selectedId === idToDelete) setSelectedId(null);

        setPopupStatus("success");
        setPopupMsg("Log komunikasi telah dimusnahkan selamanya.");
        setShowNotify(true);
      } else {
        throw new Error();
      }
    } catch (err) {
      setPopupStatus("error");
      setPopupMsg("Gagal mengakses database. Protokol hapus dibatalkan.");
      setShowNotify(true);
    } finally {
      setIdToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 md:p-10 selection:bg-red-600/30 relative">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-red-600 mb-3 animate-pulse italic">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Contact_Management_v2.1</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">
            KELOLA <span className="text-red-600 font-outline-2 text-transparent">CONTACT.</span>
          </h1>
        </div>
        <button onClick={fetchMessages} className="hidden lg:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-800 hover:text-red-600 transition-colors italic">
          <RefreshCcw size={12} /> SYNC_DATABASE
        </button>
      </div>

      {/* INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 flex-grow overflow-hidden border-t border-zinc-900 pt-10">
        {/* SIDEBAR */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-3 custom-scrollbar">
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800" size={18} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/10 border border-zinc-900 py-4.5 pl-14 pr-6 rounded-2xl text-xs outline-none focus:border-red-600 transition-all font-bold"
            />
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-red-600" />
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedId(msg.id)}
                  className={`group cursor-pointer p-6 rounded-[2.5rem] border transition-all duration-500 ${selectedId === msg.id ? "bg-zinc-900 border-red-600/50 shadow-2xl shadow-red-600/5" : "bg-zinc-950 border-zinc-900 hover:border-zinc-800"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">{new Date(msg.created_at).toLocaleDateString()}</span>
                    <ChevronRight size={14} className={selectedId === msg.id ? "text-red-600" : "text-zinc-900"} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white mb-2 truncate group-hover:text-red-600 transition-colors">{msg.name}</h3>
                  <p className="text-zinc-600 text-[10px] italic line-clamp-1 uppercase">{msg.subject}</p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT VIEWER */}
        <div className="bg-zinc-950/20 border border-zinc-900 rounded-[4rem] p-10 md:p-14 relative flex flex-col min-h-[600px]">
          {selectedMessage ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14 pb-14 border-b border-zinc-900/50">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-[1.8rem] flex items-center justify-center text-red-600">
                    <User size={30} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">{selectedMessage.name}</h2>
                    <p className="text-zinc-500 font-mono text-xs lowercase">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => triggerDelete(selectedMessage.id)} className="p-4.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-800 hover:text-red-600 hover:border-red-600 transition-all shadow-lg">
                    <Trash2 size={22} />
                  </button>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="flex items-center gap-3 px-10 py-4.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-white/5"
                  >
                    REPLY_MAIL <Send size={14} />
                  </a>
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 text-red-600 mb-8 font-black uppercase text-[10px] tracking-[0.4em]">
                  <MessageSquare size={16} /> SUBJEK: {selectedMessage.subject}
                </div>
                <div className="text-zinc-400 leading-[2] text-lg font-medium bg-zinc-900/10 p-12 rounded-[3.5rem] border border-zinc-900 italic text-justify shadow-2xl selection:bg-red-600/30">"{selectedMessage.message}"</div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-900 gap-6 opacity-30">
              <Mail size={80} className="animate-bounce" />
              <p className="text-[10px] font-black uppercase tracking-[0.8em] italic">Waiting_For_Input...</p>
            </div>
          )}
        </div>
      </div>

      {/* 🛑 1. POPUP KONFIRMASI HAPUS */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm p-12 rounded-[3.5rem] border border-red-600/20 bg-zinc-950 text-center shadow-2xl shadow-red-600/5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 bg-red-600/10 text-red-600">
                <HelpCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Konfirmasi_Hapus?</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-10 uppercase tracking-widest font-bold">Data akan dimusnahkan secara permanen dari server database SysExp.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirm(false)} className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-900 hover:bg-zinc-800 transition-all">
                  Batal
                </button>
                <button onClick={executeDelete} className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/20">
                  Ya, Hapus!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ 2. POPUP NOTIFIKASI BERHASIL */}
      <AnimatePresence>
        {showNotify && (
          <div className="fixed inset-0 z-[601] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotify(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-sm p-12 rounded-[3.5rem] border text-center ${popupStatus === "success" ? "bg-zinc-950 border-green-500/30" : "bg-zinc-950 border-red-600/30"}`}
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-8 ${popupStatus === "success" ? "bg-green-500/10 text-green-500 shadow-green-500/10" : "bg-red-600/10 text-red-600 shadow-red-600/10 shadow-xl"}`}
              >
                {popupStatus === "success" ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">{popupStatus === "success" ? "Sistem_Updated" : "Error_Detected"}</h3>
              <p className="text-zinc-500 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest italic">{popupMsg}</p>
              <button
                onClick={() => setShowNotify(false)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${popupStatus === "success" ? "bg-green-500 text-black hover:bg-green-400" : "bg-red-600 text-white hover:bg-red-500"}`}
              >
                Tutup_Log
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
