"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";

interface NewsShareSectionProps {
  title: string;
  url: string;
  socialText?: string | null;
}

export default function NewsShareSection({
  title,
  url,
  socialText,
}: NewsShareSectionProps) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Web Share API の利用可否チェック（クライアントサイド）
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  // シェア用テキストの構築
  // 1. socialText があればそれを優先、なければタイトルを使用
  const baseText = (socialText && socialText.trim().length > 0) ? socialText.trim() : title;

  // X (旧Twitter) シェアURL: テキスト + ハッシュタグ(#盈虚とパイプドリーム) + URL
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    baseText
  )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent("盈虚とパイプドリーム")}`;

  // Facebook シェアURL: OGPを取得させるためURLを渡す
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  // LINE シェアURL: テキスト + URL
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(baseText)}`;

  // Web Share API 実行ハンドラ
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: baseText,
          url,
        });
      } catch (error) {
        // ユーザーキャンセル（AbortError）は無視
        if ((error as Error).name !== "AbortError") {
          console.error("Web Share failed:", error);
        }
      }
    }
  };

  // リンクコピーハンドラ
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // コピー失敗時は何もしない
    }
  };

  return (
    <section
      aria-label="SNSシェア"
      className="border-t border-white/10 pt-8 mt-10 sm:mt-12 font-serif"
    >
      <div className="space-y-4">
        {/* 見出し */}
        <div className="flex items-center gap-2 text-foreground/60 text-xs sm:text-[13px] tracking-wider uppercase">
          <Share2 className="w-3.5 h-3.5 text-accent/80" />
          <span>この記事をシェア</span>
        </div>

        {/* ボタン一覧: 映画サイトの黒基調・細い罫線・落ち着いたデザイン */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* X (旧Twitter) */}
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) でシェア"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-sm bg-zinc-900/60 hover:bg-zinc-800 text-foreground/90 hover:text-white border border-white/10 hover:border-accent/40 text-xs sm:text-sm font-sans tracking-wide transition-all active:scale-[0.98]"
          >
            {/* X SVG アイコン */}
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X</span>
          </a>

          {/* Facebook */}
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook でシェア"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-sm bg-zinc-900/60 hover:bg-zinc-800 text-foreground/90 hover:text-white border border-white/10 hover:border-accent/40 text-xs sm:text-sm font-sans tracking-wide transition-all active:scale-[0.98]"
          >
            {/* Facebook SVG アイコン */}
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* LINE */}
          <a
            href={lineShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LINE でシェア"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-sm bg-zinc-900/60 hover:bg-zinc-800 text-foreground/90 hover:text-white border border-white/10 hover:border-accent/40 text-xs sm:text-sm font-sans tracking-wide transition-all active:scale-[0.98]"
          >
            {/* LINE SVG アイコン */}
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.494.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .626.285.626.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span>LINE</span>
          </a>

          {/* Web Share API (スマートフォン等で対応ブラウザのみ表示) */}
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="その他の方法でシェア"
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-sm bg-zinc-900/60 hover:bg-zinc-800 text-foreground/90 hover:text-white border border-white/10 hover:border-accent/40 text-xs sm:text-sm font-sans tracking-wide transition-all active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-accent/90" />
              <span>その他の方法でシェア</span>
            </button>
          )}

          {/* URLコピー（補助機能） */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="URLをコピー"
            className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-sm bg-zinc-900/40 hover:bg-zinc-800 text-foreground/60 hover:text-foreground text-xs font-mono border border-white/5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">コピー完了</span>
              </>
            ) : (
              <span>URLコピー</span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
