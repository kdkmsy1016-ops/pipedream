"use client";

import Image from "next/image";
import { MessageCircle, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative w-full h-[100svh] overflow-hidden bg-background">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Atmospheric Film Noir Background"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
                {/* Dark Overlay with Gradient */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 py-4 lg:p-6">
                <div className="max-w-7xl w-full h-full lg:h-auto flex flex-col lg:flex-row justify-between lg:justify-between items-center lg:items-end py-6 lg:py-0 gap-4 lg:gap-8">

                    {/* Left: Film Section */}
                    {/* Mobile: Top half, flexible height. Desktop: Left side */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:space-y-6 w-full lg:w-1/2 justify-center lg:justify-start flex-1 lg:flex-auto">
                        <div className="space-y-2 lg:space-y-4">
                            <span className="inline-block px-2 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs font-serif border border-white/30 rounded-full text-white/80 tracking-widest mb-1 lg:mb-2">
                                映画
                            </span>

                            {/* Credits: Compact on mobile */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 lg:gap-x-6 gap-y-1 text-white/90 font-serif text-sm lg:text-base tracking-widest">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] lg:text-xs text-white/50">脚本</span>
                                    <span>福井 将真</span>
                                </div>
                                <div className="hidden sm:block w-[1px] h-3 bg-white/20" />
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] lg:text-xs text-white/50">監督</span>
                                    <span>久高 将也</span>
                                </div>
                            </div>

                            <h1
                                className="font-bold font-serif text-white leading-tight tracking-tighter pt-1 lg:pt-2"
                                style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)" }}
                            >
                                盈虚と<br className="lg:hidden" />パイプドリーム
                            </h1>

                            {/* Project Announcement */}
                            <div className="pt-2 lg:pt-4 space-y-1 lg:space-y-2 font-serif">
                                <p className="text-accent font-bold tracking-widest text-sm lg:text-xl">
                                    映画プロジェクト始動
                                </p>
                                <p className="text-white/90 text-base lg:text-base tracking-wider leading-relaxed">
                                    2026年4月、クラウドファンディング開始。<br />
                                    <span className="text-white/70 text-sm lg:text-sm block lg:inline mt-1 lg:mt-0">
                                        制作の裏側や限定情報をLINEでお届けします。
                                    </span>
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://line.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 lg:px-8 lg:py-4 bg-[#06c755] text-white rounded-sm transition-all hover:bg-[#05b34c] mt-2 lg:mt-0 w-full max-w-xs lg:w-auto"
                        >
                            <MessageCircle size={16} className="lg:w-5 lg:h-5" />
                            <span className="font-bold tracking-wider text-xs lg:text-sm">LINEで応援する</span>
                        </a>
                    </div>

                    {/* Divider for Mobile (Minimal or removed to save space) */}
                    {/* <div className="w-12 h-[1px] bg-white/10 lg:hidden" /> */}

                    {/* Right: Stage Section */}
                    {/* Mobile: Bottom half. Desktop: Right side */}
                    <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-2 lg:space-y-6 w-full lg:w-1/2 justify-center lg:justify-end flex-1 lg:flex-auto">
                        <div className="space-y-2 lg:space-y-4 flex flex-col items-center lg:items-end">
                            <div className="pt-1 lg:pt-2 flex flex-col items-center lg:items-end">
                                <span className="inline-block px-2 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs font-serif border border-white/30 rounded-full text-white/80 tracking-widest mb-1 lg:mb-2">
                                    二人芝居
                                </span>
                                <h2
                                    className="font-bold font-serif text-white leading-tight tracking-tighter mb-1 lg:mb-2"
                                    style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)" }}
                                >
                                    場末の<br className="lg:hidden" />パイプドリーム
                                </h2>
                                <p className="text-accent font-bold tracking-tighter text-xs lg:text-base whitespace-nowrap font-serif">
                                    2026.4.3(Fri) - 4.5(Sun) at 下北沢 楽園
                                </p>
                            </div>
                        </div>

                        <a
                            href="#"
                            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 lg:px-8 lg:py-4 bg-white text-black rounded-sm transition-all hover:bg-accent mt-2 lg:mt-0 w-full max-w-xs lg:w-auto"
                        >
                            <Ticket size={16} className="lg:w-5 lg:h-5" />
                            <span className="font-bold tracking-wider text-xs lg:text-sm">チケット予約</span>
                        </a>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none lg:bottom-8"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: [0, 6, 0] }}
                transition={{
                    opacity: { delay: 2.5, duration: 1.0 },
                    y: { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-serif">Scroll</span>
                <div className="w-[1px] h-8 bg-white/40" />
            </motion.div>
        </section>
    );
}
