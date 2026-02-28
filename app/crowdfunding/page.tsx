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
        <main className="min-h-screen bg-zinc-950 text-white font-serif py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">

            {/* Background Glows (Snack Bar Theme) */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b0000]/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ffbf00]/5 blur-[150px] rounded-full" />
            </div>

            {/* Back Button */}
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

            <div className="max-w-4xl mx-auto relative z-10 space-y-16">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-8"
                >
                    <div className="inline-block px-6 py-2 border border-[#8b0000]/50 bg-[#8b0000]/10 rounded-full text-[#ffbf00] tracking-[0.2em] text-sm md:text-base mb-4 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                        MotionGallery プロジェクト
                    </div>
                    <h1 className="text-3xl md:text-5xl tracking-[0.1em] md:tracking-[0.2em] font-bold text-[#ffbf00] drop-shadow-[0_0_15px_rgba(255,191,0,0.3)] leading-tight">
                        スナック「さくらみち」<br />
                        <span className="text-2xl md:text-4xl text-white">映画化応援プロジェクト</span>
                    </h1>
                    <p className="text-zinc-300 leading-loose max-w-2xl mx-auto tracking-widest text-sm md:text-base">
                        実在の場所から生まれる、虚実皮膜の物語。<br />
                        映画と舞台をまたにかけるこの挑戦を、<br className="md:hidden" />ぜひ皆様と一緒に実現させてください。
                    </p>

                    {/* Top CTA Button */}
                    <div className="pt-4">
                        <a
                            href={MOTION_GALLERY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#ffbf00] text-zinc-950 hover:bg-white transition-all duration-300 rounded-sm font-bold tracking-widest text-sm md:text-base shadow-[0_0_20px_rgba(255,191,0,0.4)]"
                        >
                            <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>プロジェクトの詳細を見る</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </motion.header>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#ffbf00]/30 to-transparent" />

                {/* Tiers List */}
                <section className="space-y-12">
                    <div className="text-center space-y-2 mb-12">
                        <h2 className="text-2xl text-[#ffbf00] tracking-widest font-bold">リターンメニュー</h2>
                        <p className="text-zinc-500 text-sm tracking-widest">お好きなプランをお選びください</p>
                    </div>

                    <div className="grid gap-8">
                        {TIERS.map((tier, index) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`bg-zinc-900/80 border ${tier.id >= 4 ? 'border-[#ffbf00]/50 shadow-[0_0_20px_rgba(255,191,0,0.1)]' : 'border-zinc-800'} p-6 md:p-8 rounded-sm relative overflow-hidden group hover:border-[#ffbf00]/80 transition-colors duration-500`}
                            >
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#ffbf00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="md:flex justify-between items-start gap-8 z-10 relative">

                                    {/* Left Side: Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                                            <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800 group-hover:border-[#ffbf00]/50 transition-colors">
                                                {tier.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold tracking-widest text-white mb-1">
                                                    {tier.name}
                                                </h3>
                                                <p className="text-[#ffbf00] text-lg md:text-xl font-bold tracking-widest">
                                                    ¥{tier.price}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm leading-loose tracking-wide">
                                            {tier.description}
                                        </p>

                                        <div className="bg-zinc-950/50 p-4 rounded-sm border border-zinc-900">
                                            <h4 className="text-xs text-zinc-500 tracking-widest mb-3">特典内容</h4>
                                            <ul className="space-y-2">
                                                {tier.returns.map((ret, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 tracking-wide">
                                                        <span className="text-[#ffbf00] mt-0.5">•</span>
                                                        <span className="leading-snug">{ret}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right Side: CTA Action */}
                                    <div className="mt-8 md:mt-0 flex-shrink-0 flex items-end">
                                        <a
                                            href={MOTION_GALLERY_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-transparent border border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-zinc-950 transition-all duration-300 text-sm tracking-widest font-bold rounded-sm group/btn"
                                        >
                                            <span>このプランを支援する</span>
                                            <ChevronLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8b0000]/50 to-transparent my-16" />

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-8 pb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest">
                        皆様のご来店、<br className="md:hidden" />心よりお待ちしております
                    </h2>
                    <a
                        href={MOTION_GALLERY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#ffbf00] text-zinc-950 hover:bg-white transition-all duration-300 rounded-sm font-bold tracking-[0.2em] text-lg shadow-[0_0_30px_rgba(255,191,0,0.5)] animate-pulse hover:animate-none"
                    >
                        <span>MotionGalleryへ進む</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </motion.div>

            </div>
        </main>
    );
}
