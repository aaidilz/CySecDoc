"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, MapPin, X, ArrowRight } from "lucide-react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <section id="contact" className="w-full py-24 px-6 bg-black relative overflow-hidden selection:bg-red-600/30">
      {/* BACKGROUND GLOW */}
      <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-center">
        {/* LEFT: TEXT & INFO (SEO STRATEGY) */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 text-red-600 mb-8">
            <span className="w-12 h-[2px] bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Hubungi_Saya</span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10 italic">
            MARI <span className="text-red-600 font-outline-2 text-transparent">BICARA.</span>
          </h2>

          <p className="text-zinc-500 text-lg md:text-xl italic leading-relaxed max-w-lg mb-16 text-justify">
            Punya ide project Fullstack yang menantang atau ingin diskusi seputar <span className="text-white font-bold">Cyber Security</span>? Saya siap membantu mewujudkan solusi digital yang aman dan inovatif.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="group cursor-default">
              <p className="text-zinc-800 text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                <Mail size={12} /> Email_Resmi
              </p>
              <a href="mailto:aaallaaamm03@gmail.com" className="text-white font-mono text-lg hover:text-red-600 transition-all block break-all">
                aaallaaamm03@gmail.com
              </a>
            </div>
            <div className="group cursor-default">
              <p className="text-zinc-800 text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                <MapPin size={12} /> Lokasi_Saat_Ini
              </p>
              <p className="text-white font-mono text-lg uppercase tracking-tighter">Indonesia</p>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE FORM */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative bg-zinc-900/10 border border-zinc-900 p-8 md:p-14 rounded-[4rem] backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-2">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  placeholder="Siapa nama Anda?"
                  className="w-full bg-zinc-950/50 border border-zinc-900 py-5 px-8 rounded-3xl text-white outline-none focus:border-red-600 focus:bg-zinc-950 transition-all text-sm font-bold shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-2">Alamat Email</label>
                <input
                  required
                  type="email"
                  placeholder="Email aktif Anda"
                  className="w-full bg-zinc-950/50 border border-zinc-900 py-5 px-8 rounded-3xl text-white outline-none focus:border-red-600 focus:bg-zinc-950 transition-all text-sm font-bold shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-2">Subjek Pesan</label>
              <input
                required
                type="text"
                placeholder="Tujuan pesan (Contoh: Penawaran Project)"
                className="w-full bg-zinc-950/50 border border-zinc-900 py-5 px-8 rounded-3xl text-white outline-none focus:border-red-600 focus:bg-zinc-950 transition-all text-sm font-bold shadow-inner"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-2">Detail Pesan</label>
              <textarea
                required
                rows={6}
                placeholder="Ceritakan detail kebutuhan Anda..."
                className="w-full bg-zinc-950/50 border border-zinc-900 py-6 px-8 rounded-[3rem] text-white outline-none focus:border-red-600 focus:bg-zinc-950 transition-all text-sm font-bold resize-none italic shadow-inner"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button
              disabled={loading}
              className="w-full group relative overflow-hidden bg-white text-black py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-white/5 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-4 relative z-10">
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    KIRIM PESAN <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        </motion.div>
      </div>

      {/* 🚀 POPUP NOTIFIKASI INTERAKTIF */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPopup(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-md p-10 rounded-[3.5rem] border text-center shadow-2xl ${status === "success" ? "bg-zinc-900 border-green-500/30" : "bg-zinc-900 border-red-600/30"}`}
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 ${status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-600/10 text-red-600"}`}>
                {status === "success" ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">{status === "success" ? "Berhasil Terkirim!" : "Gagal Mengirim!"}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                {status === "success" ? "Pesan Anda telah dienkripsi dan dikirim ke Dashboard SysExp. Mohon tunggu balasan segera." : "Terjadi kegagalan pada protokol pengiriman. Silakan coba lagi nanti atau hubungi via email langsung."}
              </p>

              <button
                onClick={() => setShowPopup(false)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${status === "success" ? "bg-green-500 text-black hover:bg-green-400" : "bg-red-600 text-white hover:bg-red-500"}`}
              >
                Dimengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
