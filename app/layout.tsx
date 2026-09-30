import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP } from "next/font/google";
import Navigation from "./components/Navigation";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["200", "400", "700", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const revalidate = 60; // 60秒ごとにサーバー側で最新の状態を評価する

export function generateMetadata(): Metadata {
  const now = new Date();
  const endDate = new Date("2026-06-02T00:00:00+09:00");
  const isEnded = now >= endDate;

  const ogImageUrl = isEnded 
    ? 'https://eikyo-to-pipedream.com/ogp-ended.png' 
    : 'https://eikyo-to-pipedream.com/ogp-image.png';

  return {
    title: {
      template: '%s | 映画『盈虚とパイプドリーム』公式サイト',
      default: '映画『盈虚とパイプドリーム』公式サイト',
    },
    description: '稲城市に実在するスナック『さくらみち』を舞台に製作される自主制作長編映画『盈虚とパイプドリーム』公式サイト。作品概要、現在の制作進行状況、制作記録、制作支援に関する最新情報をお届けします。',
    keywords: [
      'さくらみち',
      '映画',
      '盈虚とパイプドリーム',
      '自主制作映画',
      '映画祭',
    ],
    metadataBase: new URL('https://eikyo-to-pipedream.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: '映画『盈虚とパイプドリーム』公式サイト',
      description: '稲城市に実在するスナック『さくらみち』を舞台に製作される自主制作長編映画『盈虚とパイプドリーム』公式サイト。作品概要、現在の制作進行状況、制作記録、制作支援に関する最新情報をお届けします。',
      url: 'https://eikyo-to-pipedream.com',
      siteName: '映画『盈虚とパイプドリーム』公式サイト',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: '映画『盈虚とパイプドリーム』',
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '映画『盈虚とパイプドリーム』公式サイト',
      description: '稲城市に実在するスナック『さくらみち』を舞台に製作される自主制作長編映画『盈虚とパイプドリーム』公式サイト。作品概要、現在の制作進行状況、制作記録、制作支援に関する最新情報をお届けします。',
      images: [ogImageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        "name": "盈虚とパイプドリーム",
        "alternateName": ["さくらみち", "スナック", "映画"],
        "description": "実在するスナック『さくらみち』を舞台に製作される自主制作長編映画。",
        "url": "https://eikyo-to-pipedream.com"
      }
    ]
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${notoSerifJP.variable} font-serif antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Navigation />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
