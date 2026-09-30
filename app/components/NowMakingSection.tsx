"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FileText, MapPin, Palette, Users, Camera, Mic, Film, Sparkles } from "lucide-react";

const CURRENT_PRODUCTION_PHASES = [
  {
    category: "SCRIPT & REWRITE",
    label: "脚本・改稿",
    status: "決定稿・カット割り進行中",
    image: "/gallery/gallery-2.png",
    detail: "スナック「さくらみち」で交わされる登場人物たちの繊細な会話劇と、カットごとの画角・ショットリストを緻密に策定しています。"
  },
  {
    category: "LOCATION & ART",
    label: "ロケーション・美術準備",
    status: "実在店舗の採寸・照明テスト完了",
    image: "/gallery/gallery-3.png",
    detail: "物語の主舞台となる実在店舗スナック「さくらみち」および呑処「こまち」にて、2021年の空気感を再現する小道具の選定や、狭小空間を活かしたキャメラワークの検証を進めています。"
  },
  {
    category: "CASTING & REHEARSAL",
    label: "キャスティング・本読み",
    status: "主要キャスト陣の編成・調整",
    image: "/gallery/gallery-4.png",
    detail: "俳優志望の桃華、監督志望の修平、そしてスナックのマスターなど、現場で生きるキャラクターの生々しさを引き出すための本読みを準備中。"
  },
  {
    category: "CAMERA & SOUND",
    label: "撮影機材・録音プラン",
    status: "テスト撮影・同音設計",
    image: "/gallery/gallery-5.png",
    detail: "静謐かつ重層的なトーンを生み出すレンズ・ライティングの選定と、店内のリアルな環境音とセリフを捉え切る同音録音設計を進行中。"
  }
];

const WORKFLOW_STEPS = [
  { name: "脚本・改稿", done: true },
  { name: "ロケハン・実測", done: true },
  { name: "キャスティング", current: true },
  { name: "美術・小道具・衣装", current: true },
  { name: "撮影準備・テスト", current: true },
  { name: "本撮影", future: true },
  { name: "編集・編集推敲", future: true },
  { name: "カラーグレーディング", future: true },
  { name: "整音・MA音響", future: true },
  { name: "英語字幕・DCP", future: true },
  { name: "完成・映画祭出品", future: true }
];

export default function NowMakingSection() {
  return (
    <section id="now-making" className="bg-zinc-950 py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-5xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            NOW MAKING <span className="inline-block">/ PRODUCTION STATUS</span>
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            「映画は、いまここにいます。」
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-2xl mx-auto pt-1 leading-relaxed text-balanced text-auto-phrase">
            クランクインに向け、準備の一つひとつを現場と積み重ねています。<br className="hidden sm:block" />
            今まさに一本の映画が生まれる瞬間を、ここからお伝えします。
          </p>
        </div>

        {/* Stage Status Overview Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-accent uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                Current Production Phase
              </span>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold font-serif text-foreground tracking-wide sm:tracking-widest text-auto-phrase">
                PRE-PRODUCTION<span className="text-xs sm:text-sm md:text-base font-normal block sm:inline sm:ml-2 text-foreground/80">（撮影準備・プリプロダクション）</span>
              </h3>
            </div>
            <div className="text-xs font-serif text-foreground/60 tracking-normal sm:tracking-wider text-auto-phrase">
              東京都稲城市 スナック「さくらみち」 / 呑処「こまち」実測中
            </div>
          </div>

          {/* Workflow Badges */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="text-[10px] text-foreground/50 tracking-wider sm:tracking-widest uppercase font-serif block">
              全体の工程の流れ
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {WORKFLOW_STEPS.map((step) => (
                <span
                  key={step.name}
                  className={`text-[11px] sm:text-xs font-serif px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm border tracking-normal sm:tracking-wider transition-colors whitespace-nowrap ${
                    step.current
                      ? "bg-accent/15 border-accent text-accent font-bold"
                      : step.done
                      ? "bg-zinc-900 border-white/10 text-foreground/80"
                      : "bg-black/30 border-white/5 text-foreground/40"
                  }`}
                >
                  {step.done ? "✓ " : step.current ? "● " : "○ "}
                  {step.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Photobook / Production Log Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 pt-2 sm:pt-4">
          {CURRENT_PRODUCTION_PHASES.map((item, idx) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-zinc-900/40 border border-white/5 rounded-lg overflow-hidden flex flex-col hover:border-white/15 transition-all duration-300"
            >
              {/* Photo representation */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-normal sm:tracking-widest text-accent uppercase bg-black/80 px-2 py-0.5 rounded border border-white/10 truncate">
                    {item.category}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-serif text-white/90 bg-black/75 px-2 sm:px-2.5 py-0.5 rounded backdrop-blur-sm border border-white/10 truncate">
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Text info */}
              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base md:text-lg font-bold font-serif text-foreground tracking-wide sm:tracking-widest mb-1.5 sm:mb-2 text-auto-phrase">
                    {item.label}
                  </h4>
                  <p className="text-xs md:text-sm font-serif text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
                    {item.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition to next update */}
        <div className="text-center pt-2">
          <a
            href="#news"
            className="inline-flex items-center gap-2 text-xs text-foreground/60 hover:text-accent transition-colors font-serif tracking-widest underline underline-offset-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>最近の制作ニュースを見る</span>
          </a>
        </div>

      </div>
    </section>
  );
}
