"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Layout, Database, Lock, Globe, Loader2 } from "lucide-react";

export default function About() {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, skillRes] = await Promise.all([
          fetch("/api/experience").then((res) => res.json()),
          fetch("/api/skills")
            .then((res) => res.json())
            .catch(() => []),
        ]);
        setExperiences(expRes || []);
        setSkills(skillRes || []);
      } catch (err) {
        console.error("Failed to fetch portfolio data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const frontendSkills = skills.filter((s: any) => s.category?.toLowerCase().includes("front") || s.category?.toLowerCase().includes("ux")).map((s: any) => s.name);
  const backendSkills = skills.filter((s: any) => s.category?.toLowerCase().includes("back") || s.category?.toLowerCase().includes("data")).map((s: any) => s.name);
  const toolsSkills = skills.filter((s: any) => s.category?.toLowerCase().includes("tool") || s.category?.toLowerCase().includes("secu")).map((s: any) => s.name);

  return (
    <section id="about" className="py-24 bg-white dark:bg-black overflow-hidden selection:bg-red-600/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 1. JUDUL */}
        <div className="text-center mb-20">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase text-black dark:text-white">
            About <span className="text-red-600">Me.</span>
          </motion.h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-xl mx-auto italic">"Mengenal lebih dekat perjalanan saya di dunia teknologi dan pengembangan web."</p>
        </div>

        {/* 2. LAYOUT: FOTO & DESKRIPSI (FIXED MOBILE VISIBILITY) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-32">
          {/* FOTO: Sekarang muncul di Mobile & Desktop */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex justify-center lg:justify-start order-first">
            <div className="relative w-full max-w-[280px] md:max-w-[350px]">
              <img
                src="/me.png"
                alt="Fullstack Web Developer - Alam Profile"
                className="w-full h-auto object-contain pointer-events-none relative z-10"
                style={{
                  maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                }}
              />
              {/* Efek Glow di belakang foto */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-600/20 blur-[80px] md:blur-[100px] -z-0" />
            </div>
          </motion.div>

          {/* DESKRIPSI */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white flex items-center justify-center lg:justify-start gap-3">
              <Globe className="text-red-600 shrink-0" size={20} /> Muhamad Nur Salam
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Saya adalah seorang <span className="text-black dark:text-white font-bold">Fullstack Web Developer</span> dan mahasiswa <span className="text-black dark:text-white font-bold">Informatika</span> di
              <a href="https://www.unpas.ac.id" target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:underline mx-1">
                Universitas Pasundan
              </a>
              angkatan 2024. Saya memiliki spesialisasi dalam membangun aplikasi web modern menggunakan ekosistem <span className="text-red-600 font-medium">Next.js, Laravel, dan Tailwind CSS.</span>
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Berfokus pada efisiensi kode, saya juga mendalami <span className="text-black dark:text-white font-bold">Cyber Security</span> untuk memastikan setiap sistem yang saya bangun memiliki standar keamanan tingkat tinggi.
            </p>

            <div className="flex justify-center lg:justify-start gap-4 pt-2">
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Hai, salam kenal!!</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. TIMELINE: EXPERIENCE & EDUCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest mb-10 text-black dark:text-white">
              <Briefcase className="text-red-600" size={20} /> Experience
            </h4>
            <div className="space-y-8 border-l-2 border-zinc-100 dark:border-zinc-800 ml-2">
              {loading ? (
                <div className="pl-8 flex items-center gap-2 text-zinc-500 animate-pulse font-mono text-xs uppercase italic">
                  <Loader2 className="animate-spin" size={14} /> Synchronizing...
                </div>
              ) : (
                experiences.map((exp: any) => (
                  <div key={exp.id} className="relative pl-8 group">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626] group-hover:scale-125 transition-transform" />
                    <h5 className="font-bold text-sm dark:text-white uppercase tracking-tight">{exp.role}</h5>
                    <p className="text-red-600 text-[10px] font-mono font-black mb-1 uppercase">{exp.company}</p>
                    <p className="text-zinc-500 text-[9px] italic mb-2 font-bold uppercase tracking-widest">
                      {new Date(exp.start_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "Present"}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed max-w-md">{exp.description}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest mb-10 text-black dark:text-white">
              <GraduationCap className="text-red-600" size={20} /> Education
            </h4>
            <div className="space-y-10 border-l-2 border-zinc-100 dark:border-zinc-800 ml-2">
              <div className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626] group-hover:scale-125 transition-transform" />
                <h5 className="font-bold text-sm dark:text-white uppercase">S1 Teknik Informatika</h5>
                <p className="text-red-600 text-[10px] font-mono font-black mb-2 uppercase">Universitas Pasundan</p>
                <p className="text-zinc-500 text-[10px] italic font-bold tracking-widest uppercase">2024 - Sekarang</p>
              </div>
              <div className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-400 dark:bg-zinc-700 group-hover:bg-red-600 transition-colors" />
                <h5 className="font-bold text-sm dark:text-white uppercase">Teknik Komputer dan Jaringan</h5>
                <p className="text-red-600 text-[10px] font-mono font-black mb-2 uppercase">SMK Negeri 1 Cidaun</p>
                <p className="text-zinc-500 text-[10px] italic font-bold tracking-widest uppercase">2021 - 2024</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. SKILLS */}
        <div>
          <h4 className="text-center text-lg font-black uppercase tracking-widest mb-16 text-black dark:text-white">
            My <span className="text-red-600">Skills.</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <SkillCard title="Frontend & UI/UX" icon={<Layout size={18} />} skills={frontendSkills} delay={0.1} />
            <SkillCard title="Backend & Database" icon={<Database size={18} />} skills={backendSkills} delay={0.2} />
            <SkillCard title="Tools & Security" icon={<Lock size={18} />} skills={toolsSkills} delay={0.3} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ title, icon, skills, delay }: { title: string; icon: any; skills: string[]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm min-h-[250px]"
    >
      <div className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          {icon} {title}
        </div>
      </div>
      <div className="p-8 flex flex-wrap gap-3 justify-center">
        {skills.length > 0 ? (
          skills.map((skill: string) => (
            <div
              key={skill}
              className="text-[10px] font-mono font-black text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-black/40 text-center cursor-default transition-all hover:border-red-600 hover:text-red-600"
            >
              {skill}
            </div>
          ))
        ) : (
          <p className="text-[10px] text-zinc-500 italic uppercase">Initializing_Data...</p>
        )}
      </div>
    </motion.div>
  );
}
