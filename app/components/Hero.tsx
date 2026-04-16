"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden">
            
            {/* Cinematic Video Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <iframe
                    className="w-[300vw] h-[300vh] md:w-[150vw] md:h-[150vh] xl:w-[120vw] xl:h-[120vh]"
                    src="https://www.youtube.com/embed/nbCht1onqWU?autoplay=1&mute=1&loop=1&playlist=nbCht1onqWU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: 0, pointerEvents: 'none' }}
                />
                {/* Dark Gradient Overlay for Cinematic Feel */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none" />
            </div>

            {/* SEO Hidden Text */}
            <div className="sr-only">
                <h1>盈虚とパイプドリーム Phases of a Pipe Dream</h1>
                <p>私たちは『不要不急』の中で、夢を見た。</p>
                <p>脚本: 福井 将真 / 監督: 久高 将也</p>
                <p>映画プロジェクト始動</p>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0, duration: 2.0, ease: "easeOut" }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif tracking-[0.3em] md:tracking-[0.4em] text-white/90 drop-shadow-2xl font-light">
                        盈虚とパイプドリーム
                    </h2>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 z-10 flex flex-col items-center gap-2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 1.5 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white/40" strokeWidth={1} />
                </motion.div>
            </motion.div>
        </section>
    );
}
