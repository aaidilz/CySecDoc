"use client";
import { useEffect, useState } from "react";
import { Folder, Book, Mail, Cpu, Briefcase, Users, ChevronRight, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    skills: 0,
    experiences: 0,
    visitors: 0,
  });
  const [loading, setLoading] = useState(true);

const fetchDashboardData = async () => {
  try {
    const [p, b, s, e, m, v] = await Promise.all([
      fetch("/api/projects")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/blogs")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/skills")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/experience")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/contact")
        .then((r) => r.json())
        .catch(() => []),
      supabase.from("page_views").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      projects: p.length || 0,
      blogs: b.length || 0,
      skills: s.length || 0,
      experiences: e.length || 0,
      messages: Array.isArray(m) ? m.length : 0,
      visitors: v.count || 0,
    });
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cardData = [
    { label: "Total Project", value: stats.projects, icon: <Folder />, color: "from-blue-600/20" },
    { label: "Total Blog/Artikel", value: stats.blogs, icon: <Book />, color: "from-red-600/20" },
    { label: "Total Pesan Masuk", value: stats.messages, icon: <Mail />, color: "from-green-600/20" },
    { label: "Total Skill", value: stats.skills, icon: <Cpu />, color: "from-yellow-600/20" },
    { label: "Total Experience", value: stats.experiences, icon: <Briefcase />, color: "from-purple-600/20" },
    { label: "Total Pengunjung", value: stats.visitors, icon: <Users />, color: "from-cyan-600/20" },
  ];

  return (
    <div className="pt-24 lg:pt-0 space-y-12 pb-20 selection:bg-red-600/30">
      <header className="relative group px-2">
        <div className="absolute -left-4 top-0 h-full w-1 bg-red-600 transition-all duration-500 group-hover:shadow-[0_0_20px_#dc2626]" />

        {/* FIX: Menghapus class uppercase agar SysExpOwn tidak jadi kapital semua */}
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter transition-transform duration-300 group-hover:translate-x-2">
          Selamat Datang, <span className="text-red-600 hover:text-white transition-colors cursor-default">SysExpOwn</span>
        </h1>

        <p className="text-zinc-500 text-[10px] font-bold mt-4 max-w-2xl leading-relaxed uppercase tracking-widest">Panel kendali utama untuk mengelola seluruh ekosistem digital portofolio Anda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((item, i) => (
          <div key={i} className="group relative bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] transition-all duration-500 hover:border-red-600/50 hover:scale-105 overflow-hidden shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 flex justify-between items-start mb-8">
              <div className="p-4 bg-zinc-800/50 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:rotate-3">{item.icon}</div>
              <Zap size={14} className="text-zinc-700 group-hover:text-red-600 animate-pulse" />
            </div>
            <div className="relative z-10 mt-auto">
              <h4 className="text-5xl font-black text-white tracking-tighter transition-transform duration-500 origin-left">{loading ? "..." : item.value}</h4>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                <ChevronRight size={10} className="text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
