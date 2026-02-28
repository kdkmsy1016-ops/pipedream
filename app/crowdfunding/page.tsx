"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Gift, FileText, Video, PlayCircle, Users, Image as ImageIcon, Ticket, PartyPopper } from "lucide-react";

// Dummy URL for MotionGallery (to be replaced)
const MOTION_GALLERY_URL = "https://motion-gallery.net/projects/pipedream-movie";

const TIERS = [
    {
        id: 1,
        name: "【ふらっと一杯！】プラン",
        price: "3,000",
        description: "お気持ちをご支援いただける方に。スナックさくらみちの常連気分が味わえます。",
        icon: <ImageIcon className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "お礼メール",
            "映画キービジュアル デジタルカード（1点）",
            "舞台『場末のパイプドリーム』キービジュアル デジタルカード（俳優サイン付き／1点）"
        ]
    },
    {
        id: 2,
        name: "【マスター、もう一杯だけ！】プラン",
        price: "6,000",
        description: "本編の核となるシナリオと舞台写真で、物語の裏側までお楽しみいただけます。",
        icon: <FileText className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "3,000円プランのすべて",
            "脚本（最終稿）PDFデータ",
            "舞台『場末のパイプドリーム』舞台写真デジタルフォトブック（PDF／約20P予定）"
        ]
    },
    {
        id: 3,
        name: "【また来ちゃった！さくらみち常連客】プラン",
        price: "12,000",
        description: "舞台の生きた空間を、限定アーカイブ映像で何度でも目撃できます。",
        icon: <PlayCircle className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "6,000円プランのすべて",
            "舞台『場末のパイプドリーム』公演本編 限定アーカイブ（限定URL／パスコード）"
        ]
    },
    {
        id: 4,
        name: "【マスターいつもの！さくらみち超常連客】プラン",
        price: "30,000",
        description: "作品のエンドロールにお名前を刻み、リアルな完成台本をお届けします。",
        icon: <Users className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "12,000円プランのすべて",
            "クレジット等に支援者（Special Thanks）としてお名前記載（1名分）",
            "キャスト・監督のサイン入り完成台本（製本版）"
        ]
    },
    {
        id: 5,
        name: "【新しいの入れといて！さくらみちボトルキープ】プラン",
        price: "60,000",
        description: "劇中で実際に使用した「あなた名義のキープ札」と、映画のオンライン先行試写。",
        icon: <Video className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "30,000円プランのすべて（台本等含む）",
            "中ボトルのボトルキープ札にお名前記載（1名分）※劇中で使用後、現物郵送",
            "映画『盈虚とパイプドリーム』限定試写動画 視聴URL（完成後、オンライン／視聴期限1か月）"
        ]
    },
    {
        id: 6,
        name: "【スナックさくらみち貸切・完成記念パーティーご招待！】プラン",
        price: "100,000",
        description: "聖地「さくらみち」で関係者と共に完成を祝う、特別なリアルイベントへご招待。",
        icon: <PartyPopper className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "60,000円プランのすべて",
            "映画の舞台となるスナック「さくらみち」（東京都稲城市）で行う試写会に、キャスト・スタッフと参加",
            "完成記念パーティー／試写会ご招待"
        ]
    },
    {
        id: 7,
        name: "【アソシエイトプロデューサー権】プラン",
        price: "300,000",
        description: "作品を根底から支え、共に創り上げる最高ランクのスポンサー権です。",
        icon: <Ticket className="w-5 h-5 text-[#ffbf00]" />,
        returns: [
            "60,000円または100,000円プラン相当の内容を含みつつ、最上位特典として",
            "クレジット等にアソシエイトプロデューサー（協賛）としてお名前記載（1名分）",
            "法人・企業ロゴ掲載可"
        ]
    }
];

export default function CrowdfundingPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif relative overflow-x-hidden w-full max-w-full box-border pb-24">

            {/* Background Glows (Optimized for Mobile Performance) */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden box-border">
                {/* Reduced blur radius and size on mobile to save GPU overhead */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#8b0000]/10 blur-[100px] md:blur-[150px] rounded-full transform-gpu" />
                <div className="absolute bottom-1/4 right-0 md:right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ffbf00]/5 blur-[100px] md:blur-[150px] rounded-full transform-gpu" />
            </div>

            {/* Back Button (Static Flow - Never Overlaps Content) */}
            <div className="relative z-50 w-full max-w-full box-border px-4 md:px-12 pt-8 md:pt-16 pb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-sm tracking-widest group relative z-50">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-4xl mx-auto relative z-10 space-y-16 px-4 md:px-8 box-border overflow-hidden">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-full text-center space-y-6 box-border overflow-hidden"
                >
                    <div className="inline-block px-4 py-2 border border-[#8b0000]/50 bg-[#8b0000]/10 rounded-full text-[#ffbf00] tracking-widest text-xs shadow-[0_0_15px_rgba(139,0,0,0.3)] break-words whitespace-normal max-w-full">
                        MotionGallery プロジェクト
                    </div>
                    {/* Added whitespace-pre-line and break-words */}
                    <h1 className="text-2xl md:text-5xl tracking-wide font-bold text-[#ffbf00] drop-shadow-[0_0_15px_rgba(255,191,0,0.3)] leading-snug whitespace-pre-line break-words max-w-full overflow-hidden">
                        スナック「さくらみち」<br />
                        <span className="text-xl md:text-4xl text-white mt-1 md:mt-2 block">映画化応援プロジェクト</span>
                    </h1>
                    <p className="text-zinc-300 leading-relaxed w-full max-w-full mx-auto tracking-wide text-sm whitespace-pre-line break-words overflow-hidden">
                        実在の場所から生まれる、虚実皮膜の物語。<br />
                        映画と舞台をまたにかけるこの挑戦を、<br className="md:hidden block" />ぜひ皆様と一緒に実現させてください。
                    </p>

                    {/* Top CTA Button */}
                    <div className="pt-4 w-full max-w-full flex justify-center box-border overflow-hidden">
                        <a
                            href={MOTION_GALLERY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 md:px-8 py-4 bg-[#ffbf00] text-zinc-950 hover:bg-zinc-200 transition-all duration-300 rounded-sm font-bold tracking-widest text-sm shadow-[0_0_20px_rgba(255,191,0,0.4)] box-border max-w-full"
                        >
                            <Gift className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                            <span className="whitespace-normal break-words max-w-full overflow-hidden">プロジェクトの詳細を見る</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                    </div>
                </motion.header>

                <div className="w-full max-w-full h-px bg-gradient-to-r from-transparent via-[#ffbf00]/30 to-transparent" />

                {/* Tiers List */}
                <section className="w-full max-w-full space-y-8 box-border overflow-hidden">
                    <div className="w-full max-w-full text-center space-y-2 mb-8 box-border overflow-hidden">
                        <h2 className="text-xl md:text-2xl text-[#ffbf00] tracking-widest font-bold break-words whitespace-pre-line">リターンメニュー</h2>
                        <p className="text-zinc-500 text-xs md:text-sm tracking-widest break-words whitespace-pre-line">お好きなプランをお選びください</p>
                    </div>

                    <div className="w-full max-w-full grid gap-6 box-border overflow-hidden">
                        {TIERS.map((tier, index) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                // Reduced padding on mobile (p-4 instead of p-8) and strictly boxed
                                className={`w-full max-w-full box-border bg-zinc-900/80 border ${tier.id >= 4 ? 'border-[#ffbf00]/50 shadow-[0_0_20px_rgba(255,191,0,0.1)]' : 'border-zinc-800'} p-4 md:p-8 rounded-sm relative overflow-hidden group hover:border-[#ffbf00]/80 transition-colors duration-300`}
                            >
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#ffbf00]/20 to-transparent opacity-0 z-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className="w-full max-w-full flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 z-10 relative box-border overflow-hidden">

                                    {/* Left Side: Info */}
                                    <div className="flex-1 space-y-4 w-full max-w-full box-border overflow-hidden">
                                        {/* Icon and Title area */}
                                        <div className="w-full max-w-full flex items-start md:items-center gap-3 border-b border-zinc-800 pb-3 overflow-hidden">
                                            <div className="p-2 bg-zinc-950 rounded-full border border-zinc-800 group-hover:border-[#ffbf00]/50 transition-colors flex-shrink-0 mt-1 md:mt-0">
                                                {tier.icon}
                                            </div>
                                            <div className="w-full max-w-full min-w-0 overflow-hidden text-left">
                                                {/* Pre-line ensures intended line breaks from user */}
                                                <h3 className="text-sm md:text-2xl font-bold tracking-wide text-white mb-1 leading-snug break-words whitespace-pre-line overflow-hidden w-full max-w-full">
                                                    {tier.name}
                                                </h3>
                                                <p className="text-[#ffbf00] text-sm md:text-xl font-bold tracking-widest mt-1">
                                                    ¥{tier.price}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="w-full max-w-full text-zinc-400 text-xs md:text-base leading-relaxed tracking-wide break-words whitespace-pre-line overflow-hidden">
                                            {tier.description}
                                        </p>

                                        {/* Reduced padding inside benefits box */}
                                        <div className="w-full max-w-full bg-zinc-950/50 p-3 md:p-5 rounded-sm border border-zinc-900 box-border overflow-hidden">
                                            <h4 className="text-xs text-zinc-500 tracking-widest mb-3">特典内容</h4>
                                            <ul className="w-full max-w-full space-y-2 overflow-hidden">
                                                {tier.returns.map((ret, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-300 tracking-wide break-words leading-relaxed w-full max-w-full overflow-hidden">
                                                        <span className="text-[#ffbf00] mt-0.5 flex-shrink-0 leading-none">•</span>
                                                        <span className="whitespace-pre-line break-words max-w-full w-full">{ret}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right Side: CTA Action */}
                                    <div className="w-full max-w-full md:w-auto mt-2 flex-shrink-0 flex items-end box-border overflow-hidden">
                                        <a
                                            href={MOTION_GALLERY_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full max-w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 md:bg-transparent border border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-zinc-950 transition-all duration-300 text-xs tracking-widest font-bold rounded-sm group/btn box-border overflow-hidden"
                                        >
                                            <span className="whitespace-normal break-words">このプランを支援する</span>
                                            <ChevronLeft className="w-4 h-4 rotate-180 md:group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                                        </a>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="w-full max-w-full h-px bg-gradient-to-r from-transparent via-[#8b0000]/50 to-transparent my-12 box-border overflow-hidden" />

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-full text-center space-y-6 box-border overflow-hidden"
                >
                    <h2 className="text-lg md:text-3xl font-bold text-white tracking-widest leading-relaxed whitespace-pre-line break-words">
                        皆様のご来店、<br className="md:hidden block" />心よりお待ちしております
                    </h2>
                    <div className="w-full max-w-full box-border overflow-hidden">
                        <a
                            href={MOTION_GALLERY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#ffbf00] text-zinc-950 hover:bg-zinc-200 transition-all duration-300 rounded-sm font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(255,191,0,0.3)] box-border max-w-full overflow-hidden"
                        >
                            <span className="whitespace-normal break-words">MotionGalleryへ進む</span>
                            <ExternalLink className="w-4 h-4 ml-1 flex-shrink-0" />
                        </a>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
