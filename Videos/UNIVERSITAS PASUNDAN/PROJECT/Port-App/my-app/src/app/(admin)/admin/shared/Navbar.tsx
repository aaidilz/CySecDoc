"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, BookOpen, User, Cpu, Mail, Menu, X, Shield, ExternalLink, LogOut, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentMenu = searchParams.get("menu") || "home";

  const menus = [
    { name: "Home", id: "home", href: "/admin?menu=home", icon: <LayoutDashboard size={18} /> },
    { name: "Project", id: "project", href: "/admin?menu=project", icon: <FolderKanban size={18} /> },
    { name: "Blog", id: "blog", href: "/admin?menu=blog", icon: <BookOpen size={18} /> },
    { name: "Experience", id: "experience", href: "/admin?menu=experience", icon: <User size={18} /> },
    { name: "Skills", id: "skills", href: "/admin?menu=skills", icon: <Cpu size={18} /> },
    { name: "Inbox", id: "contact", href: "/admin?menu=contact", icon: <Mail size={18} /> },
  ];

  const executeLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout Error");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-zinc-950 border-b border-zinc-900 p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <Shield className="text-red-600" size={20} />
          {/* LOGO TEGAK NORMAL */}
          <span className="text-white font-black tracking-tighter text-sm">
            SysExp<span className="text-red-600 font-bold">Own</span>
          </span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-zinc-900 rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* AREA LOGO SIDEBAR */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Shield className="text-white" size={24} />
            </div>
            <span className="text-white font-black text-xl tracking-tighter">
              SysExp<span className="text-red-600 font-bold">Own</span>
            </span>
          </div>

          {/* NAV: MT-16 BIAR GAK NABRAK LOGO DI MOBILE */}
          <nav className="flex-1 space-y-2 pt-10 lg:pt-0">
            {menus.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all
                  ${currentMenu === item.id ? "bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}
                `}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>

          {/* FOOTER NAV: LOGOUT & PORTFOLIO */}
          <div className="mt-10 pt-6 space-y-2 border-t border-zinc-900">
            <Link href="/" target="_blank" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[11px] text-zinc-500 hover:text-white hover:bg-zinc-900 uppercase tracking-widest transition-all">
              <ExternalLink size={18} /> Lihat Portofolio
            </Link>
            <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[11px] text-red-600 hover:bg-red-600/10 uppercase tracking-widest transition-all">
              <LogOut size={18} /> Logout_System
            </button>
          </div>
        </div>
      </aside>

      {/* POPUP LOGOUT CENTERED */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isLoggingOut && setShowLogoutConfirm(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm p-12 rounded-[3.5rem] border border-red-600/20 bg-zinc-950 text-center shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 bg-red-600/10 text-red-600">
                <HelpCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Akhiri_Sesi?</h3>
              <p className="text-zinc-600 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest">Akses administratif akan ditutup dan Anda harus login kembali.</p>

              <div className="grid grid-cols-2 gap-4">
                <button disabled={isLoggingOut} onClick={() => setShowLogoutConfirm(false)} className="py-5 bg-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-600 hover:bg-zinc-800 transition-all">
                  Batal
                </button>
                <button
                  disabled={isLoggingOut}
                  onClick={executeLogout}
                  className="py-5 bg-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-red-500 transition-all flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : "Keluar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY */}
      {isOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
