"use client";

interface SupportSectionProps {
  id?: string;
}

export default function SupportSection({ id = "support" }: SupportSectionProps) {
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

        {/* codoc チップ・ウィジェット */}
        <div className="w-full max-w-xl mx-auto my-8 sm:my-12">
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
