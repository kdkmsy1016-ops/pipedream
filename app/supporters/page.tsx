"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Lock, Download, FileText, PlayCircle, BookOpen, Star } from "lucide-react";
import { verifyPassword } from "./actions";

export default function SupportersPage() {
    const [tier, setTier] = useState<number>(0);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const savedTier = sessionStorage.getItem("supporters_tier");
        if (savedTier) {
            setTier(parseInt(savedTier, 10));
        }
        setIsChecking(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const authTier = await verifyPassword(passwordInput);

        if (authTier > 0) {
            sessionStorage.setItem("supporters_tier", authTier.toString());
            setTier(authTier);
            setError(false);
        } else {
            setError(true);
            setPasswordInput("");
        }
    };

    if (isChecking) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif py-32 px-6 md:px-12 relative overflow-hidden flex flex-col items-center">

            {/* Ambient Glows scaling with tier */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 ${tier > 0 ? 'bg-[#ffbf00]/10' : 'bg-[#ffbf00]/5'} blur-[120px] rounded-full pointer-events-none transition-colors duration-1000`} />
            {tier >= 4 && (
                <div className="absolute bottom-0 right-0 w-full max-w-xl h-96 bg-[#ffbf00]/5 blur-[120px] rounded-full pointer-events-none" />
            )}

            {/* Back Link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-24 left-6 md:left-12 z-20"
            >
                <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-sm tracking-widest group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK
                </Link>
            </motion.div>

            <AnimatePresence mode="wait">
                {tier === 0 ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="w-full max-w-md mx-auto mt-20 md:mt-32 space-y-12 relative z-10"
                    >
                        <div className="text-center space-y-4">
                            <Lock className="w-8 h-8 mx-auto text-[#ffbf00] opacity-80" />
                            <h1 className="text-2xl md:text-3xl tracking-[0.2em] text-[#ffbf00]">SUPPORTERS</h1>
                            <p className="text-sm text-zinc-400 tracking-widest leading-loose">
                                クラウドファンディング<br />支援者様 限定エントランス
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-2 group">
                                <label htmlFor="password" className="block text-xs text-zinc-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors text-center">
                                    合言葉（PASSWORD）
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-3 px-4 text-center text-xl focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/5 tracking-[0.3em] rounded-t-sm"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-500/80 text-xs text-center mt-4 tracking-widest"
                                    >
                                        合言葉が異なります
                                    </motion.p>
                                )}
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-12 py-3 text-sm tracking-[0.2em] text-zinc-950 bg-[#ffbf00] hover:bg-white hover:text-zinc-950 transition-colors duration-300 shadow-[0_0_15px_rgba(255,191,0,0.3)] font-bold rounded-sm"
                                >
                                    扉を開ける
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="w-full max-w-3xl mx-auto space-y-20 relative z-10 w-full"
                    >
                        {/* Header */}
                        <header className="text-center space-y-8 pt-12 md:pt-20">
                            <div className="inline-block px-4 py-1 border border-[#ffbf00]/30 rounded-full text-[#ffbf00] text-xs tracking-widest mb-4">
                                VIP TIER {tier} EXCLUSIVE
                            </div>
                            <h1 className="text-3xl md:text-4xl tracking-[0.2em] text-[#ffbf00] drop-shadow-[0_0_15px_rgba(255,191,0,0.4)]">
                                SPECIAL THANKS
                            </h1>
                            <div className="space-y-4">
                                <p className="text-zinc-200 text-lg tracking-widest">
                                    支援者様、ご来店ありがとうございます。
                                </p>
                                <p className="text-zinc-400 text-sm md:text-base leading-loose tracking-wide max-w-2xl mx-auto px-4">
                                    『盈虚とパイプドリーム』『場末のパイプドリーム』を<br className="md:hidden" />ご支援いただき、心より感謝申し上げます。<br />
                                    限定コンテンツをゆっくりとお愉しみください。
                                </p>
                            </div>
                        </header>

                        <div className="space-y-12">
                            {/* Tier 5 Content */}
                            {tier >= 5 && (
                                <section className="bg-gradient-to-br from-[#ffbf00]/10 to-transparent border border-[#ffbf00]/30 p-8 rounded-sm shadow-[0_0_30px_rgba(255,191,0,0.1)] space-y-6">
                                    <div className="flex items-center gap-3 border-b border-[#ffbf00]/30 pb-4">
                                        <Star className="w-5 h-5 text-[#ffbf00]" />
                                        <h2 className="text-xl text-[#ffbf00] tracking-widest">
                                            映画『盈虚とパイプドリーム』先行試写
                                        </h2>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-loose">
                                        公開前の本編映像を特別な形でお届けいたします。
                                    </p>
                                    <div className="aspect-video bg-black flex items-center justify-center border border-zinc-800 rounded-sm relative group overflow-hidden">
                                        <PlayCircle className="w-12 h-12 text-zinc-600 group-hover:text-[#ffbf00] transition-colors" />
                                        <span className="absolute bottom-4 right-4 text-xs tracking-widest text-zinc-500">※動画準備中（後日URL紐付け）</span>
                                    </div>
                                </section>
                            )}

                            {/* Tier 4 Content */}
                            {tier >= 4 && (
                                <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                                        <FileText className="w-5 h-5 text-zinc-400" />
                                        <h2 className="text-xl text-zinc-200 tracking-widest">
                                            Special Thanks お名前掲載確認
                                        </h2>
                                    </div>
                                    <div className="p-6 bg-zinc-950 border border-zinc-800 text-center rounded-sm">
                                        <p className="text-zinc-400 text-sm leading-loose mb-4">
                                            映画のエンドロールおよびパンフレットに掲載される<br className="hidden md:block" />
                                            皆様のお名前（確定版）はこちらからご確認いただけます。
                                        </p>
                                        <button className="text-[#ffbf00] text-sm tracking-widest underline underline-offset-4 hover:text-white transition-colors">
                                            掲載名リストを確認する
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* Tier 3 Content */}
                            {tier >= 3 && (
                                <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                                        <PlayCircle className="w-5 h-5 text-zinc-400" />
                                        <h2 className="text-xl text-zinc-200 tracking-widest">
                                            舞台『場末のパイプドリーム』本編アーカイブ
                                        </h2>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-loose">
                                        上演された舞台映像のアーカイブ視聴リンクです。
                                    </p>
                                    <div className="aspect-video bg-black flex items-center justify-center border border-zinc-800 rounded-sm relative group overflow-hidden">
                                        <PlayCircle className="w-12 h-12 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                        <span className="absolute bottom-4 right-4 text-xs tracking-widest text-zinc-500">※上演後アップデート</span>
                                    </div>
                                </section>
                            )}

                            {/* Tier 2 Content */}
                            {tier >= 2 && (
                                <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                                        <BookOpen className="w-5 h-5 text-zinc-400" />
                                        <h2 className="text-xl text-zinc-200 tracking-widest">
                                            脚本PDF & デジタルフォトブック
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <a href="#" className="flex flex-col items-center justify-center p-8 bg-black/50 border border-zinc-800 hover:border-[#ffbf00]/50 transition-colors rounded-sm group">
                                            <FileText className="w-8 h-8 text-zinc-500 group-hover:text-[#ffbf00] mb-3 transition-colors" />
                                            <span className="text-sm tracking-widest text-zinc-300 group-hover:text-white transition-colors">脚本 PDF版</span>
                                        </a>
                                        <a href="#" className="flex flex-col items-center justify-center p-8 bg-black/50 border border-zinc-800 hover:border-[#ffbf00]/50 transition-colors rounded-sm group">
                                            <BookOpen className="w-8 h-8 text-zinc-500 group-hover:text-[#ffbf00] mb-3 transition-colors" />
                                            <span className="text-sm tracking-widest text-zinc-300 group-hover:text-white transition-colors">フォトブック PDF版</span>
                                        </a>
                                    </div>
                                </section>
                            )}

                            {/* Tier 1 Content */}
                            {tier >= 1 && (
                                <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                                        <Download className="w-5 h-5 text-zinc-400" />
                                        <h2 className="text-xl text-zinc-200 tracking-widest">
                                            限定デジタルカード
                                        </h2>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-loose">
                                        本プロジェクト限定のキービジュアルをあしらったデジタルカードです。
                                    </p>
                                    <div className="flex flex-col items-center bg-black/50 border border-zinc-800 p-6 rounded-sm">
                                        <div className="w-full max-w-sm aspect-[4/3] bg-zinc-800 flex items-center justify-center mb-6">
                                            <span className="text-zinc-600 text-xs tracking-widest">画像プレースホルダー</span>
                                        </div>
                                        <button className="flex items-center gap-2 px-6 py-2 border border-zinc-600 text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-colors text-sm tracking-widest rounded-sm">
                                            <Download className="w-4 h-4" />
                                            ダウンロード
                                        </button>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer decorative line */}
                        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffbf00]/30 to-transparent mx-auto mt-32" />

                        <div className="text-center pt-8 pb-20">
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem("supporters_tier");
                                    setTier(0);
                                }}
                                className="text-zinc-600 hover:text-zinc-400 text-xs tracking-widest transition-colors underline underline-offset-4"
                            >
                                ログアウト
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
