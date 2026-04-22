"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Crowdfunding Stats State
    const [percent, setPercent] = useState<number | null>(null);
    const [remainingDays, setRemainingDays] = useState<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        
        let resizeTimer: any;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkMobile, 150);
        };
        window.addEventListener('resize', handleResize);
        
        // Fetch stats
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/crowdfunding-stats");
                const data = await res.json();
                if (data.success) {
                    setPercent(data.percent);
                    setRemainingDays(data.remainingDays);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="relative w-full h-auto flex flex-col items-center justify-center bg-black overflow-hidden">
            
            {/* Background Image Container */}
            <div className="relative w-full h-auto pointer-events-none">
                {isMounted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full h-auto flex"
                    >
                        <Image
                            src={isMobile ? "/hero-bg-mobile.png" : "/hero-bg.png"}
                            alt="盈虚とパイプドリーム"
                            width={isMobile ? 1080 : 1920}
                            height={isMobile ? 1920 : 1080}
                            className="w-full h-auto object-contain"
                            priority
                            sizes="100vw"
                        />
                    </motion.div>
                )}
                {/* Subtle dark overlay to ensure text readability if needed */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            </div>

            {/* Crowdfunding Stats Overlay */}
            {isMounted && (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-6 text-center"
                >
                    <a 
                        href="#rewards" 
                        className="block group bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent/50 p-4 md:p-5 rounded-2xl transition-all duration-500 cursor-pointer shadow-2xl"
                    >
                        <div className="space-y-2">
                            <h3 className="text-white/60 text-xs md:text-sm tracking-[0.2em] font-sans uppercase mb-1">
                                クラウドファンディング実施中
                            </h3>
                            <div className="text-white font-serif tracking-widest text-sm md:text-base group-hover:text-white/90 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
                                <span>
                                    現在 <span className="text-accent font-bold text-xl md:text-2xl mx-1">{percent !== null ? percent : "--"}%</span> 達成
                                </span>
                                <span className="hidden sm:inline text-white/30">/</span>
                                <span>
                                    残り <span className="text-white font-bold text-xl md:text-2xl mx-1">{remainingDays !== null ? remainingDays : "--"}</span> 日
                                </span>
                            </div>
                        </div>
                        
                        {/* Progress Bar (Optional Visual Touch) */}
                        <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percent !== null ? Math.min(percent, 100) : 0}%` }}
                                transition={{ delay: 1.5, duration: 1.5, ease: "circOut" }}
                                className="h-full bg-accent rounded-full relative"
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50" />
                            </motion.div>
                        </div>
                    </a>
                </motion.div>
            )}

            {/* SEO Hidden Text */}
            <div className="sr-only">
                <h1>盈虚とパイプドリーム Phases of a Pipe Dream</h1>
                <p>私たちは『不要不急』の中で、夢を見た。</p>
                <p>脚本: 福井 将真 / 監督: 久高 将也</p>
                <p>映画プロジェクト始動</p>
            </div>

        </section>
    );
}
