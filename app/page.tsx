"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";

import AboutFilm from "./components/AboutFilm";
import NoSSR from "./components/NoSSR";
import SplashScreen from "./components/SplashScreen";
import ContactSection from "./components/ContactSection";
import FloatingStageLink from "./components/FloatingStageLink";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <SplashScreen key="splash" onFinish={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <NoSSR>
        <Hero />
        <AboutFilm />
        <ContactSection />
        <FloatingStageLink />
      </NoSSR>

      <footer className="py-12 flex flex-col items-center gap-6 text-center text-xs text-foreground/30 font-serif border-t border-white/5">
        <a href="/stage" className="hover:text-white transition-colors tracking-widest uppercase">
          Past Performance
        </a>
        <span>&copy; 2026 Eikyo to Pipe Dream Project</span>
      </footer>
    </main>
  );
}
