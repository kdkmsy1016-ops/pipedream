"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FinalCTASection() {
  return (
    <section id="final-cta" className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 bg-black border-t border-white/5 overflow-hidden flex flex-col items-center">
      
      {/* Background Image with Quiet Dark Vignette */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Image
          src="/about_bg.jpg"
          alt="映画『盈虚とパイプドリーム』"
          fill
          sizes="100vw"
          className="object-cover object-center filter grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto text-center space-y-10 sm:space-y-12 font-serif">

        {/* Narrative Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          <h2 className="text-[clamp(1.35rem,5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.2em] text-foreground leading-snug text-balanced">
            この映画が完成するまで。
          </h2>

          <div className="space-y-3.5 sm:space-y-4 text-foreground/80 leading-relaxed text-xs sm:text-sm md:text-base tracking-normal sm:tracking-wide text-justify sm:text-center max-w-xl mx-auto text-auto-phrase">
            <p>
              『盈虚とパイプドリーム』は、現在も制作を続けています。
            </p>
            <p>
              撮影、編集、音響、そして映画祭への出品まで。<br className="hidden sm:block" />
              一本の映画が完成していく過程を、このサイトで随時お伝えしていきます。
            </p>
            <p className="text-foreground/90 font-medium">
              完成まで、見守っていただければ幸いです。
            </p>
            <p className="text-xs sm:text-sm text-foreground/60 pt-1 sm:pt-2">
              そして、もしこの映画に何かを感じていただけたなら、<br className="hidden sm:block" />
              制作を支えるという形で参加していただくこともできます。
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons: Primary is "制作の近況を見る", Secondary is "この映画を支援する" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm sm:max-w-none mx-auto"
        >
          <a
            href="#now-making"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 sm:px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-foreground transition-all duration-200 rounded-sm text-xs sm:text-sm tracking-normal sm:tracking-wider md:tracking-[0.2em] text-center border border-white/10 font-bold active:scale-[0.98]"
          >
            制作の近況を見る
          </a>

          <a
            href="#support"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 sm:px-8 py-3.5 bg-[#ffbf00] hover:bg-white text-zinc-950 font-bold transition-all duration-300 rounded-sm text-xs sm:text-sm tracking-normal sm:tracking-wider md:tracking-[0.2em] text-center shadow-[0_0_20px_rgba(255,191,0,0.25)] hover:shadow-[0_0_25px_rgba(255,191,0,0.4)] active:scale-[0.98]"
          >
            この映画を支援する
          </a>
        </motion.div>

      </div>
    </section>
  );
}
