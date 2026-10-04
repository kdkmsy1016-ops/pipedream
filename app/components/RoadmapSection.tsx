"use client";

import { motion } from "framer-motion";

const TIMELINE_STEPS = [
  { name: "企画・脚本", status: "done", label: "完了" },
  { name: "プリプロダクション", status: "current", label: "NOW 進行中", detail: "ロケハン実測・本読み・美術小道具手配" },
  { name: "本撮影", status: "upcoming", label: "これから" },
  { name: "編集", status: "upcoming", label: "これから" },
  { name: "MA・カラーグレーディング", status: "upcoming", label: "これから" },
  { name: "字幕・DCP", status: "upcoming", label: "これから" },
  { name: "完成", status: "upcoming", label: "これから" },
  { name: "映画祭出品", status: "upcoming", label: "目標ゴール" },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-zinc-950 py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-2xl w-full mx-auto space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-2.5 sm:space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            Road To Completion
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            映画完成までの工程
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-lg mx-auto pt-1 leading-relaxed text-auto-phrase">
            完成までに必要な全工程のロードマップです。
          </p>
        </div>

        {/* Compact Vertical Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 border border-white/5 rounded-lg p-5 sm:p-7 md:p-8 font-serif"
        >
          <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-white/10">
            {TIMELINE_STEPS.map((step) => {
              const isDone = step.status === "done";
              const isCurrent = step.status === "current";

              return (
                <div key={step.name} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  {/* Timeline Node Icon */}
                  <span
                    className={`absolute -left-6 sm:-left-8 top-1 sm:top-1/2 sm:-translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                      isCurrent
                        ? "bg-accent text-zinc-950 font-bold shadow-[0_0_12px_rgba(255,191,0,0.6)]"
                        : isDone
                        ? "bg-zinc-800 text-white/80 border border-white/20"
                        : "bg-zinc-950 text-white/30 border border-white/10"
                    }`}
                  >
                    {isDone ? "✓" : isCurrent ? "●" : "○"}
                  </span>

                  {/* Step Title & Details */}
                  <div className="space-y-0.5">
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-wide ${
                        isCurrent ? "text-accent text-base sm:text-lg" : isDone ? "text-foreground/90" : "text-foreground/50"
                      }`}
                    >
                      {step.name}
                    </h3>
                    {step.detail && (
                      <p className="text-[11px] sm:text-xs text-foreground/70 tracking-normal sm:tracking-wider">
                        {step.detail}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-auto pt-0.5 sm:pt-0">
                    <span
                      className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-sm border whitespace-nowrap tracking-wider font-mono ${
                        isCurrent
                          ? "bg-accent/15 border-accent text-accent font-bold animate-pulse"
                          : isDone
                          ? "bg-zinc-900 border-white/10 text-foreground/60"
                          : "bg-black/30 border-white/5 text-foreground/35"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Clear notice */}
        <p className="text-center text-[10px] sm:text-[11px] text-foreground/40 font-serif tracking-normal sm:tracking-widest text-auto-phrase">
          ※当面は「作品の完成」および「国内外映画祭への出品」を目標としています。
        </p>

      </div>
    </section>
  );
}
