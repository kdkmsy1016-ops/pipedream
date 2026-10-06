"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { NewsArticle, extractExcerpt, formatDate } from "../lib/microcms";
import { OFFICIAL_SOCIAL_LINKS } from "../config/socialConfig";

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
      className="bg-background py-20 sm:py-28 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-4xl w-full mx-auto space-y-10 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            NEWS <span className="inline-block">/ PRODUCTION UPDATE</span>
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            制作ニュース
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-balanced text-auto-phrase">
            映画『盈虚とパイプドリーム』の最新制作情報と撮影進捗をお届けします。
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
              const excerpt = extractExcerpt(item.content, 65);

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
                    className="group bg-zinc-900/40 border border-white/5 hover:border-accent/40 hover:bg-zinc-900/70 p-4 sm:p-5 rounded transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center block shadow-md"
                  >
                    {/* Eyecatch Image - Enhanced presence and balanced ratio */}
                    {item.eyecatch?.url ? (
                      <div className="relative w-full sm:w-44 md:w-52 aspect-[16/9] sm:aspect-[16/10] rounded overflow-hidden flex-shrink-0 bg-black/60 border border-white/10">
                        <Image
                          src={item.eyecatch.url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 208px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full sm:w-44 md:w-52 aspect-[16/9] sm:aspect-[16/10] rounded overflow-hidden flex-shrink-0 bg-zinc-800/60 border border-white/10 flex items-center justify-center text-foreground/30 text-xs">
                        NO IMAGE
                      </div>
                    )}

                    {/* Meta & Excerpt */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <span className="text-xs font-mono text-accent/90 font-bold">
                          {displayDate}
                        </span>
                        <span className="text-[10px] font-mono tracking-wider sm:tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded text-accent">
                          {categoryName}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition-colors tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-foreground/70 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2 break-words">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All News & Official X CTA Buttons */}
        <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <Link
            href="/news"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-all text-xs sm:text-sm font-serif tracking-normal sm:tracking-widest rounded-sm active:scale-[0.98] w-full sm:w-auto"
          >
            <Newspaper className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
            <span>制作NEWSをすべて見る</span>
          </Link>
          <a
            href={OFFICIAL_SOCIAL_LINKS.x.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 px-5 sm:px-7 py-3 bg-zinc-900/60 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 transition-all text-xs sm:text-sm font-sans tracking-wide rounded-sm active:scale-[0.98] w-full sm:w-auto"
          >
            <svg className="w-3.5 h-3.5 fill-current text-accent" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>公式X @eikyo_pipedream</span>
          </a>
        </div>
      </div>
    </section>
  );
}
