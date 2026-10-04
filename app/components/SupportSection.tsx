"use client";

import { useCallback } from "react";

interface SupportSectionProps {
  id?: string;
}

const SUPPORT_TIERS = [
  { label: "¥1,000", amount: 1000 },
  { label: "¥3,000", amount: 3000 },
  { label: "¥5,000", amount: 5000 },
  { label: "¥10,000", amount: 10000 },
];

export default function SupportSection({ id = "support" }: SupportSectionProps) {
  const handleOpenCodoc = useCallback(() => {
    // codocの公式チップボタン要素（.codoc-support .codoc-btn）をクリックして公式モーダルを起動
    const codocBtn = document.querySelector<HTMLElement>(".codoc-support .codoc-btn");
    if (codocBtn) {
      codocBtn.click();
    } else {
      // 読み込み中または未レンダリング時のフォールバック
      const altBtn = document.querySelector<HTMLElement>("#codoc-entry-Iu1j01olgg a, .codoc-btn");
      if (altBtn) altBtn.click();
    }
  }, []);

  return (
    <section id={id} className="bg-background py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden font-serif">
      <div className="max-w-2xl w-full mx-auto space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 uppercase break-normal">
            Support The Film
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground text-balanced">
            この映画を支援する
          </h2>
        </div>

        {/* Explanation Text */}
        <div className="space-y-4 text-foreground/80 leading-relaxed text-sm md:text-base tracking-normal sm:tracking-wide text-justify md:text-center max-w-xl mx-auto text-auto-phrase">
          <p>
            映画『盈虚とパイプドリーム』では、<br className="hidden sm:inline" />
            作品完成までの制作支援を受け付けています。
          </p>
          <p>
            いただいたご支援は、撮影、出演者・スタッフ、美術、編集、整音・MA、カラーグレーディング、字幕・DCP制作、映画祭出品など、映画完成までの制作費として活用します。
          </p>
        </div>

        {/* Custom Support Amount Buttons */}
        <div className="w-full max-w-xl mx-auto space-y-5 sm:space-y-6">
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm tracking-wider md:tracking-[0.15em] text-foreground/70 font-medium">
              ご支援金額の目安
            </p>
            <p className="text-[11px] sm:text-xs text-foreground/50 tracking-normal sm:tracking-wider">
              ※金額は決済画面で自由にお選びいただけます
            </p>
          </div>

          {/* 4 Amount Buttons: PC 4 columns, Mobile 2 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {SUPPORT_TIERS.map((tier) => (
              <button
                key={tier.label}
                type="button"
                onClick={handleOpenCodoc}
                className="group min-h-[52px] sm:min-h-[58px] flex flex-col items-center justify-center py-3 px-2 bg-black/40 hover:bg-[#ffbf00]/10 border border-white/10 hover:border-[#ffbf00]/50 text-foreground hover:text-[#ffbf00] transition-all duration-200 rounded text-center active:scale-[0.98] cursor-pointer"
              >
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
                  {tier.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-foreground/50 group-hover:text-[#ffbf00]/80 tracking-normal mt-0.5">
                  この金額を目安に支援
                </span>
              </button>
            ))}
          </div>

          {/* Custom / Free Amount Button: Full width */}
          <div>
            <button
              type="button"
              onClick={handleOpenCodoc}
              className="w-full min-h-[46px] sm:min-h-[48px] flex items-center justify-center py-3 px-4 bg-black/60 hover:bg-[#ffbf00] border border-[#ffbf00]/70 hover:border-[#ffbf00] text-[#ffbf00] hover:text-black font-bold transition-all duration-300 rounded text-xs sm:text-sm tracking-wider md:tracking-[0.18em] text-center shadow-[0_0_12px_rgba(255,191,0,0.15)] hover:shadow-[0_0_20px_rgba(255,191,0,0.4)] whitespace-nowrap active:scale-[0.98] cursor-pointer"
            >
              金額を自由に決めて支援する
            </button>
          </div>
        </div>

        {/* codoc チップ・ウィジェット（DOM上に保持し、公式モーダルおよびpowered-byを表示） */}
        <div className="w-full max-w-xl mx-auto my-4">
          <div
            id="codoc-entry-Iu1j01olgg"
            className="codoc-entries"
            data-without-body="1"
            data-support-message=""
          />
        </div>

        {/* Supplementary Footnotes */}
        <div className="pt-2 text-center space-y-2 text-[11px] sm:text-xs text-foreground/50 tracking-normal sm:tracking-wider text-auto-phrase">
          <p>
            ※ご支援いただいた方で掲載をご希望される方は、本編エンドクレジットにSpecial Thanksとしてお名前を掲載させていただきます。
          </p>
          <p>
            ※アカウント登録なしでもご支援いただけます。決済にはcodocのセキュアな決済システムを使用しています。
          </p>
        </div>

      </div>
    </section>
  );
}
