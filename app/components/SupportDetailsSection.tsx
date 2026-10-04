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

        {/* Consolidated Support Information Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-5 sm:p-7 md:p-8 space-y-6"
        >
          {/* A. 支援金の使い道 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-wide sm:tracking-widest">
                支援金の使い道と制作環境
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed text-auto-phrase">
              いただいた支援は、撮影、出演者・スタッフ、美術、音響、映画祭出品など、映画『盈虚とパイプドリーム』完成までの制作費として大切に活用します。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs text-foreground/85">
              {USAGE_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 sm:p-2.5 bg-black/40 rounded border border-white/5">
                  <Sparkles className="w-3 h-3 text-accent/70 flex-shrink-0" />
                  <span className="tracking-normal whitespace-nowrap text-auto-phrase">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] sm:text-xs text-foreground/55 leading-relaxed pt-1 text-auto-phrase">
              ※ 本作へのご支援は純粋な制作支援として承っており、リターンやエンドクレジット掲載等の特典は設けておりません。映画の趣旨にご賛同いただける方からの温かい後押しをお願いしております。
            </p>
          </div>

          {/* B. これまでのご支援 */}
          <div className="border-t border-white/10 pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-wide sm:tracking-wider">
                  これまでのご支援
                </h4>
                <p className="text-xs text-foreground/65 leading-relaxed text-auto-phrase">
                  2026年に実施したクラウドファンディングにて、多くの皆さまから温かいご支援をいただきました。深く感謝申し上げます。
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/guide"
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-colors text-xs tracking-wider rounded-sm active:scale-[0.98]"
                >
                  <FileText className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
                  <span>記録を見る</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
