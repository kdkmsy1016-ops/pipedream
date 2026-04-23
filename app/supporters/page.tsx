"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Lock, Download, FileText, PlayCircle, BookOpen, Star, ImageIcon, Mail } from "lucide-react";

// Google Drive File IDs
const MOVIE_KV_ID = "1SPZleKgUnS3OG277P4KorTrvPGrxRJo3";
const STAGE_KV_ID = "15jjVBQ4LBGC2Va7CxXrxzpMwwrjh2mIq";
const SCRIPT_PDF_ID = ""; // To be filled later
const PHOTO_BOOK_ID = ""; // To be filled later

function DriveDownloadCard({
    fileId,
    title,
    fallbackText,
    icon: Icon
}: {
    fileId: string;
    title: string;
    fallbackText: string;
    icon?: React.ElementType;
}) {
    const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : "#";
    const thumbnailUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200` : "";

    return (
        <a
            href={downloadUrl}
            target={fileId ? "_blank" : "_self"}
            rel={fileId ? "noopener noreferrer" : ""}
            className={`flex flex-col items-center gap-4 w-full group ${!fileId && "opacity-60 pointer-events-none cursor-not-allowed"}`}
        >
            <div className="w-full max-w-[280px] md:max-w-sm aspect-[3/4] relative rounded-lg overflow-hidden border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(255,191,0,0.15)] active:translate-y-1 active:shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-all duration-300 bg-zinc-950 flex items-center justify-center">

                {/* Fallback Placeholder (Always behind the image) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0 bg-zinc-900">
                    {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 mb-4" />}
                    <span className="text-zinc-500 text-xs md:text-sm tracking-widest leading-loose whitespace-pre-line box-border">
                        {fallbackText}
                    </span>
                </div>

                {/* Drive Thumbnail Image */}
                {fileId && (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover relative z-10 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500 pointer-events-auto"
                        unoptimized
                    />
                )}

                {/* Gradient Overlay for Text Readability */}
                {fileId && (
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
                )}
            </div>

            {/* Download Button (below the card) */}
            <div className="flex items-center justify-center gap-2 px-6 py-3 border border-zinc-600 text-zinc-300 group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors text-xs tracking-widest rounded-sm w-full max-w-[280px]">
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{fileId ? "ダウンロード" : "準備中"}</span>
            </div>
        </a>
    );
}


export default function SupportersPage() {
    const [tier, setTier] = useState<number>(0);
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
                body: JSON.stringify({ email: passwordInput })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // 2. Set new verified tier
                sessionStorage.setItem("supporters_tier", String(data.tier));
                setTier(Number(data.tier));
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

                        <form onSubmit={handleLogin} className="space-y-8 w-full box-border">
                            <div className="space-y-2 group w-full box-border relative">
                                <label htmlFor="email" className="block text-xs text-zinc-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors text-center">
                                    メールアドレスを入力してください
                                </label>
                                <div className="relative flex items-center justify-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-[#ffbf00] transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-4 pl-12 pr-4 text-center text-sm md:text-lg focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/20 tracking-widest rounded-t-sm"
                                        placeholder="your@email.com"
                                        autoFocus
                                        required
                                    />
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
                            </div>

                            <div className="text-center w-full box-border">
                                <button
                                    type="submit"
                                    disabled={isLoading || !passwordInput}
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
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="w-full max-w-full md:max-w-3xl mx-auto space-y-16 md:space-y-20 relative z-10 px-4 box-border overflow-hidden"
                    >
                        {/* Header */}
                        <header className="w-full max-w-full text-center space-y-6 md:space-y-8 pt-4 md:pt-12 box-border overflow-hidden">
                            <div className="inline-block px-4 py-1 border border-[#ffbf00]/30 rounded-full text-[#ffbf00] text-xs tracking-widest mb-4 whitespace-normal break-words max-w-full">
                                VIP TIER {tier} EXCLUSIVE
                            </div>
                            <h1 className="text-2xl md:text-4xl tracking-[0.2em] text-[#ffbf00] drop-shadow-[0_0_15px_rgba(255,191,0,0.4)] whitespace-pre-line break-words max-w-full overflow-hidden">
                                SPECIAL THANKS
                            </h1>
                            <div className="w-full max-w-full space-y-4 box-border overflow-hidden">
                                <p className="text-zinc-200 text-base md:text-lg tracking-widest whitespace-pre-line break-words">
                                    支援者様、ご来店ありがとうございます。
                                </p>
                                <p className="text-zinc-400 text-sm leading-relaxed md:leading-loose tracking-wide w-full max-w-full mx-auto whitespace-pre-line break-words">
                                    『盈虚とパイプドリーム』『場末のパイプドリーム』を<br className="md:hidden block" />ご支援いただき、心より感謝申し上げます。<br />
                                    限定コンテンツをゆっくりとお愉しみください。
                                </p>
                            </div>
                        </header>

                        <div className="w-full max-w-full space-y-8 md:space-y-12 box-border overflow-hidden">
                            {/* Tier 5 Content */}
                            {tier >= 5 && (
                                <section className="w-full max-w-full box-border bg-gradient-to-br from-[#ffbf00]/10 to-transparent border border-[#ffbf00]/30 p-5 md:p-8 rounded-sm shadow-[0_0_30px_rgba(255,191,0,0.1)] space-y-4 md:space-y-6 overflow-hidden">
                                    <div className="w-full flex items-center gap-3 border-b border-[#ffbf00]/30 pb-3 md:pb-4 overflow-hidden">
                                        <Star className="w-4 h-4 md:w-5 md:h-5 text-[#ffbf00] flex-shrink-0" />
                                        <h2 className="text-base md:text-xl text-[#ffbf00] tracking-widest break-words whitespace-pre-line">
                                            映画『盈虚とパイプドリーム』先行試写
                                        </h2>
                                    </div>
                                    <p className="w-full text-zinc-300 text-xs md:text-sm leading-relaxed md:leading-loose break-words whitespace-pre-line text-left">
                                        公開前の本編映像を特別な形でお届けいたします。
                                    </p>
                                    <div className="w-full max-w-full aspect-video bg-black flex items-center justify-center border border-zinc-800 rounded-sm relative group overflow-hidden box-border">
                                        <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-zinc-600 group-hover:text-[#ffbf00] transition-colors" />
                                        <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[10px] md:text-xs tracking-widest text-zinc-500 text-right whitespace-pre-line break-words max-w-[80%]">※動画準備中（後日URL紐付け）</span>
                                    </div>
                                </section>
                            )}

                            {/* Tier 4 Content */}
                            {tier >= 4 && (
                                <section className="w-full max-w-full box-border bg-zinc-900 border border-zinc-800 p-5 md:p-8 rounded-sm space-y-4 md:space-y-6 overflow-hidden">
                                    <div className="w-full flex items-center gap-3 border-b border-zinc-800 pb-3 md:pb-4 overflow-hidden">
                                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 flex-shrink-0" />
                                        <h2 className="text-base md:text-xl text-zinc-200 tracking-widest break-words whitespace-pre-line">
                                            Special Thanks お名前掲載確認
                                        </h2>
                                    </div>
                                    <div className="w-full max-w-full p-4 md:p-6 bg-zinc-950 border border-zinc-800 text-center rounded-sm box-border overflow-hidden">
                                        <p className="w-full max-w-full text-zinc-400 text-xs md:text-sm leading-relaxed md:leading-loose mb-4 break-words whitespace-pre-line">
                                            映画のエンドロールおよびパンフレットに掲載される<br className="md:hidden block" />皆様のお名前（確定版）はこちらからご確認ください。
                                        </p>
                                        <button className="text-[#ffbf00] text-xs md:text-sm tracking-widest underline underline-offset-4 hover:text-white transition-colors break-words max-w-full">
                                            掲載名リストを確認する
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* Tier 3 Content */}
                            {tier >= 3 && (
                                <section className="w-full max-w-full box-border bg-zinc-900 border border-zinc-800 p-5 md:p-8 rounded-sm space-y-4 md:space-y-6 overflow-hidden">
                                    <div className="w-full flex items-center gap-3 border-b border-zinc-800 pb-3 md:pb-4 overflow-hidden">
                                        <PlayCircle className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 flex-shrink-0" />
                                        <h2 className="text-base md:text-xl text-zinc-200 tracking-widest break-words whitespace-pre-line">
                                            舞台『場末のパイプドリーム』本編アーカイブ
                                        </h2>
                                    </div>
                                    <p className="w-full text-zinc-300 text-xs md:text-sm leading-relaxed md:leading-loose break-words whitespace-pre-line text-left">
                                        上演された舞台映像のアーカイブ視聴リンクです。
                                    </p>
                                    <div className="w-full max-w-full aspect-video bg-black flex items-center justify-center border border-zinc-800 rounded-sm relative group overflow-hidden box-border">
                                        <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                        <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[10px] md:text-xs tracking-widest text-zinc-500 text-right whitespace-pre-line break-words max-w-[80%]">※上演後アップデート</span>
                                    </div>
                                </section>
                            )}

                            {/* Tier 2 Content */}
                            {tier >= 2 && (
                                <section className="w-full max-w-full box-border bg-zinc-900 border border-zinc-800 p-5 md:p-8 rounded-sm space-y-4 md:space-y-6 overflow-hidden">
                                    <div className="w-full flex items-center gap-3 border-b border-zinc-800 pb-3 md:pb-4 overflow-hidden">
                                        <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 flex-shrink-0" />
                                        <h2 className="text-base md:text-xl text-zinc-200 tracking-widest break-words whitespace-pre-line">
                                            脚本PDF & デジタルフォトブック
                                        </h2>
                                    </div>
                                    <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 box-border overflow-hidden">
                                        <DriveDownloadCard
                                            fileId={SCRIPT_PDF_ID}
                                            title="脚本 PDF版"
                                            fallbackText="脚本 PDFデータ\n（準備中）"
                                            icon={FileText}
                                        />
                                        <DriveDownloadCard
                                            fileId={PHOTO_BOOK_ID}
                                            title="フォトブック PDF版"
                                            fallbackText="デジタルフォトブック\n（準備中）"
                                            icon={BookOpen}
                                        />
                                    </div>
                                </section>
                            )}

                            {/* Tier 1 Content */}
                            {tier >= 1 && (
                                <section className="w-full max-w-full box-border bg-zinc-900 border border-zinc-800 p-5 md:p-8 rounded-sm space-y-4 md:space-y-6 overflow-hidden">
                                    <div className="w-full flex items-center gap-3 border-b border-zinc-800 pb-3 md:pb-4 overflow-hidden">
                                        <Download className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 flex-shrink-0" />
                                        <h2 className="text-base md:text-xl text-zinc-200 tracking-widest break-words whitespace-pre-line">
                                            限定デジタルカード
                                        </h2>
                                    </div>
                                    <p className="w-full text-zinc-300 text-xs md:text-sm leading-relaxed md:leading-loose break-words whitespace-pre-line text-left">
                                        本プロジェクト限定のキービジュアルをあしらったデジタルカードです。<br />
                                        画像を長押し（PCは右クリック）、または下のボタンから保存いただけます。
                                    </p>

                                    <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 box-border overflow-hidden">
                                        <DriveDownloadCard
                                            fileId={MOVIE_KV_ID}
                                            title="映画『盈虚とパイプドリーム』キービジュアル"
                                            fallbackText="映画キービジュアル\n（プレースホルダー）"
                                            icon={ImageIcon}
                                        />
                                        <DriveDownloadCard
                                            fileId={STAGE_KV_ID}
                                            title="舞台『場末のパイプドリーム』キービジュアル"
                                            fallbackText="舞台キービジュアル\n（プレースホルダー）"
                                            icon={ImageIcon}
                                        />
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer decorative line */}
                        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffbf00]/30 to-transparent mx-auto mt-20 md:mt-32 max-w-full box-border overflow-hidden" />

                        <div className="w-full max-w-full text-center pt-8 pb-12 box-border overflow-hidden">
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
