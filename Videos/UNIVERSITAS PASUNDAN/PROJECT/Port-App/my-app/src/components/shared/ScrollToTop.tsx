"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Cek posisi scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-[100] w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-white hover:text-red-600 transition-all duration-300 group active:scale-90"
          aria-label="Back to Top"
        >
          <ChevronUp className="group-hover:-translate-y-1 transition-transform" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}