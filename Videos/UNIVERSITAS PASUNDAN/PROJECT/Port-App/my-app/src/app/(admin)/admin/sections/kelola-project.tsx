"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Loader2, Edit3, X, Search, CheckCircle2, AlertCircle, HelpCircle, UploadCloud, ChevronLeft, ChevronRight, Calendar, Briefcase, Globe, Tag, AlignLeft, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function KelolaProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    tags: "",
    image_url: "",
    project_date: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [statusPopup, setStatusPopup] = useState({ success: true, message: "" });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const triggerNotify = (success: boolean, message: string) => {
    setStatusPopup({ success, message });
    setShowNotify(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBtnLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `thumbs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("projects").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("projects").getPublicUrl(filePath);
      setFormData({ ...formData, image_url: publicUrl });
      triggerNotify(true, "Gambar terunggah!");
    } catch {
      triggerNotify(false, "Gagal upload gambar.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSave = async () => {
    setBtnLoading(true);
    const method = editId ? "PUT" : "POST";
    const bodyData = editId ? { id: editId, ...formData } : formData;

    try {
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bodyData,
          tags: typeof formData.tags === "string" ? formData.tags.split(",").map((t) => t.trim()) : formData.tags,
        }),
      });

      if (res.ok) {
        setIsFormOpen(false);
        setFormData({ title: "", description: "", link: "", tags: "", image_url: "", project_date: "" });
        setEditId(null);
        fetchProjects();
        triggerNotify(true, editId ? "Project diperbarui!" : "Project ditambahkan!");
      }
    } catch {
      triggerNotify(false, "Gagal menyimpan data.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) return;
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/projects?id=${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
        triggerNotify(true, "Project dihapus.");
      }
    } finally {
      setIdToDelete(null);
    }
  };

  const filteredData = useMemo(() => {
    return projects
      .filter((p: any) => (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a: any, b: any) => {
        const dA = new Date(a.created_at).getTime();
        const dB = new Date(b.created_at).getTime();
        return sortOrder === "newest" ? dB - dA : dA - dB;
      });
  }, [projects, searchQuery, sortOrder]);

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative px-4 md:px-0 selection:bg-red-600/30">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
            Kelola <span className="text-red-600 font-outline-2 text-transparent">Project</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-mono mt-1 uppercase tracking-[0.3em] italic">{`> SYSTEM_LOG: ACTIVE`}</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ title: "", description: "", link: "", tags: "", image_url: "", project_date: "" });
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95 shadow-red-600/20"
        >
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
          <input
            placeholder="Cari project..."
            className="w-full bg-black/50 border border-zinc-800 py-3.5 pl-12 pr-4 rounded-2xl text-xs text-white outline-none focus:border-red-600 transition-all font-bold placeholder:text-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="bg-black/50 border border-zinc-800 text-[10px] font-black p-3.5 rounded-2xl text-zinc-500 outline-none uppercase italic" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      {/* REVISED MODAL (CENTERED & COMPACT) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-[400px] rounded-[2.5rem] relative z-[160] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h2 className="text-white font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 italic">
                  <LayoutGrid className="text-red-600" size={14} /> {editId ? "Ubah Project" : "New Project"}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
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
                <div className="group relative w-full h-32 bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-red-600 transition-all">
                  {formData.image_url ? (
                    <img src={formData.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-zinc-800 group-hover:text-red-600 transition-colors" />
                      <p className="text-[7px] text-zinc-600 font-bold mt-1 uppercase tracking-widest">Thumbnail Project</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div className="space-y-3">
                  <input
                    placeholder="Judul Project"
                    className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-[11px] outline-none focus:border-red-600 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-[11px] outline-none focus:border-red-600 uppercase font-bold"
                      value={formData.project_date}
                      onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Link Project"
                      className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-[11px] outline-none focus:border-red-600"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>
                  <input
                    placeholder="Tags (React, Laravel, PHP)"
                    className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-[11px] outline-none focus:border-red-600"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                  <textarea
                    placeholder="Deskripsi Singkat..."
                    rows={3}
                    className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-[11px] outline-none focus:border-red-600 resize-none italic"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={btnLoading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[9px] tracking-[.4em] uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                  {btnLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Publish Project"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIST DATA */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="p-20 text-center text-zinc-800 font-mono text-[10px] animate-pulse italic tracking-[0.5em]">SYNCING_REPOSITORIES...</div>
        ) : (
          currentItems.map((pj: any) => (
            <div key={pj.id} className="group bg-zinc-900/20 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between hover:border-red-600/30 transition-all">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                  <img src={pj.image_url || "/no-img.png"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-tight group-hover:text-red-600 transition-colors italic">{pj.title}</h4>
                  <p className="text-zinc-700 text-[8px] font-mono mt-1 uppercase tracking-widest">{pj.project_date || "No Date"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(pj.id);
                    setFormData({ ...pj, tags: Array.isArray(pj.tags) ? pj.tags.join(", ") : pj.tags });
                    setIsFormOpen(true);
                  }}
                  className="p-2.5 bg-zinc-900 text-zinc-600 hover:text-white rounded-xl border border-zinc-800 transition-all"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => {
                    setIdToDelete(pj.id);
                    setShowConfirm(true);
                  }}
                  className="p-2.5 bg-zinc-900 text-zinc-600 hover:text-red-600 rounded-xl border border-zinc-800 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-zinc-900/20 p-4 rounded-2xl border border-zinc-900">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((c) => c - 1)} className="p-2 text-zinc-700 hover:text-red-600 disabled:opacity-10">
            <ChevronLeft size={18} />
          </button>
          <span className="text-[9px] font-black font-mono text-zinc-800 uppercase tracking-widest italic">
            PAGE_{currentPage}_OF_{totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((c) => c + 1)} className="p-2 text-zinc-700 hover:text-red-600 disabled:opacity-10">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* POPUP KONFIRMASI */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm p-12 rounded-[3.5rem] border border-red-600/20 bg-zinc-950 text-center shadow-2xl shadow-red-600/5"
            >
              <HelpCircle className="mx-auto text-red-600 mb-8" size={60} />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Delete_Data?</h3>
              <p className="text-zinc-600 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest">Asset ini akan dihapus permanen dari portofolio SysExp.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirm(false)} className="py-5 bg-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-600 hover:bg-zinc-800 transition-all">
                  Batal
                </button>
                <button onClick={handleDelete} className="py-5 bg-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-red-500 shadow-xl shadow-red-600/20 transition-all">
                  Hapus!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP NOTIFIKASI */}
      <AnimatePresence>
        {showNotify && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotify(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-sm p-12 rounded-[3.5rem] border text-center shadow-2xl ${statusPopup.success ? "bg-zinc-950 border-green-500/30" : "bg-zinc-950 border-red-600/30"}`}
            >
              {statusPopup.success ? <CheckCircle2 className="mx-auto text-green-500 mb-8 animate-bounce" size={60} /> : <AlertCircle className="mx-auto text-red-600 mb-8" size={60} />}
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">{statusPopup.success ? "Success_Log" : "System_Failure"}</h3>
              <p className="text-zinc-600 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest italic">{statusPopup.message}</p>
              <button
                onClick={() => setShowNotify(false)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${statusPopup.success ? "bg-green-500 text-black shadow-green-500/20" : "bg-red-600 text-white shadow-red-600/20"}`}
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
