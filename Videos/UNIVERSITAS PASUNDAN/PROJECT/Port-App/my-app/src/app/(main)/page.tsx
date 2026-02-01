"use client";
import { useEffect } from "react";
import Home from "@/components/sections/Home";
import About from "@/components/sections/About";
import Project from "@/components/sections/Project";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import { motion, useScroll, useSpring } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LandingPage() {
  // TRACKER & DISCORD REPORTER
  useEffect(() => {
    const trackAndReport = async () => {
      const now = new Date();
      const visitData = {
        path: "/",
        time: now.toLocaleTimeString("id-ID"),
        date: now.toLocaleDateString("id-ID"),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      };

      try {
        // Simpan ke database Supabase
        await supabase.from("page_views").insert([
          {
            page_path: visitData.path,
            user_agent: visitData.userAgent,
          },
        ]);

        // Lapor ke Discord via API Route
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "VISIT_LOG", ...visitData }),
        });
      } catch (err) {
        console.error("Monitoring Failure:", err);
      }
    };

    trackAndReport();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[100]" style={{ scaleX }} />
      <div className="flex flex-col">
        <Home />
        <div className="space-y-32 pb-20">
          <About /> <Project /> <Blog /> <Contact />
        </div>
      </div>
    </div>
  );
}
