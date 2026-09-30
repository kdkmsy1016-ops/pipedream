"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const UPDATES = [
  {
    date: "2026.09.20",
    category: "LOCATION",
    title: "スナック「さくらみち」・呑処「こまち」実測・現場ロケハンの完了",
    content: "主舞台となる実在店舗スナック「さくらみち」および呑処「こまち」にて、照明セッティングおよびカメラレンズの畫角テストを完了しました。"
  },
  {
    date: "2026.08.15",
    category: "SCRIPT",
    title: "映画『盈虚とパイプドリーム』決定稿の最終推敲",
    content: "2021年の空気感と登場人物の対話をより繊細に描き出すため、決定稿のブラッシュアップを行いました。"
  },
  {
    date: "2026.07.01",
    category: "PRODUCTION",
    title: "映画化プロジェクトおよびプリプロダクションの本格始動",
    content: "自主制作長編映画『盈虚とパイプドリーム』の完成と映画祭出品に向け、各種準備を開始いたしました。"
  }
];

export default function ProductionUpdateSection() {
  return (
    <section id="news" className="bg-background py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            News / Production Update
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            制作ニュース
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-widest max-w-xl mx-auto pt-1">
            映画制作の最新情報と進捗をお届けします。
          </p>
        </div>

        {/* Update List */}
        <div className="space-y-4 font-serif">
          {UPDATES.map((item, idx) => (
            <motion.div
              key={item.date + item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-zinc-900/40 border border-white/5 p-6 rounded hover:border-white/10 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-mono text-accent/80 font-bold">{item.date}</span>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent">
                  {item.category}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-foreground/75 leading-relaxed tracking-wide">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
