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
      template: '%s | 映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』',
      default: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』公式サイト',
    },
    description: '稲城市に実在するスナック『さくらみち』を舞台に製作される映画『盈虚とパイプドリーム』と、それに連動した舞台『場末のパイプドリーム』の公式サイト。最新の公演情報やチケット予約、映画の最新情報をお届けします。',
    keywords: [
      'さくらみち',
      '映画',
      '盈虚とパイプドリーム',
      '場末のパイプドリーム',
      '演劇',
      'チケット',
    ],
    metadataBase: new URL('https://eikyo-to-pipedream.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』公式サイト',
      description: '稲城市に実在するスナック『さくらみち』を舞台に製作される映画『盈虚とパイプドリーム』と、それに連動した舞台『場末のパイプドリーム』の公式サイト。最新の公演情報やチケット予約、映画の最新情報をお届けします。',
      url: 'https://eikyo-to-pipedream.com',
      siteName: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』',
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』公式サイト',
      description: '稲城市に実在するスナック『さくらみち』を舞台に製作される映画『盈虚とパイプドリーム』と、それに連動した舞台『場末のパイプドリーム』の公式サイト。最新の公演情報やチケット予約、映画の最新情報をお届けします。',
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
        "description": "スナックさくらみち映画化プロジェクトの一環。稲城市に実在するスナックを舞台に製作される映画。",
        "url": "https://eikyo-to-pipedream.com/film"
      },
      {
        "@type": "Event",
        "name": "舞台『場末のパイプドリーム』",
        "startDate": "2026-04-03T13:00:00+09:00",
        "endDate": "2026-04-05T16:00:00+09:00",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "下北沢 小劇場 楽園",
          "address": {
            "@type": "PostalAddress",
            "postalCode": "155-0031",
            "addressLocality": "東京都世田谷区",
            "streetAddress": "北沢2丁目10-18"
          }
        },
        "offers": {
          "@type": "Offer",
          "url": "https://www.quartet-online.net/ticket/basueno",
          "price": "4000",
          "priceCurrency": "JPY",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-02-21T21:00:00+09:00"
        }
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
