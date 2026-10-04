"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const UPDATES = [
  {
    date: "2026.09.20",
    category: "LOCATION",
    title: "スナック「さくらみち」・呑処「こまち」実測・現場ロケハンの完了",
    image: "/gallery/gallery-3.png",
    content: "主舞台となる実在店舗スナック「さくらみち」および呑処「こまち」にて、照明セッティングおよびカメラレンズの画角テストを完了しました。"
  },
  {
    date: "2026.08.15",
    category: "SCRIPT",
    title: "映画『盈虚とパイプドリーム』決定稿の最終推敲",
    image: "/gallery/gallery-2.png",
    content: "2021年の空気感と登場人物の対話をより繊細に描き出すため、決定稿のブラッシュアップを行いました。"
  },
  {
    date: "2026.07.01",
    category: "PRODUCTION",
    title: "映画化プロジェクトおよびプリプロダクションの本格始動",
    image: "/gallery/gallery-1.png",
    content: "自主制作長編映画『盈虚とパイプドリーム』の完成と映画祭出品に向け、各種準備を開始いたしました。"
  }
];

export default function ProductionUpdateSection() {
  return (
    <section id="news" className="bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-10 sm:space-y-14">

        {/* Section Header */}
        <div className="text-center space-y-2.5 sm:space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            NEWS <span className="inline-block">/ PRODUCTION UPDATE</span>
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            制作ニュース
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-balanced text-auto-phrase">
            映画制作の最新情報と進捗をお届けします。
          </p>
        </div>

        {/* Update List: 3 items with compact eyecatch */}
        <div className="space-y-3.5 sm:space-y-4 font-serif">
          {UPDATES.map((item, idx) => (
            <motion.div
              key={item.date + item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-zinc-900/40 border border-white/5 p-3.5 sm:p-5 rounded hover:border-white/10 transition-colors flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-start sm:items-center"
            >
              {item.image && (
                <div className="relative w-full sm:w-28 md:w-32 aspect-[16/9] sm:aspect-square rounded overflow-hidden flex-shrink-0 bg-black/60 border border-white/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-xs font-mono text-accent/80 font-bold">{item.date}</span>
                  <span className="text-[10px] font-mono tracking-wider sm:tracking-widest uppercase bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-normal sm:tracking-wide text-auto-phrase">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All News CTA Button */}
        <div className="text-center pt-2">
          <a
            href="#news"
            onClick={(e) => {
              e.preventDefault();
              alert("今後の撮影日誌や更新情報は随時公式サイトおよび公式SNSにて発信いたします。");
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-all text-xs sm:text-sm font-serif tracking-normal sm:tracking-widest rounded-sm active:scale-[0.98]"
          >
            <Newspaper className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
            <span>制作NEWSをすべて見る</span>
          </a>
        </div>

      </div>
    </section>
  );
}
