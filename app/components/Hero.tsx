"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import HeroButton from "./HeroButton";

export default function Hero() {
    return (
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-start bg-zinc-950 pt-20 pb-10 box-border overflow-hidden">
            
            {/* Background Image (User's attached image) */}
            <div className="w-full max-w-7xl mx-auto flex-shrink-0 animate-in fade-in duration-1000">
                <Image
                    src="/hero-bg.png"
                    alt="盈虚とパイプドリーム"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-contain"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* SEO Hidden Text */}
            <div className="sr-only">
                <h1>盈虚とパイプドリーム Phases of a Pipe Dream</h1>
                <p>私たちは『不要不急』の中で、夢を見た。</p>
                <p>脚本: 福井 将真 / 監督: 久高 将也</p>
                <p>映画プロジェクト始動</p>
            </div>

            {/* Content Container (Below the Image) */}
            <div className="w-full flex-1 flex flex-col items-center justify-center px-6 mt-8 md:mt-12 box-border">
                {/* Crowdfunding CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.0 }}
                    className="flex flex-col items-center space-y-4 max-w-sm w-full"
                >
                    <p className="text-[#ffbf00] font-bold tracking-widest text-sm lg:text-base font-serif drop-shadow-md">
                        映画プロジェクト始動
                    </p>
                    <HeroButton
                        href="/crowdfunding"
                        icon={Gift}
                        label="クラウドファンディング実施中"
                        variant="gold"
                    />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="mt-12 flex flex-col items-center gap-1 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: [0, 6, 0] }}
                transition={{
                    opacity: { delay: 1.5, duration: 1.0 },
                    y: { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-serif drop-shadow-md">Scroll</span>
                <div className="w-[1px] h-8 bg-white/40 shadow-sm" />
            </motion.div>
        </section>
    );
}
