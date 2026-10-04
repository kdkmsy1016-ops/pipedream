"use client";

import HeroRenewed from "./components/HeroRenewed";
import TrailerSection from "./components/TrailerSection";
import AboutFilmRenewed from "./components/AboutFilmRenewed";
import NowMakingSection from "./components/NowMakingSection";
import DirectorsMessageSection from "./components/DirectorsMessageSection";
import SupportSection from "./components/SupportSection";
import RoadmapSection from "./components/RoadmapSection";
import ProductionUpdateSection from "./components/ProductionUpdateSection";
import CastStaffRenewedSection from "./components/CastStaffRenewedSection";
import SupportDetailsSection from "./components/SupportDetailsSection";
import FinalCTASection from "./components/FinalCTASection";
import ContactSection from "./components/ContactSection";
import MobileSupportStickyBar from "./components/MobileSupportStickyBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* 01 / HERO */}
      <HeroRenewed />

      {/* 02 / TRAILER */}
      <TrailerSection />

      {/* 03 / ABOUT THE FILM */}
      <AboutFilmRenewed />

      {/* 04 / NOW MAKING */}
      <NowMakingSection />

      {/* 05 / DIRECTOR'S MESSAGE */}
      <DirectorsMessageSection />

      {/* 06 / SUPPORT */}
      <SupportSection />

      {/* 07 / ROAD TO COMPLETION */}
      <RoadmapSection />

      {/* 08 / NEWS / PRODUCTION UPDATE */}
      <ProductionUpdateSection />

      {/* 09 / CAST & STAFF */}
      <CastStaffRenewedSection />

      {/* 10 / SUPPORT DETAILS (ご支援の使い道 / Special Thanks / これまでのご支援) */}
      <SupportDetailsSection />

      {/* 11 / FINAL CTA */}
      <FinalCTASection />

      {/* Contact Section */}
      <ContactSection />

      {/* Mobile Sticky Support UX */}
      <MobileSupportStickyBar />

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-foreground/40 font-serif border-t border-white/5 space-y-2">
        <p>&copy; 2026 映画『盈虚とパイプドリーム』製作プロジェクト</p>
      </footer>
    </main>
  );
}
