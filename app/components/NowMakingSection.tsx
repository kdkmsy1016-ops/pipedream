"use client";

import { motion } from "framer-motion";
import { FileText, MapPin, Palette, Users, Camera, Mic } from "lucide-react";

const PRODUCTION_ITEMS = [
  {
    icon: FileText,
    category: "SCRIPT",
    label: "脚本・改稿",
    status: "決定稿の推敲・カット割り",
    detail: "物語の緻密な構成とダイアログの微調整、および各シーンのショットリスト作成を進行中。"
  },
  {
    icon: MapPin,
    category: "LOCATION",
    label: "ロケーション準備",
    status: "スナック「さくらみち」実測・ロケハン",
    detail: "映画の主舞台となる実在スナックでの画角検証・照明設置位置および音響環境の計測完了。"
  },
  {
    icon: Palette,
    category: "ART / PROPS",
    label: "美術・小道具",
    detail: "劇中で印象的に登場する小道具の手配および時代背景（2021年）の空気感を再現する美術設計。"
  },
  {
    icon: Users,
    category: "CASTING",
    label: "キャスティング",
    status: "主要キャスト最終調整",
    detail: "役柄のリアリティと熱量を引き出すキャスト陣の編成、および本読み・リハーサル日程の策定。"
  },
  {
    icon: Camera,
    category: "CAMERA / LIGHTING",
    label: "撮影・照明準備",
    status: "レンズ選定・テスト撮影",
    detail: "狭小なスナック空間での被写界深度とライティング検証。トーン＆マナーの構築。"
  },
  {
    icon: Mic,
    category: "SOUND",
    label: "録音準備",
    status: "同音録音プラン策定",
    detail: "劇中の生の空気感とセリフの明瞭さを両立させるマイクセッティングおよび防音・環境音対策。"
  }
];

export default function NowMakingSection() {
  return (
    <section id="now-making" className="bg-zinc-950 py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-5xl w-full mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            NOW MAKING / PRODUCTION STATUS
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            「映画は、いまここにいます。」
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-widest max-w-2xl mx-auto pt-2">
            一本の自主映画が完成へと向かう、現在の制作記録。
          </p>
        </div>

        {/* Current Production Phase Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 border border-accent/30 rounded-lg p-6 md:p-8 text-center space-y-3 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-accent text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Current Stage
          </div>
          <h3 className="text-xl md:text-3xl font-bold tracking-[0.2em] font-serif text-foreground">
            PRE-PRODUCTION <span className="text-accent text-sm md:text-base font-normal">● NOW</span>
          </h3>
          <p className="text-xs md:text-sm text-foreground/70 font-serif tracking-wider leading-relaxed max-w-xl mx-auto">
            現在、本撮影に向けたプリプロダクション（準備工程）を静かに、確実におこなっています。
          </p>
        </motion.div>

        {/* Production Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {PRODUCTION_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-zinc-900/40 border border-white/5 rounded p-6 space-y-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black border border-white/10 rounded text-accent/80">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-accent/60 uppercase block">
                        {item.category}
                      </span>
                      <h4 className="text-base font-bold font-serif text-foreground tracking-widest">
                        {item.label}
                      </h4>
                    </div>
                  </div>
                  {item.status && (
                    <span className="text-[11px] font-serif text-accent/90 bg-accent/5 px-2.5 py-1 rounded border border-accent/20">
                      {item.status}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm font-serif text-foreground/75 leading-relaxed tracking-wide">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
