"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, BookOpen, Edit3, X, Search, CheckCircle2, AlertCircle, HelpCircle, UploadCloud, FileText, Globe, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function KelolaBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "Tech",
    is_published: true,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  // STATE POPUP REVISI
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [statusPopup, setStatusPopup] = useState({ success: true, message: "" });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBtnLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `blog-thumbs/${fileName}`;
      const { error } = await supabase.storage.from("projects").upload(filePath, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("projects").getPublicUrl(filePath);
      setFormData({ ...formData, image_url: publicUrl });
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSave = async () => {
    setBtnLoading(true);
    const method = editId ? "PUT" : "POST";
    const bodyData = editId ? { id: editId, ...formData } : formData;

    try {
      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setIsFormOpen(false);
        setFormData({ title: "", excerpt: "", content: "", image_url: "", category: "Tech", is_published: true });
        setEditId(null);
        fetchBlogs();

        // Popup Berhasil Simpan
        setStatusPopup({ success: true, message: "Artikel berhasil diperbarui!" });
        setShowNotify(true);
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // FUNGSI EKSEKUSI HAPUS
  const handleDelete = async () => {
    if (!idToDelete) return;
    setShowConfirm(false);

    try {
      const res = await fetch(`/api/blogs?id=${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
        setStatusPopup({ success: true, message: "Artikel telah dihapus selamanya." });
        setShowNotify(true);
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatusPopup({ success: false, message: "Gagal menghapus artikel." });
      setShowNotify(true);
    } finally {
      setIdToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
            Kelola <span className="text-red-600 font-outline-2 text-transparent">Blog</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-mono mt-1 uppercase tracking-[0.3em] italic">{`> ARTICLE_CMS_ACTIVE`}</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ title: "", excerpt: "", content: "", image_url: "", category: "Tech", is_published: true });
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95 shadow-red-600/20"
        >
          <Plus size={18} /> Tulis Artikel
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
          <input
            placeholder="Cari artikel..."
            className="w-full bg-black/50 border border-zinc-800 py-3.5 pl-12 pr-4 rounded-2xl text-xs text-white outline-none focus:border-red-600 transition-all font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 w-full md:max-w-2xl rounded-[2.5rem] relative z-[120] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-white font-bold uppercase text-[9px] tracking-widest flex items-center gap-2">
                <FileText className="text-red-600" size={14} /> Editor Artikel
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <form
              className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="group relative w-full h-32 md:h-44 bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-red-600 transition-all">
                {formData.image_url ? (
                  <img src={formData.image_url} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud size={24} className="text-zinc-800 group-hover:text-red-600" />
                    <p className="text-[8px] text-zinc-600 font-bold mt-2 uppercase">Thumbnail Artikel</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <input
                placeholder="Judul Artikel"
                className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white text-xs outline-none focus:border-red-600 font-bold"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                placeholder="Excerpt (Ringkasan singkat)"
                className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white text-xs outline-none focus:border-red-600 italic"
                value={formData.excerpt || ""}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
              <textarea
                placeholder="Isi Konten (Markdown/HTML Support)..."
                rows={8}
                className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white text-[11px] font-mono outline-none focus:border-red-600 resize-none text-justify"
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />

              <button type="submit" disabled={btnLoading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[10px] tracking-[.3em] uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : "Publish Article"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* LIST BLOG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 col-span-2 gap-4">
            <Loader2 className="animate-spin text-red-600" size={32} />
            <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Syncing_Articles...</p>
          </div>
        ) : (
          blogs
            .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((blog: any) => (
              <div key={blog.id} className="group bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-[2.5rem] flex flex-col gap-4 hover:border-red-600/30 transition-all">
                <div className="h-44 bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-800 relative">
                  <img src={blog.image_url || "https://placehold.co/400x200/000/fff?text=No+Thumbnail"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700">
                    <span className="text-[8px] font-black uppercase text-red-600 tracking-widest italic">{blog.category || "TECH"}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <h4 className="text-white font-black text-sm uppercase leading-tight group-hover:text-red-600 transition-colors line-clamp-2 italic">{blog.title}</h4>
                  <p className="text-zinc-600 text-[10px] line-clamp-2 italic text-justify">{blog.excerpt}</p>
                  <div className="flex justify-between items-center pt-5 border-t border-zinc-800/50 mt-2">
                    <span className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest">{new Date(blog.created_at).toLocaleDateString("id-ID")}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(blog.id);
                          setFormData(blog);
                          setIsFormOpen(true);
                        }}
                        className="p-3 bg-zinc-900 hover:bg-white hover:text-black rounded-xl border border-zinc-800 transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setIdToDelete(blog.id);
                          setShowConfirm(true);
                        }}
                        className="p-3 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-xl border border-zinc-800 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* 🛑 POPUP KONFIRMASI HAPUS */}
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
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Hapus Artikel?</h3>
              <p className="text-zinc-500 text-[9px] font-bold leading-relaxed mb-10 uppercase tracking-widest">Konten ini akan dihapus secara permanen dari arsip database SysExp.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirm(false)} className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-900 hover:bg-zinc-800 transition-all">
                  Batal
                </button>
                <button onClick={handleDelete} className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/20">
                  Hapus!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ POPUP NOTIFIKASI BERHASIL */}
      <AnimatePresence>
        {showNotify && (
          <div className="fixed inset-0 z-[601] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotify(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-sm p-12 rounded-[3.5rem] border text-center ${statusPopup.success ? "bg-zinc-950 border-green-500/30" : "bg-zinc-950 border-red-600/30"}`}
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-8 ${statusPopup.success ? "bg-green-500/10 text-green-500" : "bg-red-600/10 text-red-600"}`}>
                {statusPopup.success ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">{statusPopup.success ? "Berhasil" : "Gagal"}</h3>
              <p className="text-zinc-500 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest italic">{statusPopup.message}</p>
              <button
                onClick={() => setShowNotify(false)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${statusPopup.success ? "bg-green-500 text-black hover:bg-green-400" : "bg-red-600 text-white hover:bg-red-500"}`}
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
