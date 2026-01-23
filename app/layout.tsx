import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import Navigation from "./components/Navigation";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["200", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』',
    default: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』公式サイト',
  },
  description: '久高将也監督作品。ユージン・オニール『氷人來たる』を原案に、2021年の「スナックさくらみち」に集う人々を描く映画と舞台のクロスオーバー・プロジェクト。',
  keywords: [
    '盈虚とパイプドリーム',
    '場末のパイプドリーム',
    'スナックさくらみち',
    '映画',
    '演劇',
    '久高将也',
    'ユージン・オニール',
    '氷人來たる',
    '福井将真',
    '町田直樹',
    'SAKURA ROAD エンタテインメント',
  ],
  metadataBase: new URL('https://eikyo-to-pipedream.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』公式サイト',
    description: '福井将真×久高将也。ユージン・オニール『氷人來たる』を原案に、2021年の「スナックさくらみち」に集う人々を描く映画と舞台のクロスオーバー・プロジェクト。',
    url: 'https://eikyo-to-pipedream.com',
    siteName: '映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』',
    images: [
      {
        url: '/ogp-image.png',
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
    description: '福井将真×久高将也。ユージン・オニール『氷人來たる』を原案に、2021年の「スナックさくらみち」に集う人々を描く映画と舞台のクロスオーバー・プロジェクト。',
    images: ['/ogp-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">

      <body
        className={`${notoSerifJP.variable} font-serif antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
