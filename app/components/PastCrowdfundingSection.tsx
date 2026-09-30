"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function PastCrowdfundingSection() {
  return (
    <section id="past-crowdfunding" className="bg-zinc-950 py-20 md:py-28 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-3xl w-full mx-auto space-y-8 text-center font-serif">

        {/* Section Header */}
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] text-foreground/40 uppercase">
            Crowdfunding Archive
          </p>
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.15em] text-foreground/90">
            これまでのご支援
          </h2>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 border border-white/5 p-6 md:p-8 rounded space-y-6 max-w-2xl mx-auto"
        >
          <p className="text-xs md:text-sm text-foreground/75 leading-relaxed tracking-wide">
            本作では2026年にクラウドファンディングを実施し、多くの皆さまから温かいご支援をいただきました。<br />
            ご支援・応援いただいた皆さまに、改めて心より御礼申し上げます。
          </p>

          <div className="pt-2">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 transition-colors text-xs tracking-widest rounded-sm"
            >
              <FileText className="w-3.5 h-3.5 text-accent/80" />
              <span>クラウドファンディングの記録を見る</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
