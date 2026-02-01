"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Loader2, Briefcase, Edit3, X, Search, CheckCircle2, AlertCircle, HelpCircle, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

export default function KelolaExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null });
  const [statusPopup, setStatusPopup] = useState({ show: false, success: true, message: "" });

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
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
      const res = await fetch("/api/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        showStatus(true, editId ? "Pengalaman diperbarui!" : "Pengalaman ditambahkan!");
        setFormData({ company: "", role: "", start_date: "", end_date: "", description: "", location: "" });
        setEditId(null);
        setIsFormOpen(false);
        fetchExperiences();
      }
    } catch {
      showStatus(false, "Gagal menyimpan data.");
    } finally {
      setBtnLoading(false);
      setModal({ ...modal, show: false });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus(true, "Data dihapus.");
      fetchExperiences();
    }
    setModal({ ...modal, show: false });
  };

  const filteredData = useMemo(() => {
    return experiences.filter((e: any) => (e.company || "").toLowerCase().includes(searchQuery.toLowerCase()) || (e.role || "").toLowerCase().includes(searchQuery.toLowerCase()));
  }, [experiences, searchQuery]);

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
            Kelola <span className="text-red-600">Experience</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-mono mt-1 uppercase tracking-[0.3em] italic">{`> CAREER_HISTORY_DATABASE`}</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ company: "", role: "", start_date: "", end_date: "", description: "", location: "" });
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Tambah Karir
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
          <input
            placeholder="Cari posisi atau perusahaan..."
            className="w-full bg-black/50 border border-zinc-800 py-3 pl-12 pr-4 rounded-2xl text-xs text-white outline-none focus:border-red-600 transition-all"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MODAL FORM REVISI: LEBIH KE ATAS DI MOBILE */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />

          {/* REVISI: items-center pada parent dan p-4 pada container memastikan modal ada di tengah/atas, bukan nempel bawah */}
          <div className="bg-zinc-900 border border-zinc-800 w-full md:max-w-lg rounded-[2.5rem] relative z-[120] animate-in zoom-in duration-300 max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-white font-bold uppercase text-[9px] tracking-widest flex items-center gap-2">
                <Briefcase className="text-red-600" size={14} /> {editId ? "Update Career" : "New Career"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                <X size={16} />
              </button>
            </div>

            <form
              className="p-5 space-y-4 overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                setModal({ show: true, title: "Simpan?", message: "Update riwayat karir Anda?", onConfirm: handleSave });
              }}
            >
              <input
                placeholder="Perusahaan"
                className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl text-white text-[11px] outline-none focus:border-red-600"
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
              <input
                placeholder="Role / Jabatan"
                className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl text-white text-[11px] outline-none focus:border-red-600"
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl text-white text-[11px] outline-none"
                  value={formData.start_date || ""}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl text-white text-[11px] outline-none"
                  value={formData.end_date || ""}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Deskripsi pekerjaan..."
                rows={3}
                className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl text-white text-[11px] outline-none focus:border-red-600 resize-none"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <button type="submit" disabled={btnLoading} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black text-[9px] tracking-[.3em] uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : editId ? "Update" : "Publish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIST DATA */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-20 text-center text-zinc-800 font-mono text-[10px] animate-pulse italic tracking-[0.5em]">SYNCING_HISTORY...</div>
        ) : (
          currentItems.map((ex: any) => (
            <div key={ex.id} className="group bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between hover:border-red-600/30 transition-all gap-4">
              <div className="flex gap-5 items-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 group-hover:bg-red-600 transition-colors">
                  <Briefcase size={20} className="text-zinc-500 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="text-white font-black text-base tracking-tight group-hover:text-red-600 transition-colors uppercase">{ex.role}</h4>
                  <p className="text-zinc-400 text-xs font-bold">{ex.company}</p>
                  <p className="flex items-center gap-1.5 text-zinc-600 text-[9px] uppercase font-mono mt-1">
                    <Calendar size={12} /> {ex.start_date} - {ex.end_date || "Present"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(ex.id);
                    setFormData({ ...ex });
                    setIsFormOpen(true);
                  }}
                  className="p-3 bg-zinc-800 hover:bg-white hover:text-black rounded-xl transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setModal({ show: true, title: "Hapus?", message: `Hapus riwayat di "${ex.company}"?`, onConfirm: () => handleDelete(ex.id) })}
                  className="p-3 bg-zinc-800 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POPUP BERHASIL/GAGAL */}
      {statusPopup.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] text-center animate-in zoom-in duration-300 shadow-2xl max-w-xs md:max-w-md w-full">
            {statusPopup.success ? <CheckCircle2 className="mx-auto text-green-500 mb-6 animate-bounce" size={80} /> : <AlertCircle className="mx-auto text-red-600 mb-6" size={80} />}
            <h3 className="text-white font-black uppercase text-xl md:text-3xl italic">{statusPopup.success ? "Berhasil!" : "Gagal!"}</h3>
            <p className="text-zinc-500 text-[10px] md:text-sm mt-3 uppercase tracking-widest leading-relaxed">{statusPopup.message}</p>
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
