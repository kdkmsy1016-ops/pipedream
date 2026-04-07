"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import HeroButton from "./HeroButton";

export default function Hero() {
    return (
        <section className="relative w-full h-[100svh] overflow-hidden bg-zinc-950">
            {/* Background Image (User's attached image) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="盈虚とパイプドリーム"
                    fill
                    className="object-cover object-center lg:object-[center_30%]"
                    priority
                    sizes="100vw"
                />
                {/* 
                  Bottom Gradient Overlay 
                  Fades to dark only at the bottom to ensure the CTA button is visible,
                  while keeping the image's logo and text completely clear.
                */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* SEO Hidden Text (Since the image contains the typography) */}
            <div className="sr-only">
                <h1>盈虚とパイプドリーム Phases of a Pipe Dream</h1>
                <p>私たちは『不要不急』の中で、夢を見た。</p>
                <p>脚本: 福井 将真 / 監督: 久高 将也</p>
                <p>映画プロジェクト始動</p>
            </div>

            {/* Content Container (Centered CTA at bottom) */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-32 lg:pb-24 px-6 box-border">
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
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none lg:bottom-8"
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
