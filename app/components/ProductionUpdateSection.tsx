"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { NewsArticle, extractExcerpt, formatDate } from "../lib/microcms";

interface ProductionUpdateSectionProps {
  initialNews?: NewsArticle[] | null;
}

export default function ProductionUpdateSection({ initialNews = null }: ProductionUpdateSectionProps) {
  const [articles, setArticles] = useState<NewsArticle[] | null>(initialNews);
  const [loading, setLoading] = useState<boolean>(!initialNews);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (initialNews) {
      setArticles(initialNews);
      setLoading(false);
      return;
    }

    // クライアントサイドでの取得（初期プロップスがない場合のフォールバック）
    let isMounted = true;
    fetch("/api/news?limit=3")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data && Array.isArray(data.contents)) {
            setArticles(data.contents);
          } else {
            setArticles([]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("News fetch error:", err);
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialNews]);

  return (
    <section
      id="news"
      className="bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden"
    >
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

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-foreground/40 font-serif text-xs sm:text-sm">
            制作NEWSを読み込んでいます…
          </div>
        )}

        {/* Error State */}
        {!loading && hasError && (
          <div className="py-12 text-center text-foreground/50 font-serif text-xs sm:text-sm border border-white/5 bg-zinc-900/30 rounded p-6">
            現在、制作NEWSを読み込めません。
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasError && articles && articles.length === 0 && (
          <div className="py-12 text-center text-foreground/50 font-serif text-xs sm:text-sm border border-white/5 bg-zinc-900/30 rounded p-6">
            現在、公開されている制作NEWSはありません。
          </div>
        )}

        {/* Update List: 3 items from microCMS */}
        {!loading && !hasError && articles && articles.length > 0 && (
          <div className="space-y-3.5 sm:space-y-4 font-serif">
            {articles.slice(0, 3).map((item, idx) => {
              const displayDate = formatDate(item.publishedAt || item.createdAt);
              const categoryName = item.category?.name || "お知らせ";
              const excerpt = extractExcerpt(item.content, 90);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <Link
                    href={`/news/${item.id}`}
                    className="group bg-zinc-900/40 border border-white/5 p-3.5 sm:p-5 rounded hover:border-accent/40 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-start sm:items-center block"
                  >
                    {/* Eyecatch Image */}
                    {item.eyecatch?.url ? (
                      <div className="relative w-full sm:w-28 md:w-32 aspect-[16/9] sm:aspect-square rounded overflow-hidden flex-shrink-0 bg-black/60 border border-white/5">
                        <Image
                          src={item.eyecatch.url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full sm:w-28 md:w-32 aspect-[16/9] sm:aspect-square rounded overflow-hidden flex-shrink-0 bg-zinc-800/60 border border-white/5 flex items-center justify-center text-foreground/30 text-xs">
                        NO IMAGE
                      </div>
                    )}

                    {/* Meta & Excerpt */}
                    <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <span className="text-xs font-mono text-accent/80 font-bold">
                          {displayDate}
                        </span>
                        <span className="text-[10px] font-mono tracking-wider sm:tracking-widest uppercase bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent">
                          {categoryName}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground group-hover:text-accent transition-colors tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2 break-words">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All News CTA Button */}
        <div className="text-center pt-2">
          <Link
            href="/news"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-all text-xs sm:text-sm font-serif tracking-normal sm:tracking-widest rounded-sm active:scale-[0.98]"
          >
            <Newspaper className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
            <span>制作NEWSをすべて見る</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
