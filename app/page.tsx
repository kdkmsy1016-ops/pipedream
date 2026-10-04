"use client";

import HeroRenewed from "./components/HeroRenewed";
import AboutFilmRenewed from "./components/AboutFilmRenewed";
import NowMakingSection from "./components/NowMakingSection";
import DirectorsMessageSection from "./components/DirectorsMessageSection";
import SupportSection from "./components/SupportSection";
import RoadmapSection from "./components/RoadmapSection";
import YourSupportSection from "./components/YourSupportSection";
import SpecialThanksSection from "./components/SpecialThanksSection";
import CastStaffRenewedSection from "./components/CastStaffRenewedSection";
import ProductionUpdateSection from "./components/ProductionUpdateSection";
import PastCrowdfundingSection from "./components/PastCrowdfundingSection";
import FinalCTASection from "./components/FinalCTASection";
import ContactSection from "./components/ContactSection";
import MobileSupportStickyBar from "./components/MobileSupportStickyBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* 01 / HERO */}
      <HeroRenewed />

      {/* 02 / ABOUT THE FILM */}
      <AboutFilmRenewed />

      {/* 03 / NOW MAKING */}
      <NowMakingSection />

      {/* 04 / DIRECTOR'S MESSAGE */}
      <DirectorsMessageSection />

      {/* 05 / SUPPORT */}
      <SupportSection />

      {/* 06 / ROAD TO COMPLETION */}
      <RoadmapSection />

      {/* 07 / YOUR SUPPORT */}
      <YourSupportSection />

      {/* 08 / SPECIAL THANKS */}
      <SpecialThanksSection />

      {/* 09 / CAST & STAFF */}
      <CastStaffRenewedSection />

      {/* 10 / NEWS / PRODUCTION UPDATE */}
      <ProductionUpdateSection />

      {/* 11 / CROWDFUNDING */}
      <PastCrowdfundingSection />

      {/* 12 / FINAL CTA */}
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
