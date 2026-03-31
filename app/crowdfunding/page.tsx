"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ExternalLink, Gift, FileText, Video, PlayCircle, Users, Image as ImageIcon, Ticket, PartyPopper, Check, List, X, Clock } from "lucide-react";

import { TIERS, MOTION_GALLERY_URL } from "./data";
import CrowdfundingMatrix from "../components/CrowdfundingMatrix";

export default function CrowdfundingPage() {
    const handleDisabledClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Disabling logic is now partially inside matrix, but we keep this handler for the 
        // inline buttons here on the page layout.
        const ev = new CustomEvent("show-toast-from-crowdfunding");
        window.dispatchEvent(ev);
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif w-full max-w-full box-border pb-24 relative overflow-x-hidden">

            {/* Top Back Button Area - Completely static, independent block at the very top */}
            <div className="w-full box-border px-4 py-8 bg-zinc-950 border-b border-zinc-900">
                <div className="w-full max-w-4xl mx-auto flex">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-sm tracking-widest font-bold">
                        <ChevronLeft className="w-5 h-5" />
                        BACK TO HOME
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-4xl mx-auto pt-10 px-4 box-border space-y-16">

                {/* Header */}
                <header className="w-full text-center space-y-6 box-border">
                    <div className="inline-block px-4 py-2 border border-[#8b0000]/50 bg-[#8b0000]/10 rounded border text-[#ffbf00] tracking-widest text-xs box-border">
                        MotionGallery プロジェクト
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#ffbf00] leading-snug whitespace-pre-line box-border break-words">
                        スナック「さくらみち」<br />
                        <span className="text-xl md:text-3xl text-white mt-2 block">映画化応援プロジェクト</span>
                    </h1>

                    <p className="text-sm md:text-base font-bold text-[#ffbf00] tracking-widest mt-2 box-border">
                        クラウドファンディング実施中<br className="md:hidden block" />
                        <span className="block mt-1 text-zinc-300 font-normal">2026/4/1 〜 2026/6/1</span>
                    </p>

                    <p className="text-zinc-400 tracking-wide text-xs md:text-sm leading-relaxed whitespace-pre-line box-border break-words">
                        実在の場所から生まれる、虚実皮膜の物語。<br />
                        映画と舞台をまたにかけるこの挑戦を、<br className="md:hidden block" />ぜひ皆様と一緒に実現させてください。
                    </p>

                    <div className="pt-4 w-full box-border flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link
                            href="/guide"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#ffbf00] text-zinc-950 transition-colors rounded font-bold tracking-widest text-sm box-border hover:bg-white shadow-[0_0_15px_rgba(255,191,0,0.3)]"
                        >
                            <FileText className="w-5 h-5 flex-shrink-0" />
                            <span className="whitespace-pre-line break-words">初めての方へ：支援の流れを詳しく見る</span>
                        </Link>
                    </div>

                    <div className="pt-2 w-full box-border flex justify-center">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("tiers-list")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-zinc-800 text-zinc-400 border border-zinc-700 transition-colors rounded font-bold tracking-widest text-sm box-border hover:bg-zinc-700 hover:text-white"
                        >
                            <span className="whitespace-pre-line break-words">リターン（特典）を直接見る</span>
                        </a>
                    </div>
                </header>

                <div className="w-full h-px bg-zinc-800 my-8 box-border" />

                {/* Tiers List */}
                <section id="tiers-list" className="w-full space-y-8 box-border">
                    <div className="w-full text-center space-y-2 mb-6 box-border">
                        <h2 className="text-xl font-bold text-[#ffbf00] tracking-widest whitespace-pre-line break-words">リターンメニュー</h2>
                        <p className="text-zinc-500 text-xs tracking-widest whitespace-pre-line break-words">お好きなプランをお選びください</p>
                    </div>

                    <div className="w-full space-y-6 box-border">
                        {TIERS.map((tier) => (
                            <div
                                key={tier.id}
                                className={`w-full box-border bg-zinc-900 border ${tier.id >= 4 ? 'border-[#ffbf00]/50' : 'border-zinc-800'} p-5 rounded-md relative`}
                            >
                                <div className="w-full flex items-start gap-4 border-b border-zinc-800 pb-4 mb-4 box-border">
                                    <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800 flex-shrink-0">
                                        {tier.icon}
                                    </div>
                                    <div className="w-full box-border text-left">
                                        <h3 className="text-base md:text-xl font-bold text-white mb-2 leading-snug whitespace-pre-line break-words">
                                            {tier.name}
                                        </h3>
                                        <p className="text-[#ffbf00] text-base md:text-lg font-bold tracking-widest">
                                            ¥{tier.price}
                                        </p>
                                    </div>
                                </div>

                                <p className="w-full text-zinc-300 text-sm leading-relaxed tracking-wide whitespace-pre-line break-words mb-4 box-border">
                                    {tier.description}
                                </p>

                                <div className="w-full bg-zinc-950/80 p-4 rounded border border-zinc-900 box-border mb-6">
                                    <h4 className="text-xs text-zinc-500 tracking-widest mb-3 whitespace-pre-line break-words">特典内容</h4>
                                    <ul className="w-full space-y-3 box-border">
                                        {tier.returns.map((ret, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 tracking-wide leading-relaxed whitespace-pre-line break-words box-border">
                                                <span className="text-[#ffbf00] flex-shrink-0">•</span>
                                                <span className="w-full">{ret}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-full box-border">
                                    <a
                                        href="#"
                                        onClick={handleDisabledClick}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-800 text-zinc-500 transition-colors text-sm font-bold tracking-widest rounded box-border cursor-not-allowed"
                                        data-future-href={MOTION_GALLERY_URL}
                                    >
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        <span className="whitespace-pre-line break-words">2026/4/1 12:00 START</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-800 my-10 box-border" />

                {/* Bottom CTA */}
                <div className="w-full text-center space-y-6 box-border pb-10">
                    <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest leading-relaxed whitespace-pre-line break-words">
                        皆様のご来店、<br className="md:hidden block" />心よりお待ちしております
                    </h2>
                    <div className="w-full box-border flex justify-center">
                        <a
                            href="#"
                            onClick={handleDisabledClick}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 text-zinc-400 border border-zinc-700 transition-colors rounded font-bold tracking-widest text-sm box-border cursor-not-allowed"
                            data-future-href={MOTION_GALLERY_URL}
                        >
                            <Clock className="w-5 h-5 flex-shrink-0" />
                            <span className="whitespace-pre-line break-words">2026/4/1 12:00 START</span>
                        </a>
                    </div>
                </div>

            </div>

            {/* Extracted Crowdfunding Matrix (provides both FAB & Modal & Toast) */}
            <CrowdfundingMatrix showInlineTrigger={false} />
            
            {/* Disabled Toast Notification for Inline buttons */}
            <ToastListener />
        </main>
    );
}

// Simple wrapper component to listen to custom events from inline buttons 
// and show the disabled toast, so we don't have to rewrite the entire tree context.
function ToastListener() {
    const [showToast, setShowToast] = useState(false);

    if (typeof window !== "undefined") {
        window.addEventListener("show-toast-from-crowdfunding", () => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        });
    }

    return (
        <AnimatePresence>
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-32 md:bottom-32 left-1/2 -translate-x-1/2 z-[60] bg-zinc-800 text-white px-6 py-3 rounded-full shadow-lg border border-zinc-700 flex items-center gap-3 text-sm tracking-widest whitespace-nowrap"
                >
                    <Clock className="w-4 h-4 text-[#ffbf00]" />
                    <span>開始までお待ちください</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
