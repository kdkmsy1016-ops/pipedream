"use client";

import { useCallback } from "react";

interface SupportSectionProps {
  id?: string;
}

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
    <section id={id} className="bg-background py-24 sm:py-32 md:py-44 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden font-serif">
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
        <div className="space-y-3 text-foreground/80 leading-relaxed text-xs sm:text-sm md:text-base tracking-normal sm:tracking-wide text-justify md:text-center max-w-xl mx-auto text-auto-phrase">
          <p>
            映画『盈虚とパイプドリーム』では、<br className="hidden sm:inline" />
            作品完成までの制作を支えてくださる方からのご支援を受け付けています。
          </p>
          <p className="text-foreground/70 text-xs sm:text-sm">
            いただいた支援は、撮影、出演者・スタッフ、美術、音響、映画祭出品など、映画完成までの制作費として大切に活用します。
          </p>
        </div>

        {/* Single Support CTA */}
        <div className="w-full max-w-md mx-auto pt-2 space-y-3 text-center">
          <p className="text-xs sm:text-sm text-foreground/60 tracking-normal sm:tracking-wider">
            任意の金額でご支援いただけます。
          </p>
          <div>
            <button
              type="button"
              onClick={handleOpenCodoc}
              className="w-full min-h-[50px] sm:min-h-[54px] flex items-center justify-center py-3.5 px-6 bg-[#ffbf00] hover:bg-white text-zinc-950 font-bold transition-all duration-300 rounded text-sm sm:text-base tracking-wider md:tracking-[0.2em] text-center shadow-[0_0_20px_rgba(255,191,0,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap active:scale-[0.98] cursor-pointer"
            >
              制作を支援する
            </button>
          </div>
        </div>

        {/* codoc チップ・ウィジェット（DOM上に保持し、公式モーダルおよびpowered-byを表示） */}
        <div className="w-full max-w-xl mx-auto my-2">
          <div
            id="codoc-entry-Iu1j01olgg"
            className="codoc-entries"
            data-without-body="1"
            data-support-message=""
          />
        </div>

        {/* Supplementary Footnote */}
        <div className="pt-2 text-center text-[11px] sm:text-xs text-foreground/50 tracking-normal sm:tracking-wider text-auto-phrase">
          <p>
            ※アカウント登録なしでもご支援いただけます。支援金の使い道などの詳細は下記「ご支援について」をご確認ください。
          </p>
        </div>

      </div>
    </section>
  );
}
