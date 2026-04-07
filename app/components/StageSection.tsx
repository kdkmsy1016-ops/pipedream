"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function StageSection() {
    return (
        <section className="py-12 bg-zinc-950 border-t border-white/5 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl w-full"
            >
                <Link href="/stage" className="block group relative bg-black/50 border border-white/5 rounded-lg p-6 md:p-8 hover:bg-black/80 transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#ffbf00] font-bold uppercase font-serif">
                                Stage Archive
                            </span>
                            <p className="text-xs md:text-sm text-zinc-300 font-serif leading-relaxed tracking-wide">
                                スピンオフ演劇『場末のパイプドリーム』下北沢・楽園公演（2026.4.3-5）は終了いたしました。<br className="hidden md:block" />温かいご声援ありがとうございました。
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-white tracking-widest group-hover:text-[#ffbf00] transition-colors">
                            特設サイトへ
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>
            </motion.div>
        </section>
    );
}
