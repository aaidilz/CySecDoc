"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, BookOpen, Mail, Github, Instagram, Linkedin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "home", href: "#home", icon: <Home size={22} /> },
  { name: "about", href: "#about", icon: <User size={22} /> },
  { name: "project", href: "#project", icon: <Briefcase size={22} /> },
  { name: "blog", href: "/blog", icon: <BookOpen size={22} /> },
  { name: "contact", href: "#contact", icon: <Mail size={22} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => {
      const sections = ["home", "about", "project", "blog", "contact"];
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* --- DESKTOP NAVBAR (Top) --- */}
      {!isMobile && (
        <div className="fixed top-8 w-full z-50 px-6 md:px-12 flex justify-center">
          <nav className="relative w-full max-w-7xl h-16 bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-full px-10 flex items-center justify-between shadow-2xl transition-all duration-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-2 group shrink-0">
              <ShieldCheck className="text-red-600 group-hover:rotate-12 transition-transform" size={22} />
              <span className="text-base font-bold tracking-tight text-white">
                Sys<span className="text-red-600">Exp</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-4 text-[11px] font-bold tracking-[0.2em] uppercase">
              {navLinks.map((link) => {
                const isActive = activeSection === link.name || (pathname === link.href && link.name === "blog");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-5 py-2.5 rounded-full transition-all duration-500 ease-in-out ${isActive ? "text-white bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-5 border-l border-white/10 pl-8 shrink-0">
              <a href="https://github.com" target="_blank" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Github size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" className="text-zinc-400 hover:text-red-500 transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Linkedin size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* --- MOBILE NAVBAR (Bottom - Instagram Style) --- */}
      {isMobile && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99] w-[90%] max-w-[380px]">
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name || (pathname === link.href && link.name === "blog");
              return (
                <Link key={link.name} href={link.href} className="relative p-4">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavMobile"
                        className="absolute inset-0 bg-red-600/10 rounded-2xl border border-red-600/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className={`relative z-10 transition-all duration-500 ${isActive ? "text-red-600 scale-125" : "text-zinc-500"}`}>{link.icon}</div>

                  {isActive && <motion.div layoutId="dotMobile" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
