"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Import Swiper components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-24 bg-black overflow-hidden selection:bg-red-600/30">
      {/* Custom Style untuk Bullet Pagination */}
      <style>{`
        .swiper-pagination-bullet { background: #3f3f46; opacity: 1; }
        .swiper-pagination-bullet-active { background: #dc2626 !important; width: 28px; border-radius: 4px; transition: all 0.3s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER SECTION (SEO & COPYWRITING OPTIMIZED) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              ARTIKEL <span className="text-red-600">TERBARU.</span>
            </motion.h2>

            <p className="text-zinc-500 text-sm md:text-base mt-4 leading-relaxed italic">
              Eksplorasi mendalam seputar <span className="text-zinc-300 font-bold">Fullstack Development</span>, strategi <span className="text-zinc-300 font-bold">Cyber Security</span>, dan tren teknologi masa kini untuk solusi digital
              yang inovatif.
            </p>
            <p className="text-zinc-700 text-[10px] font-mono mt-2 uppercase tracking-[0.3em] font-bold">{`> INSIGHTS_&_TECHNOLOGIES_LOG`}</p>
          </div>

          {/* Navigasi ke Halaman Blog Archive (BlogDash) */}
          <Link href="/blog" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border-b border-transparent hover:border-red-600 pb-1">
            LIHAT SEMUA ARTIKEL <ArrowRight size={14} className="text-red-600 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
            <p className="text-zinc-800 font-mono text-[10px] uppercase tracking-widest font-black italic">Sinkronisasi_Data...</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 2 }, // Tampilan 2 kolom di Desktop
            }}
            className="!pb-20"
          >
            {blogs.map((post: any, i: number) => (
              <SwiperSlide key={post.id || i}>
                <motion.article initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    title={`Baca selengkapnya: ${post.title}`}
                    className="group relative flex gap-6 bg-zinc-900/10 border border-zinc-900 p-6 rounded-[2.5rem] transition-all duration-500 hover:border-red-600/40 hover:bg-zinc-900/20 hover:shadow-[0_20px_40px_rgba(220,38,38,0.05)] block h-full"
                  >
                    {/* THUMBNAIL AREA */}
                    <div className="w-28 h-28 md:w-44 md:h-44 bg-black rounded-3xl overflow-hidden border border-zinc-800 shrink-0 relative transition-transform duration-500 group-hover:scale-[0.98]">
                      <img src={post.image_url || "/no-img.png"} alt={`Gambar artikel ${post.title}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out" />
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">{post.category || "TEKNOLOGI"}</span>
                          <div className="p-2 bg-zinc-950 rounded-full border border-zinc-800 group-hover:border-red-600/50 transition-colors">
                            <ArrowUpRight className="text-zinc-600 group-hover:text-red-600 transition-all" size={16} />
                          </div>
                        </div>
                        <h4 className="text-base md:text-xl font-black text-white mb-2 line-clamp-2 uppercase tracking-tight group-hover:text-red-600 transition-colors leading-tight">{post.title}</h4>
                        <p className="text-zinc-500 text-[10px] md:text-xs line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">
                          {post.excerpt || "Analisis mendalam mengenai implementasi teknologi terbaru dalam ekosistem digital modern."}
                        </p>
                      </div>

                      {/* METADATA */}
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-900 mt-4 group-hover:border-red-600/20 transition-colors">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-zinc-700" />
                          <time className="text-[8px] text-zinc-600 font-mono font-black uppercase tracking-widest">
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "31 JAN 2026"}
                          </time>
                        </div>
                        <span className="text-zinc-800 text-[8px]">|</span>
                        <span className="text-zinc-700 text-[8px] font-mono font-black uppercase">ID: {post.id?.substring(0, 8) || "SYSTEM_ERR"}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
