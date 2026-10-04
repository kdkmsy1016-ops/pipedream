"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function PastCrowdfundingSection() {
  return (
    <section id="past-crowdfunding" className="bg-zinc-950 py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-8 text-center font-serif">

        {/* Section Header */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs tracking-wider md:tracking-[0.2em] text-foreground/40 uppercase break-normal">
            Crowdfunding Archive
          </p>
          <h2 className="text-[clamp(1.2rem,4vw,1.5rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground/90 text-balanced">
            これまでのご支援
          </h2>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 border border-white/5 p-4 sm:p-6 md:p-8 rounded space-y-5 sm:space-y-6 max-w-2xl mx-auto"
        >
          <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
            本作では2026年にクラウドファンディングを実施し、多くの皆さまから温かいご支援をいただきました。<br className="hidden sm:block" />
            ご支援・応援いただいた皆さまに、改めて心より御礼申し上げます。
          </p>

          <div className="pt-1 sm:pt-2">
            <Link
              href="/guide"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-colors text-xs tracking-normal sm:tracking-widest rounded-sm active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-accent/80 flex-shrink-0" />
              <span>クラウドファンディングの記録を見る</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
