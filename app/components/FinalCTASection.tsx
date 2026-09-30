"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FinalCTASection() {
  return (
    <section id="final-cta" className="relative py-28 md:py-40 px-6 bg-black border-t border-white/5 overflow-hidden flex flex-col items-center">
      
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

      <div className="relative z-10 max-w-2xl w-full mx-auto text-center space-y-12 font-serif">

        {/* Narrative Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.2em] text-foreground leading-snug">
            この映画が完成するまで。
          </h2>

          <div className="space-y-4 text-foreground/80 leading-relaxed text-sm md:text-base tracking-wide text-justify md:text-center max-w-xl mx-auto">
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
            <p className="text-xs md:text-sm text-foreground/60 pt-2">
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <a
            href="#now-making"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-foreground transition-all duration-200 rounded-sm text-xs md:text-sm tracking-[0.2em] text-center border border-white/10 font-bold"
          >
            制作の近況を見る
          </a>

          <a
            href="#support"
            className="w-full sm:w-auto px-8 py-3.5 bg-black/60 hover:bg-zinc-900 text-foreground/75 hover:text-foreground transition-all duration-200 rounded-sm text-xs md:text-sm tracking-[0.2em] text-center border border-white/10"
          >
            この映画を支援する
          </a>
        </motion.div>

      </div>
    </section>
  );
}
