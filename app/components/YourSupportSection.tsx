"use client";

import { motion } from "framer-motion";
import { Film, Sparkles } from "lucide-react";

const USAGE_ITEMS = [
  "撮影・照明・録音費",
  "出演者・スタッフ人件費",
  "美術・衣装・小道具費",
  "ロケーション・移動・車両費",
  "オフライン・オンライン編集費",
  "整音・MA音響制作費",
  "カラーグレーディング費",
  "英語字幕翻訳・制作費",
  "DCP（劇場用マスター）制作費",
  "国内外映画祭 出品・申請費"
];

export default function YourSupportSection() {
  return (
    <section id="your-support" className="bg-zinc-950 py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            YOUR SUPPORT <span className="inline-block">/ USAGE OF FUNDS</span>
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            ご支援の使い道
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-foreground/80 font-serif tracking-normal sm:tracking-wide leading-relaxed max-w-2xl mx-auto pt-1 sm:pt-2 text-balanced text-auto-phrase">
            いただいたご支援は、映画『盈虚とパイプドリーム』を完成させ、<br className="hidden md:block" />
            映画祭へ出品するまでの制作費として大切に使用させていただきます。
          </p>
        </div>

        {/* Usage Grid List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-bold font-serif text-foreground tracking-wide sm:tracking-widest">
              主な活用項目
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 font-serif text-xs md:text-sm text-foreground/85">
            {USAGE_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-black/40 rounded border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
                <span className="tracking-normal sm:tracking-wider text-auto-phrase">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] sm:text-xs text-foreground/50 font-serif tracking-normal sm:tracking-widest text-center pt-2 text-auto-phrase">
            ※支援金はすべて、映画の品質向上および作品を世界に届けるための諸費用に直接宛てられます。
          </p>
        </motion.div>

      </div>
    </section>
  );
}
