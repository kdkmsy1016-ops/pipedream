"use client";

import { motion } from "framer-motion";
import { Check, CircleDot, Circle } from "lucide-react";

interface MilestoneGroup {
  id: string;
  phaseNumber: string;
  englishTitle: string;
  japaneseTitle: string;
  status: "done" | "current" | "upcoming";
  statusText: string;
  items: string[];
  description: string;
}

const MILESTONES: MilestoneGroup[] = [
  {
    id: "pre-production",
    phaseNumber: "01",
    englishTitle: "PRE-PRODUCTION",
    japaneseTitle: "企画・プリプロダクション",
    status: "current",
    statusText: "進行中",
    items: ["企画立案", "脚本執筆・決定稿推敲", "キャスティング", "ロケーション選定・実測", "美術・衣装・小道具手配"],
    description: "撮影の土台となるすべての要素を整える工程。現在、スナック「さくらみち」や呑処「こまち」での実測検証と本読み準備が進行しています。"
  },
  {
    id: "shooting",
    phaseNumber: "02",
    englishTitle: "SHOOTING",
    japaneseTitle: "本撮影",
    status: "upcoming",
    statusText: "これから",
    items: ["クランクイン", "スナック実景・劇中劇撮影", "同録", "クランクアップ"],
    description: "実在店舗の空気感をフィルムに収める撮影工程。照明とレンズワークを綿密に設計して臨みます。"
  },
  {
    id: "post-production",
    phaseNumber: "03",
    englishTitle: "POST-PRODUCTION",
    japaneseTitle: "ポストプロダクション",
    status: "upcoming",
    statusText: "これから",
    items: ["編集（オフライン・オンライン）", "MA・カラーグレーディング", "劇伴・音響効果", "字幕・DCPマスタリング"],
    description: "撮影素材から一本の映画へと昇華させる仕上げの工程。劇場上映および海外出品を見据えたフォーマットを制作します。"
  },
  {
    id: "completion-festival",
    phaseNumber: "04",
    englishTitle: "COMPLETION & FESTIVAL",
    japaneseTitle: "完成・映画祭出品",
    status: "upcoming",
    statusText: "目標ゴール",
    items: ["初号試写・作品完成", "国内外映画祭 エントリー", "コンペティション出品"],
    description: "完成した映画を携え、国内外の映画祭へ出品。作品を一人でも多くの観客へ届ける第一歩を踏み出します。"
  }
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-zinc-950 py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            Road To Completion
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            映画完成までの工程
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 leading-relaxed text-balanced text-auto-phrase">
            現在地と、完成までに必要な工程の全体像です。<br className="hidden sm:block" />
            一つひとつの工程を静かに、確実に積み重ねていきます。
          </p>
        </div>

        {/* Quiet Chronological Roadmap Cards */}
        <div className="space-y-4 sm:space-y-6 font-serif">
          {MILESTONES.map((mile, idx) => {
            const isCurrent = mile.status === "current";
            const isDone = mile.status === "done";

            return (
              <motion.div
                key={mile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative rounded-lg p-4 sm:p-6 md:p-8 transition-all border ${
                  isCurrent
                    ? "bg-zinc-900/60 border-accent/40 shadow-[0_4px_20px_rgba(255,191,0,0.06)]"
                    : "bg-zinc-900/20 border-white/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/5 pb-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tracking-wider text-foreground/40">
                        PHASE {mile.phaseNumber}
                      </span>
                      <span className="text-[10px] font-mono tracking-wider text-accent/70 uppercase">
                        {mile.englishTitle}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-wide sm:tracking-widest text-auto-phrase">
                      {mile.japaneseTitle}
                    </h3>
                  </div>

                  <div className="self-start sm:self-auto">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-sm border inline-flex items-center gap-1.5 tracking-wider ${
                        isCurrent
                          ? "bg-accent/15 border-accent/50 text-accent font-bold"
                          : isDone
                          ? "bg-zinc-800 border-white/10 text-foreground/70"
                          : "bg-black/30 border-white/5 text-foreground/40"
                      }`}
                    >
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                      {mile.statusText}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide mb-4 text-auto-phrase">
                  {mile.description}
                </p>

                {/* Items tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {mile.items.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] px-2.5 py-1 rounded bg-black/40 border border-white/5 text-foreground/70 tracking-normal sm:tracking-wider whitespace-nowrap"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Clear notice */}
        <p className="text-center text-[10px] sm:text-[11px] text-foreground/40 font-serif tracking-normal sm:tracking-widest text-auto-phrase">
          ※具体的な上映スケジュールや劇場公開は確定しておらず、当面は「作品の完成」および「国内外映画祭への出品」を目標としています。
        </p>

      </div>
    </section>
  );
}
