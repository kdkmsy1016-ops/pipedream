"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Film, FileText, Sparkles } from "lucide-react";

const USAGE_ITEMS = [
  "撮影・照明・録音",
  "出演者・スタッフ",
  "美術・衣装・小道具",
  "ロケーション・移動",
  "編集・整音・MA",
  "カラーグレーディング",
  "字幕・DCP",
  "映画祭出品"
];

export default function SupportDetailsSection() {
  return (
    <section id="support-details" className="bg-zinc-950 py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden font-serif">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-2.5 sm:space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 uppercase break-normal">
            SUPPORT DETAILS
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground text-balanced">
            ご支援について
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-auto-phrase">
            制作支援に関する使い道と、これまでの記録をまとめています。
          </p>
        </div>

        {/* Block A: ご支援の使い道 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-5 sm:p-7 md:p-8 space-y-5"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-wide sm:tracking-widest">
              A. ご支援の使い道
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed text-auto-phrase">
            いただいたご支援は、映画『盈虚とパイプドリーム』を完成させ、映画祭へ出品するまでの制作費として活用します。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs text-foreground/85">
            {USAGE_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2 p-2.5 bg-black/40 rounded border border-white/5">
                <Sparkles className="w-3 h-3 text-accent/70 flex-shrink-0" />
                <span className="tracking-normal whitespace-nowrap text-auto-phrase">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Block B: これまでのご支援 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 border border-white/5 rounded-lg p-5 sm:p-7 space-y-4 text-center max-w-2xl mx-auto"
        >
          <h3 className="text-sm sm:text-base font-bold text-foreground tracking-wide sm:tracking-widest">
            B. これまでのご支援
          </h3>
          <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed text-auto-phrase">
            本作では2026年にクラウドファンディングを実施し、多くの皆さまからご支援をいただきました。<br className="hidden sm:block" />
            ご支援いただいた皆さまに、改めて御礼申し上げます。
          </p>
          <div className="pt-1">
            <Link
              href="/guide"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-colors text-xs tracking-wider rounded-sm active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
              <span>クラウドファンディングの記録を見る</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
