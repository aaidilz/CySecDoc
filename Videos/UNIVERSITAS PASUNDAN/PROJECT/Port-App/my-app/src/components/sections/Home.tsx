"use client";
import { motion } from "framer-motion";
import { 
  Github, Linkedin, Instagram, Mail, 
  Terminal, FileText, Database, ShieldCheck, Code2, Cpu 
} from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-white dark:bg-black">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 dark:bg-red-900/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 lg:-mt-24" 
        >
          <div className="flex items-center gap-3 text-red-600 mb-6 font-mono text-xs tracking-[0.3em] font-black">
            <Terminal size={18} />
            <span>{`SYSTEM ACTIVE`}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-black dark:text-white">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="block"
            >
              FULLSTACK
            </motion.span>
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              className="text-red-600 inline-block overflow-hidden whitespace-nowrap border-r-4 border-red-600"
            >
              ENGINEER.
            </motion.span>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-lg mb-10 leading-relaxed italic border-l-2 border-red-600/30 pl-4">
            "Bridging the gap between complex backend logic and seamless user experience. Crafting secure, high-performance digital solutions with a hacker's precision."
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <motion.a 
              href="/cv-alam.pdf" 
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 font-black text-[10px] tracking-[0.3em] flex items-center gap-3 transition-all shadow-[0_10px_25px_rgba(220,38,38,0.4)]"
            >
              DOWNLOAD CV <FileText size={16} />
            </motion.a>

            <div className="flex items-center gap-6 text-zinc-400 dark:text-zinc-500">
              <a href="#" className="hover:text-red-600 transition-all hover:-translate-y-1"><Instagram size={22} /></a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-all hover:-translate-y-1"><Github size={22} /></a>
              <a href="#" className="hover:text-red-600 transition-all hover:-translate-y-1"><Linkedin size={22} /></a>
              <a href="#" className="hover:text-red-600 transition-all hover:-translate-y-1"><Mail size={22} /></a>
            </div>
          </div>
        </motion.div>

        <div className="relative flex justify-center lg:justify-end items-end h-[500px] md:h-[700px]">
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full max-w-[480px] z-10 pt-40 md:pt-56"
          >
            <img 
              src="/me.png" 
              alt="Alam Profile" 
              className="w-full h-auto object-contain pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }}
            />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 left-0 md:-left-5 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl text-red-600 shadow-2xl z-20"
          >
            <ShieldCheck size={35} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-20 right-0 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl text-red-600 shadow-2xl z-20"
          >
            <Database size={30} />
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-60 right-5 p-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full text-zinc-400 shadow-2xl z-20"
          >
            <Code2 size={24} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}