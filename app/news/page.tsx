import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Newspaper } from "lucide-react";
import { getNewsList, extractExcerpt, formatDate } from "@/app/lib/microcms";
import NewsCodocSection from "@/app/components/NewsCodocSection";

export const revalidate = 60; // 60秒ISR

export const metadata: Metadata = {
  title: "制作NEWS一覧",
  description: "映画『盈虚とパイプドリーム』の最新制作ニュース、撮影日誌、お知らせの一覧です。",
};

export default async function NewsListPage() {
  const newsData = await getNewsList(30);
  const articles = newsData?.contents || [];

  return (
    <main className="min-h-screen bg-background text-foreground py-20 sm:py-28 md:py-36 px-4 sm:px-6 font-serif overflow-x-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">
        
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-foreground/60 hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>公式サイトトップへ戻る</span>
          </Link>
          <span className="text-xs text-accent/80 font-mono tracking-widest uppercase">
            NEWS ARCHIVE
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 uppercase">
            PRODUCTION UPDATE
          </p>
          <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground text-balanced">
            制作NEWS一覧
          </h1>
          <p className="text-xs md:text-sm text-foreground/60 tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-auto-phrase">
            映画『盈虚とパイプドリーム』の制作進行状況、撮影記録、最新のお知らせをお届けします。
          </p>
        </div>

        {/* News List */}
        {articles.length === 0 ? (
          <div className="py-16 text-center text-foreground/50 font-serif text-sm border border-white/5 bg-zinc-900/30 rounded p-8">
            現在、制作NEWSを読み込めないか、記事が登録されていません。
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {articles.map((item) => {
              const displayDate = formatDate(item.publishedAt || item.createdAt);
              const categoryName = item.category?.name || "お知らせ";
              const excerpt = extractExcerpt(item.content, 110);

              return (
                <article key={item.id}>
                  <Link
                    href={`/news/${item.id}`}
                    className="group bg-zinc-900/40 border border-white/5 p-4 sm:p-6 rounded hover:border-accent/40 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center block"
                  >
                    {/* Eyecatch Image */}
                    {item.eyecatch?.url ? (
                      <div className="relative w-full sm:w-36 md:w-44 aspect-[16/9] sm:aspect-square rounded overflow-hidden flex-shrink-0 bg-black/60 border border-white/5">
                        <Image
                          src={item.eyecatch.url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full sm:w-36 md:w-44 aspect-[16/9] sm:aspect-square rounded overflow-hidden flex-shrink-0 bg-zinc-800/60 border border-white/5 flex items-center justify-center text-foreground/30 text-xs">
                        NO IMAGE
                      </div>
                    )}

                    {/* Metadata & Excerpt */}
                    <div className="flex-1 min-w-0 space-y-2 sm:space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <time className="text-xs font-mono text-accent/80 font-bold">
                          {displayDate}
                        </time>
                        <span className="text-[10px] font-mono tracking-wider sm:tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded text-accent">
                          {categoryName}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition-colors tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase line-clamp-2 break-words">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Global Support CTA at bottom */}
        <NewsCodocSection />

        {/* Footer info */}
        <div className="pt-8 text-center text-xs text-foreground/40 border-t border-white/5">
          <p>&copy; 2026 映画『盈虚とパイプドリーム』製作プロジェクト</p>
        </div>
      </div>
    </main>
  );
}
