"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function MobileSupportStickyBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past ~400px down
      if (window.scrollY > 400) {
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xs pointer-events-auto"
        >
          <a
            href="#support"
            className="flex items-center justify-center gap-2.5 py-3 px-5 bg-black/80 backdrop-blur-md border border-accent/40 text-foreground text-xs font-serif tracking-[0.2em] rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)] active:scale-[0.98] transition-transform"
          >
            <Heart className="w-3.5 h-3.5 fill-accent text-accent" />
            <span>制作を支援する</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
