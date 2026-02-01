"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, ArrowUpRight, ArrowLeft, ChevronLeft, ChevronRight, ListFilter, Loader2, BookOpen, Sparkles, TrendingUp, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function BlogDash() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal sinkronisasi data blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((post: any) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.category?.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "terbaru" ? dateB - dateA : dateA - dateB;
      });
  }, [blogs, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentItems = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-2 pb-20 selection:bg-red-600/30 min-h-screen flex flex-col font-sans">
      {/* 1. SEJAJAR ATAS: SEARCH, BACK, & CUSTOM SORT */}
      <nav className="sticky top-2 z-50 flex flex-col md:flex-row items-center gap-3 bg-zinc-950/80 backdrop-blur-xl border border-zinc-900 p-2 rounded-3xl mb-12 shadow-2xl shadow-black">
        <Link href="/" className="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition-all group shrink-0">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Home</span>
        </Link>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input
            type="search"
            placeholder="Cari Artikel Intelligence..."
            className="w-full bg-transparent py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-zinc-800 font-bold"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* CUSTOM DROPDOWN PREMIUM (ANTI ABU-ABU) */}
        <div className="relative w-full md:w-52 shrink-0" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 py-3 px-5 rounded-2xl hover:border-red-600 transition-all group">
            <div className="flex items-center gap-3">
              <ListFilter size={14} className="text-red-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{sortOrder === "terbaru" ? "LATEST POST" : "OLDEST POST"}</span>
            </div>
            <ChevronDown size={14} className={`text-zinc-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-[60]"
              >
                {[
                  { id: "terbaru", label: "LATEST POST" },
                  { id: "terlama", label: "OLDEST POST" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortOrder(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-4 text-[9px] font-black uppercase tracking-widest transition-colors ${sortOrder === option.id ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-800 hover:text-white"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* 2. HEADER: SEO DRIVEN HEADLINE */}
      <header className="mb-14 relative">
        <div className="flex items-center gap-2 text-red-600 mb-3 animate-pulse">
          <TrendingUp size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Knowledge_Stream_Active</span>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
          MASTERING <span className="text-red-600">THE CODE.</span>
        </motion.h1>
        <p className="max-w-2xl text-zinc-500 text-xs md:text-sm mt-4 leading-relaxed italic border-l border-red-600 pl-4">
          Dokumentasi riset mendalam strategi <span className="text-white font-bold italic">Fullstack Development</span> & <span className="text-white font-bold italic">Cyber Security</span> Indonesia.
        </p>
      </header>

      {/* 3. ARTIKEL CARD: GAYA GAHAR */}
      <section className="flex-grow">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={32} />
              <p className="text-zinc-800 font-mono text-[8px] uppercase tracking-widest font-black italic">Sync_Data_Archive...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {currentItems.map((post: any, i: number) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col sm:flex-row gap-6 bg-zinc-900/10 border border-zinc-900 hover:border-red-600/40 p-6 rounded-[2.5rem] transition-all duration-500 hover:bg-zinc-900/20 block h-full"
                  >
                    {/* THUMBNAIL AREA */}
                    <div className="w-full sm:w-44 h-44 bg-black rounded-[2rem] overflow-hidden border border-zinc-800 shrink-0 relative shadow-2xl">
                      <img src={post.image_url || "/no-img.png"} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                    </div>

                    <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={10} /> {post.category || "TECH"}
                          </span>
                          <div className="p-2 bg-zinc-950 rounded-full border border-zinc-800 group-hover:border-red-600/50">
                            <ArrowUpRight className="text-zinc-600 group-hover:text-red-600 transition-all" size={18} />
                          </div>
                        </div>
                        <h2 className="text-xl font-black text-white leading-tight uppercase group-hover:text-red-600 transition-colors mb-3 truncate md:whitespace-normal">{post.title}</h2>
                        <p className="text-zinc-500 text-xs line-clamp-2 italic leading-relaxed opacity-60">{post.excerpt || "Eksplorasi mendalam mengenai implementasi teknologi terbaru dalam ekosistem digital modern."}</p>
                      </div>

                      {/* METADATA */}
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-900 mt-4 text-zinc-700">
                        <div className="flex items-center gap-1.5 font-mono text-[8px] font-black uppercase">
                          <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <span className="text-[8px] opacity-20">|</span>
                        <div className="flex items-center gap-1.5 font-mono text-[8px] font-black uppercase tracking-tighter">
                          <BookOpen size={12} /> 5 MIN READ
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-[3rem] text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em]">Zero_Result_Found</div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. PAGINATION */}
      {!loading && totalPages > 1 && (
        <nav className="flex justify-center items-center gap-6 mt-16 mb-12" aria-label="Pagination Blog">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((c) => c - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-600 hover:text-red-600 disabled:opacity-20 transition-all shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-11 h-11 rounded-2xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "bg-zinc-900 text-zinc-700 hover:text-white border border-zinc-800"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((c) => c + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-600 hover:text-red-600 disabled:opacity-20 transition-all shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </nav>
      )}

      {/* 5. FOOTER INTEGRATED */}
      <footer className="mt-auto pt-10 border-t border-zinc-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-700 text-[8px] font-mono font-black uppercase tracking-[0.4em]">© 2026 ALAM_DEV // UNPAS_INFORMATIKA // BANDUNG_ID</p>
          <div className="flex gap-8 text-zinc-700 text-[8px] font-mono font-black uppercase tracking-widest">
            <span className="hover:text-red-600 cursor-default transition-colors">Operational_Status: Stable</span>
            <span className="hidden md:block">Lat: -6.9147 // Lon: 107.6098</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
