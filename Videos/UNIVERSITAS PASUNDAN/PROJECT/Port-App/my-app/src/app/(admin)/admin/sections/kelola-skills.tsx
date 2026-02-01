"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Loader2, Cpu, Edit3, X, Search, CheckCircle2, AlertCircle, HelpCircle, Tag } from "lucide-react";

export default function KelolaSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({ name: "", category: "Frontend" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null });
  const [statusPopup, setStatusPopup] = useState({ show: false, success: true, message: "" });

  const categories = ["Frontend", "Backend", "Database", "Tools", "Security", "Other"];

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showStatus = (success: boolean, msg: string) => {
    setStatusPopup({ show: true, success, message: msg });
    setTimeout(() => setStatusPopup({ show: false, success: true, message: "" }), 3000);
  };

  const handleSave = async () => {
    setBtnLoading(true);
    const method = editId ? "PUT" : "POST";
    const bodyData = editId ? { id: editId, ...formData } : formData;

    try {
      const res = await fetch("/api/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        showStatus(true, editId ? "Skill updated!" : "Skill added to arsenal!");
        setFormData({ name: "", category: "Frontend" });
        setEditId(null);
        setIsFormOpen(false);
        fetchSkills();
      }
    } catch {
      showStatus(false, "System error.");
    } finally {
      setBtnLoading(false);
      setModal({ ...modal, show: false });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus(true, "Skill removed.");
      fetchSkills();
    }
    setModal({ ...modal, show: false });
  };

  const filteredData = useMemo(() => {
    return skills.filter((s: any) => (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (s.category || "").toLowerCase().includes(searchQuery.toLowerCase()));
  }, [skills, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
            Tech <span className="text-red-600">Arsenal</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-mono mt-1 uppercase tracking-[0.3em] italic">{`> SKILLS_AND_TECHNOLOGIES_DB`}</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", category: "Frontend" });
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Add New Skill
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
          <input
            placeholder="Search technology..."
            className="w-full bg-black/50 border border-zinc-800 py-3 pl-12 pr-4 rounded-2xl text-xs text-white outline-none focus:border-red-600 transition-all"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MODAL FORM (REVISI: CENTERED & SLIM) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] relative z-[120] animate-in zoom-in duration-300 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-white font-bold uppercase text-[9px] tracking-widest flex items-center gap-2">
                <Cpu className="text-red-600" size={14} /> {editId ? "Update Skill" : "New Arsenal"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                <X size={16} />
              </button>
            </div>

            <form
              className="p-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setModal({ show: true, title: "Save Skill?", message: "Data will be added to your public portfolio.", onConfirm: handleSave });
              }}
            >
              <div className="space-y-1">
                <label className="text-[8px] text-zinc-600 uppercase font-black ml-1">Skill Name</label>
                <input
                  placeholder="Contoh: ReactJS"
                  className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-xs outline-none focus:border-red-600"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-zinc-600 uppercase font-black ml-1">Category</label>
                <select
                  className="w-full bg-black/40 border border-zinc-800 p-3.5 rounded-xl text-white text-xs outline-none focus:border-red-600"
                  value={formData.category || "Frontend"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={btnLoading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[10px] tracking-[.3em] uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : editId ? "Update Skill" : "Deploy Skill"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIST DATA DENGAN SISTEM BADGE */}
      <div className="flex flex-wrap gap-3">
        {loading ? (
          <div className="w-full p-20 text-center text-zinc-800 font-mono text-[10px] animate-pulse italic tracking-[0.5em]">SCANNING_ARSENAL...</div>
        ) : (
          filteredData.map((s: any) => (
            <div key={s.id} className="group bg-zinc-900/30 border border-zinc-800/50 pl-5 pr-2 py-2 rounded-2xl flex items-center gap-4 hover:border-red-600/30 transition-all">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs">{s.name}</span>
                <span className="text-zinc-600 text-[8px] uppercase font-black tracking-widest">{s.category}</span>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => {
                    setEditId(s.id);
                    setFormData({ ...s });
                    setIsFormOpen(true);
                  }}
                  className="p-2 text-zinc-600 hover:text-white transition-colors"
                >
                  <Edit3 size={12} />
                </button>
                <button onClick={() => setModal({ show: true, title: "Destroy?", message: `Remove "${s.name}"?`, onConfirm: () => handleDelete(s.id) })} className="p-2 text-zinc-600 hover:text-red-600 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POPUP STATUS (BIG) */}
      {statusPopup.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] text-center animate-in zoom-in duration-300 shadow-2xl max-w-xs md:max-w-md w-full">
            {statusPopup.success ? <CheckCircle2 className="mx-auto text-green-500 mb-6 animate-bounce" size={80} /> : <AlertCircle className="mx-auto text-red-600 mb-6" size={80} />}
            <h3 className="text-white font-black uppercase text-xl md:text-3xl italic">{statusPopup.success ? "Berhasil!" : "Gagal!"}</h3>
            <p className="text-zinc-500 text-[10px] md:text-sm mt-3 uppercase tracking-widest">{statusPopup.message}</p>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      {modal.show && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] max-w-xs md:max-w-md w-full animate-in zoom-in duration-200 shadow-2xl">
            <HelpCircle className="mx-auto text-red-600 mb-6" size={50} />
            <h3 className="text-white font-bold text-center text-xs md:text-lg uppercase tracking-widest">{modal.title}</h3>
            <p className="text-zinc-500 text-center text-[10px] md:text-xs mt-3 leading-relaxed">{modal.message}</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 py-3.5 bg-zinc-800 text-white rounded-xl font-bold text-[9px] md:text-[11px] uppercase transition-colors hover:bg-zinc-700">
                Batal
              </button>
              <button onClick={modal.onConfirm} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold text-[9px] md:text-[11px] uppercase shadow-red-600/30 hover:bg-red-700 transition-colors">
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
