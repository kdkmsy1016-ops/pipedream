"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroRenewed() {
  return (
    <section id="hero" className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden pt-12 md:pt-0">
      
      {/* Background Image Container */}
      <div className="relative w-full h-auto pointer-events-none">
        {/* Desktop Image */}
        <div className="hidden md:block w-full h-auto aspect-[16/9] relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full flex"
          >
            <Image
              src="/hero-bg.png"
              alt="映画『盈虚とパイプドリーム』メインビジュアル"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              priority
              sizes="100vw"
            />
          </motion.div>
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden w-full h-auto aspect-[9/16] relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full flex"
          >
            <Image
              src="/hero-bg-mobile.png"
              alt="映画『盈虚とパイプドリーム』メインビジュアル"
              width={1080}
              height={1920}
              className="w-full h-auto object-contain"
              priority
              sizes="100vw"
            />
          </motion.div>
        </div>

        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      </div>

      {/* Hero Text & CTA Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        className="relative md:absolute md:bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6 text-center space-y-6 md:space-y-8 py-8 md:py-0"
      >
        <div className="space-y-3">
          <p className="text-xs md:text-sm tracking-[0.25em] text-accent/90 font-serif uppercase">
            Feature Film Project
          </p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-[0.2em] font-serif text-foreground drop-shadow-md">
            映画『盈虚とパイプドリーム』
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-lg md:text-2xl font-serif text-foreground/90 tracking-widest leading-relaxed">
            「一本の映画を、完成させるために。」
          </p>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-widest">
            現在、映画完成と映画祭への出品を目指して制作中。
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#about"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-foreground border border-white/10 hover:border-white/20 transition-all duration-300 text-xs md:text-sm font-serif tracking-[0.2em] rounded-sm text-center"
          >
            作品について
          </a>
          <a
            href="#support"
            className="w-full sm:w-auto px-8 py-3.5 bg-accent/90 hover:bg-accent text-zinc-950 font-bold transition-all duration-300 text-xs md:text-sm font-serif tracking-[0.2em] rounded-sm text-center shadow-[0_0_20px_rgba(255,191,0,0.15)] hover:shadow-[0_0_25px_rgba(255,191,0,0.3)]"
          >
            制作を支援する
          </a>
        </div>
      </motion.div>

    </section>
  );
}
