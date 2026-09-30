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
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950/85 backdrop-blur-md border border-white/15 text-foreground/75 hover:text-foreground text-[11px] font-serif tracking-[0.2em] rounded-full shadow-lg active:scale-[0.98] transition-transform"
          >
            <span>制作支援窓口</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
