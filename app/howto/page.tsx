"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, Check, Info, Mail, UserPlus, LogIn, Gift, CreditCard, ChevronRight, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { useCrowdfundingStatus } from "../hooks/useCrowdfundingStatus";
import { MOTION_GALLERY_URL } from "../crowdfunding/data";

export default function HowToPage() {
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
        <main className="min-h-screen bg-zinc-950 text-white font-serif w-full max-w-full box-border pb-32 relative overflow-x-hidden">
            
            {/* Top Navigation */}
            <div className="w-full box-border px-4 py-6 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-900">
                <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/guide" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffbf00] transition-colors text-xs md:text-sm tracking-widest font-bold">
                        <ChevronLeft className="w-4 h-4" />
                        概要へ戻る
                    </Link>
                </div>
            </div>

            {/* Header */}
            <header className="w-full max-w-2xl mx-auto text-center space-y-4 px-4 pt-12 pb-8 box-border">
                <h1 className="text-2xl md:text-3xl font-bold text-[#ffbf00] tracking-widest">
                    詳しい支援の手順
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed tracking-wide">
                    MotionGalleryを利用したご支援（決済）までの<br className="md:hidden" />詳しい流れを図解します。
                </p>
            </header>

            {/* Steps Container */}
            <div className="w-full max-w-2xl mx-auto px-4 box-border space-y-12">

                {/* --- Step 1 --- */}
                <StepCard
                    number="1"
                    title="会員登録"
                    icon={<UserPlus className="w-8 h-8 md:w-10 md:h-10 text-[#ffbf00]" />}
                >
                    <div className="mb-6">
                        <a 
                            href="https://motion-gallery.net/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-[#ffbf00] border border-zinc-700 hover:border-[#ffbf00]/50 transition-colors rounded text-sm font-bold tracking-widest w-full md:w-auto justify-center shadow-sm"
                        >
                            MotionGalleryトップページへ
                            <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                    <ul className="text-zinc-300 text-sm md:text-base space-y-4 tracking-wide font-bold">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">A</span>
                            右上の「新規登録」をタップ
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">B</span>
                            メールアドレスを入力して送信
                        </li>
                        <li className="flex items-center gap-3 text-[#ffbf00]">
                            <Mail className="w-5 h-5" />
                            届いたメール内のURLをタップ
                        </li>
                    </ul>

                    <Accordion title="登録用メールが届かない場合">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            迷惑メールフォルダに振り分けられている可能性があります。<br />
                            「@motion-gallery.net」からのメールを受信設定してください。
                        </p>
                    </Accordion>
                </StepCard>

                <ScrollArrow />

                {/* --- Step 2 --- */}
                <StepCard
                    number="2"
                    title="パスワード設定"
                    icon={<LogIn className="w-8 h-8 md:w-10 md:h-10 text-[#ffbf00]" />}
                >
                    <p className="text-zinc-300 text-sm md:text-base tracking-wide font-bold mb-4">
                        メールのURLから本登録画面へ進み、<br className="md:hidden" />
                        パスワードを設定してログインします。
                    </p>

                    <Accordion title="パスワード設定のルール（重要！）">
                        <ul className="text-xs text-zinc-400 leading-relaxed space-y-2 list-disc list-inside">
                            <li>必ず <strong className="text-white">半角英数字</strong> を使用してください。</li>
                            <li>記号（!-?等）は使えません。</li>
                            <li>6文字以上で設定してください。</li>
                        </ul>
                    </Accordion>
                </StepCard>

                <ScrollArrow />

                {/* --- Step 3 --- */}
                <StepCard
                    number="3"
                    title="リターン（プラン）を選択"
                    icon={<Gift className="w-8 h-8 md:w-10 md:h-10 text-[#ffbf00]" />}
                >
                    <ul className="text-zinc-300 text-sm md:text-base space-y-4 tracking-wide font-bold">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">A</span>
                            支援したいコース（金額）をタップ
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">B</span>
                            内容を確認して「さらに応援する」へ
                        </li>
                    </ul>

                    <Accordion title="「さらに応援する」とは？（上乗せ支援）">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            選んだプランの金額に、お好きな金額（例：+1,500円など）を上乗せして支援することができます。
                        </p>
                    </Accordion>
                </StepCard>

                <ScrollArrow />

                {/* --- Step 4 --- */}
                <StepCard
                    number="4"
                    title="お支払い情報の入力・完了"
                    icon={<CreditCard className="w-8 h-8 md:w-10 md:h-10 text-[#ffbf00]" />}
                >
                    <ul className="text-zinc-300 text-sm md:text-base space-y-4 tracking-wide font-bold">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">A</span>
                            決済方法（カード/振込/コンビニ等）を選ぶ
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">B</span>
                            応援コメントがあれば入力（任意）
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">C</span>
                            「この内容で応援する」をタップ！
                        </li>
                    </ul>
                </StepCard>

            </div>

            {/* Bottom CTA Block */}
            <div className="w-full max-w-2xl mx-auto px-4 pt-20 pb-10 text-center box-border space-y-6">
                <div className="flex items-center justify-center gap-2 text-zinc-500 mb-4">
                    <Check className="w-5 h-5 text-[#ffbf00]" />
                    <span className="text-sm tracking-widest font-bold">以上の手順で支援完了です</span>
                </div>
                
                {isStarted ? (
                    <a
                        href={MOTION_GALLERY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 w-full p-6 bg-[#ffbf00] text-zinc-950 transition-colors rounded-sm font-bold tracking-widest box-border hover:bg-white shadow-[0_0_20px_rgba(255,191,0,0.5)]"
                    >
                        <span className="text-sm md:text-base">支援先ページへ</span>
                        <span className="text-base md:text-xl flex items-center gap-2 mt-1">
                            MotionGalleryで支援する
                            <ExternalLink className="w-5 h-5 flex-shrink-0" />
                        </span>
                    </a>
                ) : (
                    <a
                        href="#"
                        onClick={handleDisabledClick}
                        className="flex flex-col items-center justify-center gap-1 w-full p-6 bg-[#ffbf00] text-zinc-950 transition-colors rounded-sm font-bold tracking-widest box-border hover:bg-white shadow-[0_0_20px_rgba(255,191,0,0.5)] cursor-not-allowed"
                    >
                        <span className="text-xs md:text-sm">クラウドファンディング会場へ戻る</span>
                        <span className="text-xl md:text-2xl flex items-center gap-2 mt-1">
                            <Clock className="w-6 h-6" />
                            2026/4/1 12:00 START
                        </span>
                    </a>
                )}
            </div>

            {/* Disabled Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] bg-zinc-800 text-white px-6 py-3 rounded-full shadow-lg border border-zinc-700 flex items-center gap-3 text-sm tracking-widest whitespace-nowrap"
                    >
                        <Clock className="w-4 h-4 text-[#ffbf00]" />
                        <span>開始までお待ちください</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}

/* -------------------------------------
   UI Components
-------------------------------------- */

function StepCard({ number, title, icon, children }: { number: string, title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 relative box-border"
        >
            <div className="absolute -top-6 -left-3 md:-left-6 text-[80px] md:text-[100px] font-black italic text-zinc-800/30 leading-none select-none z-0">
                {number}
            </div>
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                    <div className="bg-zinc-950 p-2 md:p-3 rounded-full shadow-inner border border-zinc-800">
                        {icon}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest">
                        {title}
                    </h2>
                </div>
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </motion.section>
    );
}

function ScrollArrow() {
    return (
        <div className="w-full flex justify-center py-2 h-16 box-border">
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-zinc-600"
            >
                <ChevronDown className="w-8 h-8" />
            </motion.div>
        </div>
    );
}

function Accordion({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full border border-zinc-800 rounded bg-zinc-950/50 overflow-hidden box-border">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/50"
            >
                <div className="flex items-center gap-2 text-zinc-400">
                    <Info className="w-4 h-4 shrink-0 text-[#ffbf00]" />
                    <span className="text-xs md:text-sm font-bold tracking-widest">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-4 pt-0 border-t border-zinc-800/50 bg-zinc-900/20 box-border block">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
