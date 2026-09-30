"use client";

import { motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { STRIPE_PAYMENT_LINKS, SUPPORT_NOTES } from "../config/supportConfig";

interface SupportSectionProps {
  id?: string;
  isCompactView?: boolean;
}

export default function SupportSection({ id = "support" }: SupportSectionProps) {
  const fixedOptions = [
    { label: "¥1,000", amount: "1,000円で支援", url: STRIPE_PAYMENT_LINKS.yen1000 },
    { label: "¥3,000", amount: "3,000円で支援", url: STRIPE_PAYMENT_LINKS.yen3000 },
    { label: "¥5,000", amount: "5,000円で支援", url: STRIPE_PAYMENT_LINKS.yen5000 },
    { label: "¥10,000", amount: "10,000円で支援", url: STRIPE_PAYMENT_LINKS.yen10000 },
  ];

  return (
    <section id={id} className="bg-zinc-950 py-24 md:py-36 px-6 border-t border-accent/20 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-12 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-accent text-xs font-serif tracking-widest uppercase mb-2">
            <Heart className="w-3.5 h-3.5 fill-accent" />
            Support
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            この映画を支援する
          </h2>
          <p className="text-sm md:text-base text-foreground/80 font-serif tracking-wide leading-relaxed max-w-2xl mx-auto pt-2">
            もっと気軽に、この映画を応援していただけるように。<br />
            映画『盈虚とパイプドリーム』では、完成までの制作支援を随時受け付けています。
          </p>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-widest max-w-xl mx-auto">
            物品等のリターンは設けず、いただいたご支援を映画の制作・完成のために大切に活用します。
          </p>
        </div>

        {/* Payment Buttons Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 border border-white/10 rounded-lg p-6 md:p-10 space-y-8 shadow-2xl backdrop-blur-sm"
        >
          {/* 4 Fixed Amount Buttons Grid (2 columns on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {fixedOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center py-5 px-4 bg-zinc-900/90 hover:bg-accent border border-white/10 hover:border-accent text-foreground hover:text-zinc-950 transition-all duration-300 rounded text-center shadow-md active:scale-[0.98]"
              >
                <span className="text-lg md:text-xl font-bold font-serif tracking-wider group-hover:scale-105 transition-transform duration-300">
                  {opt.label}
                </span>
                <span className="text-[10px] md:text-xs opacity-75 group-hover:opacity-100 font-serif tracking-widest mt-1">
                  支援する
                </span>
              </a>
            ))}
          </div>

          {/* Custom Amount Button (Full Width Below) */}
          <div className="pt-2">
            <a
              href={STRIPE_PAYMENT_LINKS.custom}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center py-4 px-6 bg-accent/90 hover:bg-white text-zinc-950 transition-all duration-300 rounded font-bold font-serif text-sm md:text-base tracking-[0.2em] shadow-[0_0_20px_rgba(255,191,0,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-[0.99]"
            >
              <span className="group-hover:scale-[1.02] transition-transform duration-300">
                金額を自由に決めて支援する
              </span>
            </a>
          </div>

          {/* UX Feature Checks */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 border-t border-white/5 text-xs text-foreground/60 font-serif tracking-wider">
            {SUPPORT_NOTES.map((note) => (
              <div key={note} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
}
