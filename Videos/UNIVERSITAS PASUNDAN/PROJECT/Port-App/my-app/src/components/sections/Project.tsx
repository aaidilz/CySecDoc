"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, Loader2, ChevronLeft, ChevronRight, Calendar, Code2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Project {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  image_url?: string;
  tech_stack?: string;
  github_url?: string;
  demo_url?: string;
  created_at: string;
}

export default function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setHasMounted(true);
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!hasMounted) return null;

  return (
    <section id="project" className="relative py-28 bg-[#060606] overflow-hidden" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="block mb-3 text-[10px] font-bold uppercase tracking-[0.5em] text-red-600">Masterpiece_Archive</div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">
              PROJECT<span className="text-red-600">.</span>
            </h2>
            <p className="mt-4 text-sm font-medium text-zinc-500 max-w-md leading-relaxed">Eksplorasi solusi digital yang menggabungkan estetika visual dengan performa kode tingkat tinggi.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-12 h-12 rounded-full border border-white/20 bg-zinc-900 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-12 h-12 rounded-full border border-white/20 bg-zinc-900 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : (
          <div className="relative">
            <Swiper
              onSwiper={(sw) => (swiperRef.current = sw)}
              modules={[Navigation, Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              loop={projects.length > 3}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, el: ".custom-pills" }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-20"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id} className="h-auto">
                  <ProjectCard project={project} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-pills flex justify-center gap-2 mt-8"></div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-pills .swiper-pagination-bullet {
          background: #3f3f46;
          opacity: 1;
          width: 10px;
          height: 10px;
          transition: all 0.4s ease;
        }
        .custom-pills .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          width: 30px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const tags = project.tech_stack?.split(",").slice(0, 3) ?? [];
  const displayImg = project.image || project.image_url || "/project-placeholder.png";

  return (
    <article className="group bg-[#111111] border border-white/10 rounded-[2.5rem] overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-red-600/50 shadow-2xl">
      <div className="relative h-60 overflow-hidden">
        <img src={displayImg} alt={project.title} className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" />
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="px-3 py-1 bg-black rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Production Ready</span>
        </div>

        <h3 className="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-red-600 transition-colors">{project.title}</h3>

        <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-3">{project.description}</p>

        <div className="flex-1" />

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-zinc-500 font-bold text-[11px]">
              <Calendar size={14} />
              {new Date(project.created_at).getFullYear()}
            </div>

            {project.github_url && (
              <a href={project.github_url} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            )}
          </div>

          {/* FIX: TOMBOL WAJIB ADA. KALAU GAK ADA LINK, ARAHKAN KE ID PROJECT (STAY) */}
          <a
            href={project.demo_url || "#project"}
            target={project.demo_url ? "_blank" : "_self"}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#dc2626] hover:bg-white text-white hover:text-[#dc2626] rounded-xl transition-all duration-300 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 active:scale-95"
          >
            Lihat Project <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
