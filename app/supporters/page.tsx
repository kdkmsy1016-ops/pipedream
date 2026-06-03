"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Lock, Download, FileText, PlayCircle, BookOpen, Star, ImageIcon, Phone } from "lucide-react";

// Google Drive File IDs
const MOVIE_KV_ID = "1SPZleKgUnS3OG277P4KorTrvPGrxRJo3";
const STAGE_KV_ID = "15jjVBQ4LBGC2Va7CxXrxzpMwwrjh2mIq";
const SCRIPT_PDF_ID = "1jN5-4hr1JdrbLuz7CTZi1smWjmB916Lo";
const PHOTO_BOOK_ID = "1g6NfX27qDBMgAcnE3NbxRkZp0AzDUAQe";

function DriveDownloadCard({
    fileId,
    title,
    fallbackText,
    icon: Icon,
    cardUrl,
    buttonUrl,
    buttonText,
    customIcon: CustomIcon,
    onCardClick,
    customThumbnail
}: {
    fileId: string;
    title: string;
    fallbackText: string;
    icon?: React.ElementType;
    cardUrl?: string;
    buttonUrl?: string;
    buttonText?: string;
    customIcon?: React.ElementType;
    onCardClick?: () => void;
    customThumbnail?: string;
}) {
    const defaultViewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/view` : "#";
    const defaultDownloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : "#";
    const finalCardUrl = cardUrl || defaultViewUrl;
    const finalButtonUrl = buttonUrl || defaultDownloadUrl;
    const defaultThumbnailUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200&v=20260520` : "";
    const thumbnailUrl = customThumbnail || defaultThumbnailUrl;
    const DisplayIcon = CustomIcon || Download;
    const isCardActive = !!(fileId || cardUrl);
    const isButtonActive = !!(fileId || buttonUrl);
    const hasThumbnail = !!thumbnailUrl;

    return (
        <div className={`flex flex-col items-center gap-4 w-full ${!fileId && !cardUrl && !buttonUrl ? "opacity-60 pointer-events-none cursor-not-allowed" : ""}`}>
            {/* Card Link */}
            <a
                href={onCardClick && isCardActive ? "#" : finalCardUrl}
                onClick={onCardClick && isCardActive ? (e) => { e.preventDefault(); onCardClick(); } : undefined}
                target={onCardClick && isCardActive ? "_self" : (isCardActive ? "_blank" : "_self")}
                rel={onCardClick && isCardActive ? "" : (isCardActive ? "noopener noreferrer" : "")}
                className={`w-full flex justify-center group ${isCardActive ? "cursor-pointer hover:opacity-80 transition-opacity duration-300" : "pointer-events-none"}`}
            >
                <div className="w-full max-w-[280px] md:max-w-sm aspect-[3/4] relative rounded-lg overflow-hidden border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(255,191,0,0.15)] active:translate-y-1 active:shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-all duration-300 bg-zinc-950 flex items-center justify-center">

                    {/* Fallback Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0 bg-zinc-900">
                        {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 mb-4" />}
                        <span className="text-zinc-500 text-xs md:text-sm tracking-widest leading-loose whitespace-pre-line box-border">
                            {fallbackText}
                        </span>
                    </div>

                    {/* Drive Thumbnail Image */}
                    {hasThumbnail && (
                        <Image
                            src={thumbnailUrl}
                            alt={title}
                            fill
                            className="object-cover relative z-10 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500 pointer-events-auto"
                            unoptimized
                        />
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    {hasThumbnail && (
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
                    )}
                </div>
            </a>

            {/* Button Link */}
            <a
                href={finalButtonUrl}
                target={isButtonActive ? "_blank" : "_self"}
                rel={isButtonActive ? "noopener noreferrer" : ""}
                className={`w-full max-w-[280px] group ${isButtonActive ? "cursor-pointer hover:opacity-80 transition-opacity duration-300" : "pointer-events-none"}`}
            >
                <div className="flex items-center justify-center gap-2 px-6 py-3 border border-zinc-600 text-zinc-300 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 text-xs tracking-widest rounded-sm w-full">
                    <DisplayIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{isButtonActive ? (buttonText || "ダウンロード") : "準備中"}</span>
                </div>
            </a>
        </div>
    );
}


export default function SupportersPage() {
    const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
    const [tier, setTier] = useState<number>(0);
    const [phoneInput, setPhoneInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAgreedTerms, setHasAgreedTerms] = useState(true);

    // Toggle this to true to release the main play archive video
    const SHOW_ARCHIVE_VIDEO = true;

    useEffect(() => {
        const savedTier = sessionStorage.getItem("supporters_tier");
        if (savedTier) {
            setTier(parseInt(savedTier, 10));
        }
        setIsChecking(false);

        // Check if terms are agreed on mount
        const agreed = localStorage.getItem("agreed_terms");
        if (agreed !== "true") {
            setHasAgreedTerms(false);
        }
    }, []);

    const handleOpenPhotobook = () => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (isMobile) {
            window.location.href = "/supporters/photobook";
            return;
        }

        const w = window.screen.availWidth || window.screen.width;
        const h = window.screen.availHeight || window.screen.height;

        const popup = window.open(
            "/supporters/photobook",
            "photobook_viewer",
            `width=${w},height=${h},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no`
        );

        popup?.focus();
    };

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

    const handleAgreeTerms = () => {
        localStorage.setItem("agreed_terms", "true");
        setHasAgreedTerms(true);
    };

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
                                            disabled={isLoading || isChecking}
                                            className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-4 pl-12 pr-4 text-center text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/20 tracking-widest rounded-t-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            disabled={isLoading || isChecking}
                                            className="w-full bg-zinc-900 border-b border-[#ffbf00]/30 py-4 pl-12 pr-4 text-center text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:shadow-[0_10px_15px_-3px_rgba(255,191,0,0.1)] transition-all duration-300 placeholder-white/20 tracking-widest rounded-t-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    disabled={isLoading || isChecking || !phoneInput || !passwordInput}
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
                ) : (tier === 99 || !isProduction) ? (
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
                                    この度は映画『盈虚とパイプドリーム』を<br className="md:hidden block" />ご支援いただき、心より感謝申し上げます。<br />
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
                                        <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[10px] md:text-xs tracking-widest text-zinc-500 text-right whitespace-pre-line break-words max-w-[80%]">※動画準備中</span>
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
                                    {SHOW_ARCHIVE_VIDEO ? (
                                        <div className="w-full max-w-full aspect-video bg-black border border-zinc-800 rounded-sm relative overflow-hidden box-border">
                                            <iframe
                                                src="https://www.youtube.com/embed/5eI_gzVj9XM?modestbranding=1&rel=0"
                                                title="舞台『場末のパイプドリーム』本編アーカイブ"
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-full aspect-video bg-black flex items-center justify-center border border-zinc-800 rounded-sm relative group overflow-hidden box-border">
                                            <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                            <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[10px] md:text-xs tracking-widest text-zinc-500 text-right whitespace-pre-line break-words max-w-[80%]">※動画準備中</span>
                                        </div>
                                    )}
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
                                            cardUrl="https://drive.google.com/file/d/1jN5-4hr1JdrbLuz7CTZi1smWjmB916Lo/view?usp=drive_link"
                                            buttonText="PDFをダウンロード"
                                        />
                                        <DriveDownloadCard
                                            fileId={PHOTO_BOOK_ID}
                                            title="フォトブック PDF版"
                                            fallbackText="デジタルフォトブック\n（準備中）"
                                            icon={BookOpen}
                                            buttonText="フォトブックをダウンロード"
                                            onCardClick={handleOpenPhotobook}
                                            customThumbnail="/images/photobook/page-1.webp"
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
                ) : (
                    <motion.div
                        key="coming-soon"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="w-full max-w-md mx-auto space-y-12 relative z-10 px-4 mt-8 md:mt-20 box-border text-center min-h-[60dvh] flex flex-col justify-center items-center"
                    >
                        <div className="space-y-4">
                            <p className="text-sm tracking-[0.3em] text-[#ffbf00] mb-4 uppercase">Supporters Content</p>
                            <p className="text-xs tracking-widest text-zinc-500 uppercase mb-8">— Coming Soon —</p>
                            <p className="text-xs tracking-wider text-zinc-400 leading-relaxed">
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

            {/* Terms of Service Popup Modal */}
            <AnimatePresence>
                {tier > 0 && !hasAgreedTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 box-border"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-950 border border-[#ffbf00]/30 p-6 md:p-8 rounded-lg max-w-lg w-full max-h-[85dvh] flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        >
                            <h2 className="text-xl text-[#ffbf00] tracking-widest text-center font-bold">
                                利用規約
                            </h2>
                            <div className="flex-1 overflow-y-auto border border-zinc-800 bg-zinc-900/50 p-4 rounded text-zinc-400 text-xs md:text-sm leading-relaxed space-y-4 font-serif">
                                <p className="text-zinc-300 font-bold text-center">【限定コンテンツに関する重要なお願い】</p>
                                <p>
                                    本サポーター限定ページで提供されるすべてのコンテンツ（動画、画像、脚本、その他ダウンロード素材）の権利は、映画『盈虚とパイプドリーム』製作委員会に帰属します。
                                </p>
                                <p className="text-red-500 font-bold">
                                    ・限定コンテンツの無断転載、複製、第三者への配布、およびSNS等（X、Instagram、TikTok、YouTube等）への共有は固く禁止いたします。
                                </p>
                                <p>
                                    ・本サービスを利用して知り得た非公開情報について、インターネット上に漏洩させる行為は行わないでください。
                                </p>
                                <p>
                                    ・規約に違反した場合、アカウントおよびアクセスの停止、ならびに法的措置をとらせていただく場合がございます。
                                </p>
                                <p>
                                    サポーターの皆様に安心してお愉しみいただくため、何卒ご理解とご協力をお願い申し上げます。
                                </p>
                            </div>
                            <button
                                onClick={handleAgreeTerms}
                                className="w-full py-3 bg-[#ffbf00] text-zinc-950 hover:bg-white transition-colors duration-300 font-bold tracking-widest text-sm rounded shadow-[0_0_15px_rgba(255,191,0,0.3)] cursor-pointer"
                            >
                                同意して進む
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
