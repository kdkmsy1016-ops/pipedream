"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";

export default function SpecialThanksSection() {
  return (
    <section id="special-thanks" className="bg-background py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            SPECIAL THANKS <span className="inline-block">/ END CREDITS</span>
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            ご支援いただいた皆さまへ
          </h2>
        </div>

        {/* Explanation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 font-serif"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-wide sm:tracking-widest text-auto-phrase">
              本編エンドクレジットへの「Special Thanks」掲載
            </h3>
          </div>

          <div className="space-y-3.5 sm:space-y-4 text-foreground/85 leading-relaxed md:leading-loose text-xs sm:text-sm tracking-normal sm:tracking-wide text-auto-phrase">
            <p>
              本支援には、物品や鑑賞券などのリターンは設けていません。
            </p>
            <p>
              ご支援いただいた方で掲載をご希望される方は、映画『盈虚とパイプドリーム』本編のエンドクレジットに「Special Thanks」としてお名前を掲載します。
            </p>
            <p>
              掲載をご希望の場合は、ご支援時のメッセージ欄に掲載名をご記入ください。
            </p>
            <p className="text-foreground/70">
              掲載を希望されない場合は、匿名でのご支援も可能です。
            </p>
          </div>

          <div className="p-3.5 sm:p-4 bg-black/40 rounded border border-white/5 flex items-start gap-2.5 sm:gap-3 text-xs text-foreground/70 tracking-normal sm:tracking-wider text-auto-phrase">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>
              ご支援いただいた金額にかかわらず、掲載をご希望のお名前はすべて同等に掲載します。
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
