"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { TIERS, MOTION_GALLERY_URL } from "../crowdfunding/data";
import { useCrowdfundingStatus } from "../hooks/useCrowdfundingStatus";
import CrowdfundingMatrix from "./CrowdfundingMatrix";

export default function CrowdfundingSection() {
    const isStarted = useCrowdfundingStatus();

    const handleDisabledClick = (e: React.MouseEvent) => {
        if (!isStarted) {
            e.preventDefault();
            const ev = new CustomEvent("show-toast-from-crowdfunding");
            window.dispatchEvent(ev);
        }
    };

    return (
        <section id="rewards" className="bg-background py-32 md:py-48 px-4 flex flex-col items-center overflow-hidden">
            <div className="max-w-6xl w-full space-y-16">
                
                {/* Header */}
                <div className="text-center space-y-6">
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase">
                        Rewards
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-widest font-serif text-foreground">
                        クラウドファンディング支援プラン
                    </h3>
                    <p className="text-sm md:text-base text-foreground/60 font-serif tracking-widest max-w-2xl mx-auto leading-relaxed">
                        映画の完成・上映に向けた製作資金を募っております。<br className="hidden md:block" />
                        皆様の温かいご支援を心よりお待ちしております。
                    </p>
                </div>

                {/* Cards Container: Vertical on Mobile, Horizontal Scroll on Desktop */}
                <div className="flex flex-col md:flex-row gap-6 md:overflow-x-auto md:snap-x md:snap-mandatory pb-8 md:pb-12 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="flex-none w-full md:w-[350px] lg:w-[400px] md:snap-center bg-zinc-900/50 border border-white/5 rounded-xl p-6 md:p-8 flex flex-col relative"
                        >
                            {/* Card Header */}
                            <div className="flex items-start gap-4 border-b border-white/10 pb-6 mb-6">
                                <div className="p-3 bg-black rounded-full border border-white/10 flex-shrink-0">
                                    {tier.icon}
                                </div>
                                <div className="text-left">
                                    <h4 className="text-base md:text-lg font-bold text-foreground mb-2 leading-snug">
                                        {tier.name}
                                    </h4>
                                    <p className="text-accent text-lg md:text-xl font-bold tracking-widest">
                                        ¥{tier.price}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-foreground/80 text-sm leading-relaxed tracking-wide mb-6 flex-grow">
                                {tier.description}
                            </p>

                            {/* Returns List */}
                            <div className="bg-black/50 p-4 rounded-lg border border-white/5 mb-8">
                                <h5 className="text-xs text-foreground/50 tracking-widest mb-4">特典内容</h5>
                                <ul className="space-y-3">
                                    {tier.returns.map((ret, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-foreground/80 tracking-wide leading-relaxed">
                                            <span className="text-accent flex-shrink-0 mt-0.5">•</span>
                                            <span>{ret}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                {isStarted ? (
                                    <a
                                        href={(tier as any).url || MOTION_GALLERY_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-accent text-zinc-950 transition-all duration-300 text-sm font-bold tracking-widest rounded hover:bg-white shadow-[0_0_15px_rgba(255,191,0,0.2)] hover:shadow-[0_0_20px_rgba(255,191,0,0.4)]"
                                    >
                                        支援ページへ
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleDisabledClick}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-zinc-800 text-zinc-500 transition-colors text-sm font-bold tracking-widest rounded cursor-not-allowed"
                                    >
                                        <Clock className="w-4 h-4" />
                                        2026/4/1 12:00 START
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Optional Matrix Section */}
                <div className="pt-16 md:pt-24 border-t border-white/5">
                    <div className="text-center">
                        <h4 className="text-lg md:text-xl font-bold tracking-widest font-serif text-foreground">
                            プラン特典早見表
                        </h4>
                    </div>
                    <CrowdfundingMatrix showInlineTrigger={true} />
                </div>
                
            </div>
        </section>
    );
}
