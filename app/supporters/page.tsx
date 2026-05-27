"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Lock, Phone } from "lucide-react";

export default function SupportersPage() {
    const [tier, setTier] = useState<number>(0);
    const [phoneInput, setPhoneInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedTier = sessionStorage.getItem("supporters_tier");
        if (savedTier) {
            setTier(parseInt(savedTier, 10));
        }
        setIsChecking(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // 1. Clear old storage traces immediately to prevent cache bugs
        sessionStorage.removeItem("supporters_tier");
        localStorage.removeItem("supporters_tier"); // Also clear local storage just to be safe

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
                body: JSON.stringify({ phone: phoneInput, password: passwordInput })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // 2. Set new verified tier
                sessionStorage.setItem("supporters_tier", String(data.tier));
                setTier(Number(data.tier));
                setPhoneInput("");
                setPasswordInput("");
            } else {
                setError(data.message || "認証に失敗しました。");
            }
        } catch (err) {
            console.error(err);
            setError("サーバー通信エラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("supporters_tier");
        localStorage.removeItem("supporters_tier");
        setTier(0);
        setPhoneInput("");
        setPasswordInput("");
        setError(null);
    };

    if (isChecking) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif relative overflow-x-hidden w-full max-w-full box-border pb-24">

            {/* Ambient Glows scaling with tier */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden box-border">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 md:w-full md:max-w-3xl md:h-96 ${tier > 0 ? 'bg-[#ffbf00]/10' : 'bg-[#ffbf00]/5'} blur-[100px] md:blur-[120px] rounded-full transform-gpu transition-colors duration-1000`} />
                {tier >= 4 && (
                    <div className="absolute bottom-0 right-0 w-64 h-64 md:w-full md:max-w-xl md:h-96 bg-[#ffbf00]/5 blur-[100px] md:blur-[120px] rounded-full transform-gpu" />
                )}
            </div>

            {/* Back Button (Fixed & Safe Area) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-6 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none box-border"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-sm tracking-widest group pointer-events-auto">
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
                        className="w-full max-w-md mx-auto space-y-12 relative z-10 px-4 mt-8 md:mt-20 box-border"
                    >
                        <div className="text-center space-y-4">
                            <Lock className="w-8 h-8 mx-auto text-[#ffbf00] opacity-80" />
                            <h1 className="text-2xl md:text-3xl tracking-[0.2em] text-[#ffbf00]">SUPPORTERS</h1>
                            <p className="text-sm text-zinc-400 tracking-widest leading-loose whitespace-pre-line break-words">
                                クラウドファンディング<br />支援者様 限定エントランス
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 w-full box-border">
                            <div className="space-y-4 w-full box-border">
                                <div className="space-y-2 group w-full box-border relative">
                                    <label htmlFor="phone" className="block text-xs text-zinc-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors text-center">
                                        電話番号を入力してください
                                    </label>
                                    <div className="relative flex items-center justify-center">
                                        <Phone className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-[#ffbf00] transition-colors" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phoneInput}
                                            onChange={(e) => setPhoneInput(e.target.value)}
                                            className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-4 pl-12 pr-4 text-center text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/20 tracking-widest rounded-t-sm"
                                            placeholder="090-1234-5678"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group w-full box-border relative">
                                    <label htmlFor="password" className="block text-xs text-zinc-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors text-center">
                                        共通アクセスキーを入力してください
                                    </label>
                                    <div className="relative flex items-center justify-center">
                                        <Lock className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-[#ffbf00] transition-colors" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-4 pl-12 pr-4 text-center text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/20 tracking-widest rounded-t-sm"
                                            placeholder="共通アクセスキー"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500/90 text-xs md:text-sm text-center mt-4 tracking-widest bg-red-500/10 p-3 rounded"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <div className="text-center w-full box-border pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || !phoneInput || !passwordInput}
                                    className="w-full sm:w-auto px-12 py-3 text-sm tracking-[0.2em] text-zinc-950 bg-[#ffbf00] hover:bg-white hover:text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-[0_0_15px_rgba(255,191,0,0.3)] font-bold rounded-sm box-border flex items-center justify-center gap-2 mx-auto"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                                    ) : (
                                        "入店する"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="coming-soon"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="w-full max-w-md mx-auto space-y-12 relative z-10 px-4 mt-8 md:mt-20 box-border text-center"
                    >
                        <div className="space-y-6">
                            <p className="text-sm tracking-[0.3em] text-zinc-300 uppercase">
                                Supporters Exclusive
                            </p>
                            <p className="text-xs tracking-widest text-[#ffbf00] uppercase">
                                — Coming Soon —
                            </p>
                            <p className="text-sm md:text-base tracking-wider text-zinc-400 leading-relaxed font-serif break-words whitespace-pre-line">
                                サポーター限定コンテンツの公開まで、今しばらくお待ちください。<br />
                                配信が開始されましたら、こちらの画面からご覧いただけるようになります。
                            </p>
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={handleLogout}
                                className="text-zinc-600 hover:text-zinc-400 text-xs md:text-sm tracking-widest transition-colors underline underline-offset-4 p-4 inline-block"
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
