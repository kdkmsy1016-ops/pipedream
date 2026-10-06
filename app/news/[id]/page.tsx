import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getNewsDetail, formatDate, extractExcerpt } from "@/app/lib/microcms";
import NewsCodocSection from "@/app/components/NewsCodocSection";
import NewsShareSection from "@/app/components/NewsShareSection";
import Footer from "@/app/components/Footer";

export const revalidate = 60; // 60秒ISR

const SITE_ORIGIN = "https://www.eikyo-to-pipedream.com";
const DEFAULT_OG_IMAGE = "https://www.eikyo-to-pipedream.com/ogp-image.png";

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getNewsDetail(id);
  if (!article) {
    return {
      title: "記事が見つかりません | 映画『盈虚とパイプドリーム』",
    };
  }

  const canonicalUrl = `${SITE_ORIGIN}/news/${article.id}`;
  const description = extractExcerpt(article.content, 140) || article.title;
  const imageUrl = article.eyecatch?.url || DEFAULT_OG_IMAGE;

  return {
    title: `${article.title} | 映画『盈虚とパイプドリーム』制作NEWS`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "映画『盈虚とパイプドリーム』公式サイト",
      images: [
        {
          url: imageUrl,
          width: article.eyecatch?.width || 1200,
          height: article.eyecatch?.height || 630,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.revisedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [imageUrl],
      site: "@eikyo_pipedream",
      creator: "@eikyo_pipedream",
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const article = await getNewsDetail(id);

  if (!article) {
    notFound();
  }

  const canonicalUrl = `${SITE_ORIGIN}/news/${article.id}`;
  const displayDate = formatDate(article.publishedAt || article.createdAt);
  const categoryName = article.category?.name || "お知らせ";
  const articleImageUrl = article.eyecatch?.url || DEFAULT_OG_IMAGE;

  // 構造化データ (NewsArticle / Article JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: extractExcerpt(article.content, 140),
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: [articleImageUrl],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.revisedAt || article.publishedAt || article.createdAt,
    author: {
      "@type": "Organization",
      name: "映画『盈虚とパイプドリーム』製作プロジェクト",
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "映画『盈虚とパイプドリーム』",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-20 sm:py-28 md:py-36 px-4 sm:px-6 font-serif overflow-x-hidden">
      {/* 構造化データ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl w-full mx-auto space-y-10 sm:space-y-14">
        
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-foreground/60 hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>制作NEWS一覧へ戻る</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-foreground/40 hover:text-white transition-colors"
          >
            TOP
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-accent/90 font-bold">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <time dateTime={article.publishedAt || article.createdAt}>
                {displayDate}
              </time>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded text-accent">
              <Tag className="w-3 h-3 text-accent/80" />
              <span>{categoryName}</span>
            </div>
          </div>

          <h1 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.1em] text-foreground leading-snug sm:leading-relaxed text-auto-phrase">
            {article.title}
          </h1>
        </header>

        {/* Eyecatch Image (Responsive 16:9 full width) */}
        {article.eyecatch?.url && (
          <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-black/80 border border-white/10 shadow-2xl">
            <Image
              src={article.eyecatch.url}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body Content (microCMS Rich Editor HTML) */}
        <div
          className="news-content text-foreground/90 leading-relaxed md:leading-loose text-sm sm:text-base md:text-[17px] tracking-normal sm:tracking-wide space-y-6 break-words overflow-hidden text-auto-phrase"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 1. SNS Share Section (Placed right after article content, before codoc) */}
        <NewsShareSection
          title={article.title}
          url={canonicalUrl}
          socialText={article.socialText}
        />

        {/* 2. Common codoc chip & Support Section (Placed after SNS share) */}
        <NewsCodocSection />

        {/* Back Link Button */}
        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xs sm:text-sm text-foreground/60">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>制作NEWS一覧へ</span>
          </Link>
          <Link
            href="/"
            className="hover:text-accent transition-colors"
          >
            公式サイトトップへ
          </Link>
        </div>

        {/* Footer */}
        <Footer className="pt-8" />
      </article>
    </main>
  );
}
