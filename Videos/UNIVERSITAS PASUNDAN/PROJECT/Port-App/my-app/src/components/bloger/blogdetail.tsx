"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Calendar, ArrowLeft, BookOpen, Share2, Loader2, Sparkles, Clock, ChevronRight, ShieldCheck, Terminal } from "lucide-react";
import Link from "next/link";

export default function BlogDetailContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/blogs?slug=${slug}`);
        const data = await res.json();
        setPost(Array.isArray(data) ? data.find((p: any) => p.slug === slug) : data);
      } catch (err) {
        console.error("Gagal sinkronisasi", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  // FUNGSI SHARE ARTIKEL (Bukan fitur setengah-setengah!)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || "Cek artikel menarik ini!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share dibatalkan atau error", err);
      }
    } else {
      // Fallback copy link jika browser tidak support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-60 gap-4">
        <Loader2 className="animate-spin text-red-600" size={32} />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-zinc-800">Booting_Content...</span>
      </div>
    );

  if (!post)
    return (
      <div className="flex flex-col items-center justify-center py-60">
        <h1 className="text-white font-black text-4xl uppercase tracking-tighter italic mb-6 text-red-600">ERROR_404_NULL</h1>
        <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest border-b border-white pb-1">
          Return to Archive
        </Link>
      </div>
    );

  return (
    <div className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[110]" style={{ scaleX }} />

      <article className="max-w-6xl mx-auto px-6 pt-4 pb-32">
        {/* NAV SEJAJAR */}
        <nav className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-6">
          <Link href="/blog" className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-[9px] font-black text-zinc-800 uppercase tracking-widest">
            <span>Root</span> <ChevronRight size={10} /> <span>Archive</span> <ChevronRight size={10} /> <span className="text-red-600 italic">{post.slug}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 items-start">
          {/* MAIN CONTENT AREA */}
          <div>
            <header className="mb-12">
              <div className="flex items-center gap-3 text-red-600 mb-6">
                <Terminal size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{post.category || "TECH_DOCS"}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-8">{post.title}</h1>
              <p className="text-zinc-500 text-lg italic leading-relaxed max-w-2xl opacity-80">{post.excerpt || "Analisis teknis mendalam mengenai arsitektur sistem dan keamanan digital."}</p>
            </header>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-900 mb-12 group">
              <img src={post.image_url || "/no-img.png"} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <section className="prose prose-invert prose-red max-w-none">
              <div className="text-zinc-300 leading-[1.8] text-lg space-y-8 font-medium article-body text-justify" dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>
          </div>

          {/* SIDEBAR INFO */}
          <aside className="sticky top-24 space-y-10 border-l border-zinc-900 pl-10 hidden lg:block">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest italic">Published_By</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs italic shadow-lg shadow-red-600/20">S</div>
                  <span className="text-white text-xs font-black tracking-widest">SysExp</span> {/* Nama diganti */}
                </div>
              </div>

              <div className="space-y-2 text-zinc-500">
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest italic">Metadata</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                    <Calendar size={14} className="text-red-600" /> {new Date(post.created_at).toLocaleDateString("id-ID")}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                    <Clock size={14} className="text-red-600" /> 5 Min Read
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                    <ShieldCheck size={14} className="text-red-600" /> Verified Content
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-zinc-900">
              <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest italic mb-6">Interaction</p>
              {/* TOMBOL SHARE BERFUNGSI */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-red-600 transition-all shadow-md group"
              >
                Share_Article <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            {/* Bagian riset dikembangkan bla bla sudah dihapus sesuai instruksi */}
          </aside>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-zinc-900">
        <div className="flex justify-between items-center text-zinc-800 text-[8px] font-mono font-black uppercase tracking-[0.4em]">
          <span>© 2026 // SYSEXP_INTERNAL_DOCS</span>
          <span>Security_Grade: A+</span>
        </div>
      </footer>
    </div>
  );
}
