"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

const PASSWORD = "pipedream2026";

export default function SupportersPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const auth = sessionStorage.getItem("supporters_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === PASSWORD) {
            sessionStorage.setItem("supporters_auth", "true");
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPasswordInput("");
        }
    };

    if (isChecking) {
        return <div className="min-h-screen bg-black" />;
    }

    return (
        <main className="min-h-screen bg-black text-white font-serif py-32 px-6 md:px-12 relative overflow-hidden flex flex-col items-center min-h-screen">

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-[#ffbf00]/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Back Link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-24 left-6 md:left-12 z-20"
            >
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-[#ffbf00] transition-colors text-sm tracking-widest group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK
                </Link>
            </motion.div>

            <AnimatePresence mode="wait">
                {!isAuthenticated ? (
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
                            <p className="text-sm text-gray-400 tracking-widest">
                                クラウドファンディング支援者限定ページ
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-2 group">
                                <label htmlFor="password" className="block text-xs text-gray-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors text-center">
                                    PASSWORD
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full bg-black/50 border-b border-[#ffbf00]/30 py-3 px-4 text-center text-xl focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/10 tracking-[0.3em]"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-500 text-xs text-center mt-4 tracking-widest"
                                    >
                                        パスワードが異なります
                                    </motion.p>
                                )}
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-12 py-3 text-sm tracking-[0.2em] text-black bg-[#ffbf00] hover:bg-white hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(255,191,0,0.3)] font-bold"
                                >
                                    ENTER
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
                        className="w-full max-w-4xl mx-auto space-y-20 relative z-10"
                    >
                        {/* Header */}
                        <header className="text-center space-y-6 pt-12 md:pt-20">
                            <h1 className="text-3xl md:text-4xl tracking-[0.2em] text-[#ffbf00] drop-shadow-[0_0_10px_rgba(255,191,0,0.3)]">SPECIAL THANKS</h1>
                            <p className="text-gray-300 text-sm md:text-base leading-loose tracking-wide max-w-2xl mx-auto px-4">
                                『盈虚とパイプドリーム』『場末のパイプドリーム』を<br className="md:hidden" />ご支援いただき、心より感謝申し上げます。<br />
                                皆様の応援が、この作品の幕を上げる大きな力となりました。
                            </p>
                        </header>

                        {/* Restricted Content Area */}
                        <div className="space-y-16">

                            {/* Message Section */}
                            <section className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-sm shadow-[0_0_30px_rgba(255,191,0,0.05)] text-center space-y-8">
                                <h2 className="text-xl text-[#ffbf00] tracking-widest border-b border-[#ffbf00]/30 pb-4 inline-block mx-auto">
                                    限定メッセージ
                                </h2>
                                <div className="space-y-6 text-gray-300 leading-loose text-sm md:text-base px-2 md:px-8 text-left md:text-center">
                                    <p>
                                        （ここに監督やキャストからの限定メッセージが入ります）
                                    </p>
                                    <p>
                                        スナック「さくらみち」の世界が、いよいよ現実の空間へと立ち現れようとしています。
                                        台本の推敲、美術の打ち合わせ、そして稽古場での熱気。
                                        そのすべてを、ご支援いただいた皆様に一番にお届けしたいと思っています。
                                    </p>
                                </div>
                            </section>

                            {/* Gallery Section Placeholder */}
                            <section className="space-y-8 text-center">
                                <h2 className="text-xl text-white tracking-widest border-b border-white/30 pb-4 inline-block mx-auto">
                                    Making Gallery
                                </h2>
                                <p className="text-gray-500 text-sm tracking-widest">近日公開予定</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
                                    {/* Placeholders */}
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div key={item} className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                                            <span className="text-[#ffbf00]/50 tracking-widest text-xs group-hover:text-[#ffbf00] transition-colors">PHOTO {item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Footer decorative line */}
                        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffbf00]/30 to-transparent mx-auto mt-32" />

                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
