"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, Clock, Check, ExternalLink } from "lucide-react";
import { TIERS, MATRIX_FEATURES, MOTION_GALLERY_URL } from "../crowdfunding/data";
import { useCrowdfundingStatus } from "../hooks/useCrowdfundingStatus";

interface CrowdfundingMatrixProps {
    showInlineTrigger?: boolean;
}

export default function CrowdfundingMatrix({ showInlineTrigger = false }: CrowdfundingMatrixProps) {
    const [isMatrixOpen, setIsMatrixOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const isStarted = useCrowdfundingStatus();

    const handleDisabledClick = (e: React.MouseEvent) => {
        if (!isStarted) {
            e.preventDefault();
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <>
            {/* Optional Inline Trigger Button (For pages like /guide) */}
            {showInlineTrigger && (
                <div className="w-full text-center py-12 box-border">
                    <button
                        onClick={() => setIsMatrixOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ffbf00] text-zinc-950 font-bold tracking-widest text-sm md:text-base rounded-sm hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,191,0,0.3)]"
                    >
                        <List className="w-5 h-5" />
                        プランを比較して支援する
                    </button>
                </div>
            )}

            {/* Global Floating Action Button (FAB) for Matrix */}
            <button
                onClick={() => setIsMatrixOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-[#ffbf00] text-zinc-950 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-[0_0_20px_rgba(255,191,0,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-0.5 font-bold tracking-widest leading-none pointer-events-auto"
            >
                <span className="text-[10px] md:text-xs">各プランの</span>
                <span className="text-sm md:text-base flex items-center gap-1 mt-0.5">
                    <List className="w-3 h-3 md:w-4 md:h-4" />
                    比較
                </span>
            </button>

            {/* Matrix Modal */}
            {isMatrixOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 box-border">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsMatrixOpen(false)}
                    />
                    <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-[#ffbf00] tracking-widest">特典比較一覧表</h3>
                                <p className="text-zinc-500 text-xs mt-1">横にスクロールして全プランをご覧いただけます</p>
                            </div>
                            <button
                                onClick={() => setIsMatrixOpen(false)}
                                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="w-full flex-1 overflow-auto bg-zinc-950">
                            <table className="w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                                <thead className="bg-zinc-900 sticky top-0 z-20 shadow-md">
                                    <tr>
                                        <th className="p-3 md:p-4 border-b border-zinc-800 font-bold tracking-wider text-zinc-400 sticky left-0 z-30 bg-zinc-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                                            特典項目
                                        </th>
                                        {TIERS.map((tier) => (
                                            <th key={tier.id} className="p-3 md:p-4 border-b border-zinc-800 text-center min-w-[120px]">
                                                <div className="text-[#ffbf00] font-bold">プラン {String.fromCharCode(64 + tier.id)}</div>
                                                <div className="text-zinc-300 text-[10px] md:text-xs">¥{tier.price}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {MATRIX_FEATURES.map((feature, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-900/50 transition-colors border-b border-zinc-800/50">
                                            <td className="p-3 md:p-4 text-zinc-300 tracking-wide sticky left-0 z-10 bg-zinc-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                                                {feature.name}
                                            </td>
                                            {TIERS.map((tier) => {
                                                const hasFeature = feature.tiers.includes(tier.id);
                                                return (
                                                    <td key={tier.id} className="p-3 md:p-4 text-center">
                                                        {hasFeature ? (
                                                            <Check className="w-4 h-4 text-[#ffbf00] mx-auto" />
                                                        ) : (
                                                            <span className="text-zinc-700">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer CTA */}
                        <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0 text-center">
                            {isStarted ? (
                                <a
                                    href={MOTION_GALLERY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#ffbf00] text-zinc-950 hover:bg-white transition-colors text-xs md:text-sm font-bold tracking-widest rounded-sm shadow-[0_0_15px_rgba(255,191,0,0.3)]"
                                >
                                    MotionGalleryで支援する
                                    <ExternalLink className="w-4 h-4 ml-1" />
                                </a>
                            ) : (
                                <a
                                    href="#"
                                    onClick={handleDisabledClick}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 text-zinc-400 border border-zinc-700 transition-colors text-xs font-bold tracking-widest rounded-sm cursor-not-allowed"
                                >
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    2026/4/1 12:00 START
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Disabled Toast Notification */}
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
        </>
    );
}
