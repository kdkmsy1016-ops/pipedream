"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Heart } from "lucide-react";
import { STRIPE_PAYMENT_LINKS, SUPPORT_NOTES } from "../config/supportConfig";

export default function FinalCTASection() {
  const fixedOptions = [
    { label: "¥1,000", url: STRIPE_PAYMENT_LINKS.yen1000 },
    { label: "¥3,000", url: STRIPE_PAYMENT_LINKS.yen3000 },
    { label: "¥5,000", url: STRIPE_PAYMENT_LINKS.yen5000 },
    { label: "¥10,000", url: STRIPE_PAYMENT_LINKS.yen10000 },
  ];

  return (
    <section id="final-cta" className="relative py-28 md:py-40 px-6 bg-black border-t border-white/5 overflow-hidden flex flex-col items-center">
      
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/about_bg.jpg"
          alt="映画『盈虚とパイプドリーム』背景"
          fill
          sizes="100vw"
          className="object-cover object-center filter grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center space-y-12 font-serif">

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-[0.2em] text-foreground leading-snug drop-shadow-md">
            「この映画がどこまで辿り着けるのか。」
          </h2>
          <p className="text-sm md:text-base text-foreground/80 tracking-widest leading-relaxed pt-2">
            完成までの歩みを、見守っていただけましたら幸いです。
          </p>
        </motion.div>

        {/* Support Buttons Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-black/70 border border-white/10 rounded-lg p-6 md:p-8 space-y-6 backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 text-accent text-xs tracking-widest uppercase">
            <Heart className="w-3.5 h-3.5 fill-accent" />
            <span>制作支援窓口</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fixedOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-4 px-3 bg-zinc-900/90 hover:bg-accent border border-white/10 hover:border-accent text-foreground hover:text-zinc-950 transition-all duration-300 rounded text-center shadow-md active:scale-[0.98]"
              >
                <span className="text-base md:text-lg font-bold tracking-wider group-hover:scale-105 transition-transform duration-300 block">
                  {opt.label}
                </span>
                <span className="text-[10px] opacity-75 tracking-widest block mt-0.5">
                  支援する
                </span>
              </a>
            ))}
          </div>

          <div>
            <a
              href={STRIPE_PAYMENT_LINKS.custom}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-4 px-6 bg-accent/90 hover:bg-white text-zinc-950 transition-all duration-300 rounded font-bold text-sm md:text-base tracking-[0.2em] shadow-[0_0_20px_rgba(255,191,0,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              金額を自由に決めて支援する
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-foreground/60 tracking-wider pt-2 border-t border-white/5">
            {SUPPORT_NOTES.map((note) => (
              <div key={note} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-accent flex-shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
