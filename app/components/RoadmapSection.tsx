"use client";

import { motion } from "framer-motion";
import { Check, CircleDot, Circle } from "lucide-react";

const ROADMAP_STEPS = [
  { id: 1, title: "企画・脚本", status: "completed", note: "決定稿完成" },
  { id: 2, title: "プリプロダクション", status: "current", note: "● NOW 進行中" },
  { id: 3, title: "本撮影", status: "upcoming", note: "準備中" },
  { id: 4, title: "編集", status: "upcoming", note: "オフライン編集" },
  { id: 5, title: "MA・カラーグレーディング", status: "upcoming", note: "音響・色彩設計" },
  { id: 6, title: "字幕・DCP制作", status: "upcoming", note: "英語字幕・劇場フォーマット" },
  { id: 7, title: "完成", status: "target", note: "作品完成" },
  { id: 8, title: "映画祭出品", status: "target", note: "国内外フィルムフェスティバル" },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-background py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            Road To Completion
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            映画完成までの現在地
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-widest max-w-xl mx-auto pt-1">
            一つひとつの工程を丁寧に積み重ね、完成と映画祭出品を目指します。
          </p>
        </div>

        {/* Vertical / Horizontal Roadmap Progress */}
        <div className="relative border-l-2 border-white/10 md:border-l-0 md:border-t-2 md:border-white/10 ml-4 md:ml-0 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-2 pt-6 md:pt-8 pl-6 md:pl-0">
          {ROADMAP_STEPS.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative flex md:flex-col items-start md:items-center text-left md:text-center space-x-4 md:space-x-0 space-y-0 md:space-y-3 group"
              >
                {/* Node Icon on Line */}
                <div className="absolute -left-[31px] md:left-1/2 md:-top-[41px] md:-translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-950 border border-white/20 z-10">
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-accent font-bold" />
                  ) : isCurrent ? (
                    <CircleDot className="w-4 h-4 text-accent animate-pulse" />
                  ) : (
                    <Circle className="w-3 h-3 text-zinc-600" />
                  )}
                </div>

                {/* Step Text Content */}
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono tracking-widest block uppercase ${isCurrent ? "text-accent font-bold" : "text-foreground/40"}`}>
                    STEP {step.id < 10 ? `0${step.id}` : step.id}
                  </span>
                  <h3 className={`text-xs md:text-sm font-bold font-serif tracking-wider ${isCurrent ? "text-accent text-sm md:text-base font-bold" : isCompleted ? "text-foreground" : "text-foreground/60"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-[10px] font-serif tracking-widest ${isCurrent ? "text-accent/90 font-bold" : "text-foreground/40"}`}>
                    {step.note}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
