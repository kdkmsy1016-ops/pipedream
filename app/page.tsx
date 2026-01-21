"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import LineSection from "./components/LineSection";
import StageSection from "./components/StageSection";
import Introduction from "./components/Introduction";
import NoSSR from "./components/NoSSR";
import SplashScreen from "./components/SplashScreen";

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
        <Introduction />
        <LineSection />
        <StageSection />
      </NoSSR>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-foreground/30 font-serif border-t border-white/5">
        &copy; 2026 Eikyo to Pipe Dream Project
      </footer>
    </main>
  );
}
