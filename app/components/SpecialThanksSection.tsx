"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";

export default function SpecialThanksSection() {
  return (
    <section id="special-thanks" className="bg-background py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            Special Thanks / End Credits
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            ご支援いただいた皆さまへ
          </h2>
        </div>

        {/* Explanation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 md:p-10 space-y-8 font-serif"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="text-base md:text-lg font-bold text-foreground tracking-widest">
              本編エンドクレジットへの「Special Thanks」掲載
            </h3>
          </div>

          <div className="space-y-4 text-foreground/85 leading-loose text-xs md:text-sm tracking-wide">
            <p>
              本支援には、物品や劇場鑑賞券などのリターンは設けておりません。
            </p>
            <p>
              ご支援いただいた方で掲載をご希望される方は、完成する映画『盈虚とパイプドリーム』本編のエンドクレジットに「Special Thanks」としてお名前を刻ませていただきます。
            </p>
            <p className="text-foreground/70">
              ※ご支援時の決済フォームにて掲載ご希望のお名前をご入力いただけます。掲載を希望されない場合は、匿名でのご支援も可能です。
            </p>
          </div>

          <div className="p-4 bg-black/40 rounded border border-white/5 flex items-start gap-3 text-xs text-foreground/70 tracking-wider">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>
              支援金額（1,000円〜10,000円等）にかかわらず、掲載希望のお名前はすべて同等に感謝を込めてエンドクレジットへ掲載させていただきます。
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
