"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, UserPlus, CreditCard, PartyPopper, AlertCircle, Wallet, FileText, Smartphone } from "lucide-react";
import CrowdfundingMatrix from "../components/CrowdfundingMatrix";

export default function GuidePage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif w-full max-w-full box-border pb-24 relative overflow-x-hidden">

            {/* Top Back Button Area */}
            <div className="w-full box-border px-4 py-8 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40">
                <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
                    <Link href="/crowdfunding" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-xs md:text-sm tracking-widest font-bold">
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        クラウドファンディングへ戻る
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-3xl mx-auto pt-12 px-4 box-border space-y-16">

                {/* Header */}
                <header className="w-full text-center space-y-4 box-border">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#ffbf00] leading-snug tracking-wider">
                        ご支援の流れ
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base tracking-widest leading-relaxed">
                        MotionGalleryでのプロジェクト応援手順
                    </p>
                </header>

                {/* 4 Steps Section */}
                <section className="w-full space-y-8 box-border">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-3 text-white border-b border-zinc-900 pb-4">
                        <span className="text-[#ffbf00] tracking-widest">STEP</span>
                        <span className="text-zinc-500 text-sm font-normal">支援完了までの4ステップ</span>
                    </h2>

                    <div className="space-y-6 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-px bg-zinc-800 z-0" />

                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800"
                        >
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 shrink-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-950 border border-[#ffbf00]/50 flex items-center justify-center text-[#ffbf00]">
                                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="font-bold text-[#ffbf00] tracking-widest text-lg">STEP 1</span>
                            </div>
                            <div className="pt-1 md:pt-4">
                                <h3 className="text-lg font-bold text-white mb-2">プランを選ぶ</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    リターン内容を確認し、ご希望の支援プラン（特典）を選択してください。ページ下部の「プランを比較して支援する」ボタンからマトリックス表で一覧比較が可能です。
                                </p>
                            </div>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800"
                        >
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 shrink-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-950 border border-[#ffbf00]/50 flex items-center justify-center text-[#ffbf00]">
                                    <UserPlus className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="font-bold text-[#ffbf00] tracking-widest text-lg">STEP 2</span>
                            </div>
                            <div className="pt-1 md:pt-4">
                                <h3 className="text-lg font-bold text-white mb-2">ログイン / 新規登録</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                    MotionGalleryのアカウントをお持ちでない方は、新規登録（無料）をお願いします。登録にはメールアドレスやSNSアカウントが使用できます。
                                </p>
                                <Link
                                    href="/howto"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors rounded text-xs md:text-sm font-bold tracking-widest border border-zinc-700 w-full md:w-auto justify-center"
                                >
                                    <FileText className="w-4 h-4" />
                                    会員登録や決済の詳しい手順はこちら
                                </Link>
                            </div>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800"
                        >
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 shrink-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-950 border border-[#ffbf00]/50 flex items-center justify-center text-[#ffbf00]">
                                    <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="font-bold text-[#ffbf00] tracking-widest text-lg">STEP 3</span>
                            </div>
                            <div className="pt-1 md:pt-4">
                                <h3 className="text-lg font-bold text-white mb-2">決済方法の選択</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    ご希望のお支払い方法を選択し、決済を完了させます（カード・コンビニ・銀行振込などに対応しています。詳細は下記をご覧ください）。
                                </p>
                            </div>
                        </motion.div>

                        {/* Step 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-[#ffbf00]/10 p-6 rounded-lg border border-[#ffbf00]/30"
                        >
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 shrink-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#ffbf00] flex items-center justify-center text-zinc-950">
                                    <PartyPopper className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="font-bold text-[#ffbf00] tracking-widest text-lg">STEP 4</span>
                            </div>
                            <div className="pt-1 md:pt-4">
                                <h3 className="text-lg font-bold text-[#ffbf00] mb-2">支援完了！</h3>
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    ありがとうございます！プロジェクトからのアップデートをお待ちください。リターンの準備が整い次第、ご登録のメールアドレス宛にご連絡いたします。
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-800 my-8 box-border" />

                {/* All-in System info */}
                <section className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8 box-border">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-[#ffbf00]" />
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-widest">プロジェクト方式について</h2>
                    </div>
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                        本プロジェクトは <strong className="text-[#ffbf00]">All-in（実行確約型）</strong> で実施します。<br />
                        目標金額への達成状況に関わらず、ご支援いただいた時点でプロジェクトの実行とリターン（特典）のお届けが確定いたしますので、安心してご参加ください。
                    </p>
                </section>

                {/* Payment Methods */}
                <section className="w-full space-y-6 box-border">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-3 text-white border-b border-zinc-900 pb-4">
                        <span className="text-zinc-500 text-sm tracking-widest font-normal">ご利用可能な</span>
                        <span className="tracking-widest">決済手段</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex items-center gap-4">
                            <CreditCard className="w-6 h-6 text-zinc-500" />
                            <div>
                                <h3 className="font-bold text-sm">クレジットカード</h3>
                                <p className="text-xs text-zinc-500 mt-1">VISA / MasterCard / JCB / AMEX / Diners</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex items-center gap-4">
                            <Wallet className="w-6 h-6 text-zinc-500" />
                            <div>
                                <h3 className="font-bold text-sm">コンビニ決済</h3>
                                <p className="text-xs text-zinc-500 mt-1">ローソン / ファミマ / ミニストップ / セイコーマート</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex items-center gap-4">
                            <FileText className="w-6 h-6 text-zinc-500" />
                            <div>
                                <h3 className="font-bold text-sm">銀行振込</h3>
                                <p className="text-xs text-zinc-500 mt-1">全国の金融機関・ネットバンキング</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex items-center gap-4">
                            <Smartphone className="w-6 h-6 text-zinc-500" />
                            <div>
                                <h3 className="font-bold text-sm">ペイジー決済</h3>
                                <p className="text-xs text-zinc-500 mt-1">Pay-easy対応金融機関</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-800 my-8 box-border" />

            </div>

            {/* Extracted Crowdfunding Matrix with inline trigger under the content */}
            <CrowdfundingMatrix showInlineTrigger={true} />

        </main>
    );
}
