"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function FloatingSupportButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button after scrolling past hero (~200px)
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-max pointer-events-auto"
        >
          <a
            href="#support"
            className="group flex items-center gap-2.5 px-6 py-3 md:px-8 md:py-3.5 bg-black/85 backdrop-blur-md border border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-black font-serif font-bold text-xs md:text-sm tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(255,191,0,0.35)] hover:shadow-[0_0_30px_rgba(255,191,0,0.6)] transition-all duration-300 active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 fill-[#ffbf00] group-hover:fill-black group-hover:text-black transition-colors" />
            <span>制作を支援する</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
