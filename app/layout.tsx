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
  title: "盈虚とパイプドリーム | Teaser",
  description: "映画『盈虚とパイプドリーム』× 舞台『場末のパイプドリーム』",
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
