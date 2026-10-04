"use client";

import { useEffect, useCallback } from "react";

interface NewsCodocSectionProps {
  className?: string;
}

export default function NewsCodocSection({ className = "" }: NewsCodocSectionProps) {
  // 1. codoc公式モーダルを開くハンドラ
  const handleOpenCodoc = useCallback(() => {
    // 公式チップボタンをクリック
    const codocBtn = document.querySelector<HTMLElement>(".codoc-support .codoc-btn");
    if (codocBtn) {
      codocBtn.click();
      return;
    }
    // 未レンダリング時のフォールバック
    const altBtn = document.querySelector<HTMLElement>("#codoc-entry-Iu1j01olgg a, .codoc-btn");
    if (altBtn) {
      altBtn.click();
    }
  }, []);

  // 2. Next.jsのSPA遷移時にもcodocが確実に初期化されるよう、グローバルcodocオブジェクトがあれば再評価
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as unknown as { codoc?: { init?: () => void; render?: () => void } };
      if (w.codoc?.init) {
        w.codoc.init();
      } else if (w.codoc?.render) {
        w.codoc.render();
      }
    }
  }, []);

  return (
    <section
      aria-label="制作支援"
      className={`border-t border-white/10 pt-10 sm:pt-14 my-10 sm:my-14 font-serif ${className}`}
    >
      <div className="bg-zinc-950/70 border border-white/10 rounded-sm p-6 sm:p-8 md:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-xl">
        {/* 見出し */}
        <div className="space-y-2.5">
          <p className="text-[11px] sm:text-xs tracking-[0.2em] text-accent/90 uppercase font-mono">
            SUPPORT THE FILM
          </p>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-wide md:tracking-widest">
            制作支援のご案内
          </h2>
        </div>

        {/* 支援案内文 */}
        <div className="space-y-2 text-xs sm:text-sm text-foreground/80 leading-relaxed text-auto-phrase max-w-lg mx-auto">
          <p>
            映画『盈虚とパイプドリーム』では、<br className="hidden sm:inline" />
            作品完成に向けた制作支援を受け付けています。
          </p>
          <p className="text-foreground/60 text-[11px] sm:text-xs pt-1">
            任意の金額でご支援いただけます。
          </p>
        </div>

        {/* 支援CTAボタン */}
        <div className="max-w-xs mx-auto pt-1">
          <button
            type="button"
            onClick={handleOpenCodoc}
            className="w-full min-h-[50px] sm:min-h-[54px] flex items-center justify-center py-3.5 px-6 bg-[#ffbf00] hover:bg-white text-zinc-950 font-bold transition-all duration-300 rounded text-sm sm:text-base tracking-wider md:tracking-[0.15em] text-center shadow-[0_0_20px_rgba(255,191,0,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap active:scale-[0.98] cursor-pointer"
          >
            制作を支援する
          </button>
        </div>

        {/* codoc チップ・ウィジェット（RootLayoutで読み込まれるcodoc公式JSがマウントしてモーダルとpowered-byを生成） */}
        <div className="w-full max-w-md mx-auto">
          <div
            id="codoc-entry-Iu1j01olgg"
            className="codoc-entries w-full max-w-full overflow-hidden"
            data-without-body="1"
            data-support-message=""
          />
        </div>

        {/* 補足文 */}
        <p className="text-[11px] text-foreground/45 tracking-normal sm:tracking-wider pt-1">
          ※ 決済はcodocの安全な外部決済システムを通じて行われます。
        </p>
      </div>
    </section>
  );
}
