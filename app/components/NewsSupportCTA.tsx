"use client";

import { useCallback } from "react";
import Script from "next/script";

interface NewsSupportCTAProps {
  className?: string;
}

export default function NewsSupportCTA({ className = "" }: NewsSupportCTAProps) {
  const handleOpenCodoc = useCallback(() => {
    // 1. codoc公式のチップボタンをクリック
    const codocBtn = document.querySelector<HTMLElement>(".codoc-support .codoc-btn");
    if (codocBtn) {
      codocBtn.click();
      return;
    }
    // 2. フォールバック
    const altBtn = document.querySelector<HTMLElement>("#codoc-entry-Iu1j01olgg a, .codoc-btn");
    if (altBtn) {
      altBtn.click();
    }
  }, []);

  return (
    <div
      className={`bg-zinc-900/50 border border-white/10 rounded-sm p-6 sm:p-8 md:p-10 text-center font-serif space-y-6 ${className}`}
    >
      <div className="space-y-3">
        <p className="text-[11px] sm:text-xs tracking-[0.2em] text-accent/90 uppercase">
          SUPPORT THE FILM
        </p>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-wide md:tracking-widest">
          映画『盈虚とパイプドリーム』を支援する
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-lg mx-auto text-auto-phrase">
        映画『盈虚とパイプドリーム』では、作品完成に向けた制作支援を受け付けています。
      </p>

      <div className="max-w-xs mx-auto pt-1">
        <button
          type="button"
          onClick={handleOpenCodoc}
          className="w-full min-h-[48px] sm:min-h-[52px] flex items-center justify-center py-3 px-6 bg-[#ffbf00] hover:bg-white text-zinc-950 font-bold transition-all duration-300 rounded text-sm sm:text-base tracking-wider md:tracking-[0.15em] text-center shadow-[0_0_20px_rgba(255,191,0,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap active:scale-[0.98] cursor-pointer"
        >
          制作を支援する
        </button>
      </div>

      <p className="text-[11px] text-foreground/50 tracking-wider">
        ※ 任意の金額でご支援いただけます（決済モーダルが開きます）
      </p>

      {/* codoc チップ・ウィジェット（各詳細ページでもcodoc決済モーダルを起動可能にするDOM） */}
      <div className="w-full max-w-md mx-auto hidden">
        <div
          id="codoc-entry-Iu1j01olgg"
          className="codoc-entries"
          data-without-body="1"
          data-support-message=""
        />
      </div>

      {/* codocスクリプトの念のためロード（RootLayoutでafterInteractive読み込み済みだが未マウント遷移時にも安全に確保） */}
      <Script
        src="https://codoc.jp/js/cms.js"
        data-css="rainbow-square"
        data-usercode="rZ1NB5HCuw"
        charSet="UTF-8"
        strategy="lazyOnload"
      />
    </div>
  );
}
