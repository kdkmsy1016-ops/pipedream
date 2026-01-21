"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function LineSection() {
    return (
        <section className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-black/50 border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto w-full flex flex-col items-center"
            >
                <div className="max-w-md w-full text-center space-y-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-accent tracking-widest text-shadow-glow">
                        映画プロジェクト始動
                    </h2>

                    <p className="text-foreground/80 leading-loose text-sm md:text-base lg:text-lg font-serif">
                        2026年4月、クラウドファンディング開始。<br className="block md:hidden" />
                        制作の裏側や限定情報を<br className="block md:hidden" />LINEでお届けします。
                    </p>

                    <a
                        href="https://line.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 w-full bg-[#06c755] hover:bg-[#05b34c] text-white rounded-sm transition-all duration-300"
                    >
                        <MessageCircle size={24} />
                        <span className="font-bold tracking-wider">LINE公式アカウントを登録</span>
                        <div className="absolute inset-0 border border-white/20 group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                    </a>

                    <p className="text-xs text-foreground/40 mt-4">
                        ※ リンクはダミーです
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
