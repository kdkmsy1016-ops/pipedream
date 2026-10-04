"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import Image from "next/image";
import { TRAILER_CONFIG } from "../config/trailerConfig";

const SESSION_STORAGE_KEY = "has_seen_trailer_modal_session";

interface TrailerModalProps {
  delayMs?: number;
}

export default function TrailerModal({ delayMs = 800 }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Auto-display check on initial mount
  useEffect(() => {
    // Check if already viewed in this session
    try {
      const alreadySeen = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (alreadySeen) {
        return;
      }
    } catch {
      // Ignore sessionStorage access errors (e.g. strict private mode)
    }

    // Delay auto-appearance slightly after page/hero renders (default 800ms)
    const timer = setTimeout(() => {
      // Save active element to restore focus after closing
      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        previouslyFocusedElementRef.current = document.activeElement;
      }
      setIsOpen(true);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      } catch {
        // Ignore storage errors
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  // Handle closing modal
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Explicitly reset isPlaying to stop audio immediately and unmount iframe
    setIsPlaying(false);

    // Restore focus to previously focused element
    if (previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus();
    }
  }, []);

  // Handle keyboard events (Esc to close, Focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }

      // Simple focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent background body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleStartPlay = () => {
    setIsPlaying(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="trailer-modal-root"
          key="trailer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none"
        >
          {/* Dark Backdrop Overlay */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Dialog Content */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trailer-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-sm shadow-2xl overflow-hidden z-10 font-serif flex flex-col"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/5 bg-zinc-900/40">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs tracking-[0.2em] text-accent uppercase font-sans">
                  TRAILER
                </span>
                <span className="text-white/20">|</span>
                <h2
                  id="trailer-modal-title"
                  className="text-xs sm:text-sm text-foreground/90 tracking-wider truncate"
                >
                  {TRAILER_CONFIG.title}
                </h2>
              </div>

              {/* Close Button (Large touch target for mobile) */}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 -mr-1 text-foreground/60 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                aria-label="予告編モーダルを閉じる"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Video Player Area (16:9 aspect ratio) */}
            <div className="relative w-full aspect-video bg-black overflow-hidden group">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${TRAILER_CONFIG.videoId}?autoplay=1&rel=0&playsinline=1`}
                  title={TRAILER_CONFIG.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={handleStartPlay}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStartPlay();
                    }
                  }}
                  className="relative w-full h-full cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                  aria-label="予告編動画を再生する"
                >
                  {/* Custom Thumbnail */}
                  <Image
                    src={TRAILER_CONFIG.thumbnailUrl}
                    alt={TRAILER_CONFIG.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    priority={false}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 group-hover:opacity-60 transition-opacity" />

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/50 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:text-accent group-hover:bg-black/80 shadow-2xl">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Bottom discreet guidance */}
                  <div className="absolute bottom-3 inset-x-4 flex justify-between items-center text-[11px] text-foreground/70 pointer-events-none">
                    <span>タップして再生</span>
                    <span className="text-[10px] tracking-widest text-foreground/40 font-sans">
                      16:9 HD
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="px-4 py-2.5 sm:px-6 bg-zinc-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-foreground/50">
              <span>※ 動画を再生すると音声が出ます</span>
              <button
                type="button"
                onClick={handleClose}
                className="text-foreground/70 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
