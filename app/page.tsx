"use client";

import Hero from "./components/Hero";
import LineSection from "./components/LineSection";
import StageSection from "./components/StageSection";
import Introduction from "./components/Introduction";
import AboutFilm from "./components/AboutFilm";
import NoSSR from "./components/NoSSR";
import ContactSection from "./components/ContactSection";
import FloatingStageLink from "./components/FloatingStageLink";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <NoSSR>
        <Hero />
        <Introduction />
        <AboutFilm />
        <StageSection />
        <LineSection />
        <ContactSection />
        <FloatingStageLink />
      </NoSSR>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-foreground/30 font-serif border-t border-white/5">
        &copy; 2026 Eikyo to Pipe Dream Project
      </footer>
    </main>
  );
}
