"use client";

import { motion } from "framer-motion";
import { STRIPE_PAYMENT_LINKS } from "../config/supportConfig";

interface SupportSectionProps {
  id?: string;
}

export default function SupportSection({ id = "support" }: SupportSectionProps) {
  const fixedOptions = [
    { label: "¥1,000", url: STRIPE_PAYMENT_LINKS.yen1000 },
    { label: "¥3,000", url: STRIPE_PAYMENT_LINKS.yen3000 },
    { label: "¥5,000", url: STRIPE_PAYMENT_LINKS.yen5000 },
    { label: "¥10,000", url: STRIPE_PAYMENT_LINKS.yen10000 },
  ];

  const footnotes = [
    "一回限りの支援です",
    "アカウント登録は不要です",
    "匿名での支援も可能です",
    "オンライン決済にはStripeを利用しています"
  ];

  return (
    <section id={id} className="bg-background py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden font-serif">
      <div className="max-w-2xl w-full mx-auto space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 uppercase">
            Support The Film
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-foreground">
            この映画の完成を支える
          </h2>
        </div>

        {/* Explanation Text First */}
        <div className="space-y-4 text-foreground/80 leading-relaxed text-sm md:text-base tracking-wide text-justify md:text-left">
          <p>
            『盈虚とパイプドリーム』は、現在も制作を続けています。
          </p>
          <p>
            制作は自己資金を中心に進めていますが、この映画に共感してくださった方が、制作に参加できる方法のひとつとして、常設の支援窓口を設けています。
          </p>
          <p>
            ご支援は1,000円から、または自由な金額でお選びいただけます。金額によるリターンの違いはありません。
          </p>
          <p>
            ご希望の方のお名前を、完成作品のエンドクレジットにSpecial Thanksとして掲載します。匿名でのご支援も可能です。
          </p>
        </div>

        {/* Minimal Amount Selection UI */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/30 border border-white/5 rounded-lg p-6 md:p-8 space-y-6"
        >
          {/* 4 Fixed Amount Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fixedOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center py-4 px-3 bg-black/40 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 text-foreground transition-all duration-200 rounded text-center active:scale-[0.98]"
              >
                <span className="text-base md:text-lg font-bold tracking-wider">
                  {opt.label}
                </span>
                <span className="text-[11px] text-foreground/60 group-hover:text-foreground/90 tracking-widest mt-1">
                  この金額で支援する
                </span>
              </a>
            ))}
          </div>

          {/* Custom Amount Button */}
          <div>
            <a
              href={STRIPE_PAYMENT_LINKS.custom}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-foreground/90 hover:text-white transition-all duration-200 rounded text-xs md:text-sm tracking-[0.2em] text-center"
            >
              自由な金額で支援する
            </a>
          </div>

          {/* Small Discreet Footnotes */}
          <div className="pt-4 border-t border-white/5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-foreground/50 tracking-wider">
              {footnotes.map((fn) => (
                <span key={fn}>・{fn}</span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
