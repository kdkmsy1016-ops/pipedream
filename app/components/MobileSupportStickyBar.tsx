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
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] pointer-events-auto"
        >
          <a
            href="#support"
            className="group min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 bg-black/85 backdrop-blur-md border border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-black font-serif font-bold text-xs sm:text-sm tracking-normal sm:tracking-wider md:tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(255,191,0,0.35)] hover:shadow-[0_0_30px_rgba(255,191,0,0.6)] transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#ffbf00] group-hover:fill-black group-hover:text-black transition-colors flex-shrink-0" />
            <span>制作を支援する</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
