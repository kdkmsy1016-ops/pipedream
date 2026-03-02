"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ExternalLink, Gift, FileText, Video, PlayCircle, Users, Image as ImageIcon, Ticket, PartyPopper, Check, List, X } from "lucide-react";

const MOTION_GALLERY_URL = "https://motion-gallery.net/projects/pipedream-movie";

const TIERS = [
    {
        id: 1,
        name: "【ふらっと一杯！】プラン",
        price: "3,000",
        description: "お気持ちをご支援いただける方に。スナックさくらみちの常連気分が味わえます。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">A</div>,
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
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">B</div>,
        returns: [
            "プランAのすべて",
            "脚本（最終稿）PDFデータ",
            "舞台『場末のパイプドリーム』舞台写真デジタルフォトブック（PDF／約20P予定）"
        ]
    },
    {
        id: 3,
        name: "【また来ちゃった！さくらみち常連客】プラン",
        price: "12,000",
        description: "舞台の生きた空間を、限定アーカイブ映像で何度でも目撃できます。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">C</div>,
        returns: [
            "プランBのすべて",
            "舞台『場末のパイプドリーム』公演本編 限定アーカイブ（限定URL／パスコード）"
        ]
    },
    {
        id: 4,
        name: "【マスターいつもの！さくらみち超常連客】プラン",
        price: "30,000",
        description: "作品のエンドロールにお名前を刻み、リアルな完成台本をお届けします。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">D</div>,
        returns: [
            "プランCのすべて",
            "クレジット等に支援者（Special Thanks）としてお名前記載（1名分）",
            "キャスト・監督のサイン入り完成台本（製本版）"
        ]
    },
    {
        id: 5,
        name: "【新しいの入れといて！さくらみちボトルキープ】プラン",
        price: "60,000",
        description: "劇中で実際に使用した「あなた名義のキープ札」と、映画のオンライン先行試写。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">E</div>,
        returns: [
            "プランDのすべて（台本等含む）",
            "中ボトルのボトルキープ札にお名前記載（1名分）※劇中で使用後、現物郵送",
            "映画『盈虚とパイプドリーム』限定試写動画 視聴URL（完成後、オンライン／視聴期限1か月）"
        ]
    },
    {
        id: 6,
        name: "【スナックさくらみち貸切・完成記念パーティーご招待！】プラン",
        price: "100,000",
        description: "聖地「さくらみち」で関係者と共に完成を祝う、特別なリアルイベントへご招待。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">F</div>,
        returns: [
            "プランEのすべて",
            "映画の舞台となるスナック「さくらみち」（東京都稲城市）で行う試写会に、キャスト・スタッフと参加",
            "完成記念パーティー／試写会ご招待"
        ]
    },
    {
        id: 7,
        name: "【アソシエイトプロデューサー権】プラン",
        price: "300,000",
        description: "作品を根底から支え、共に創り上げる最高ランクのスポンサー権です。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">G</div>,
        returns: [
            "プランFのすべて",
            "クレジット等にアソシエイトプロデューサー（協賛）としてお名前記載（1名分）",
            "法人・企業ロゴ掲載可"
        ]
    }
];

const MATRIX_FEATURES = [
    { name: "お礼メール", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "KV デジタルカード", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "舞台KVサイン付カード", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "脚本(最終稿)PDFデータ", tiers: [2, 3, 4, 5, 6, 7] },
    { name: "舞台デジタルフォトブック", tiers: [2, 3, 4, 5, 6, 7] },
    { name: "舞台公演 限定アーカイブ", tiers: [3, 4, 5, 6, 7] },
    { name: "エンドロールお名前記載", tiers: [4, 5, 6, 7] },
    { name: "キャスト・監督サイン入り完成台本", tiers: [4, 5, 6, 7] },
    { name: "あなた名義のキープ札(現物郵送)", tiers: [5, 6, 7] },
    { name: "映画限定試写動画(オンライン)", tiers: [5, 6, 7] },
    { name: "さくらみち試写会・パーティー参加", tiers: [6, 7] },
    { name: "APクレジット・ロゴ掲載可", tiers: [7] }
];

export default function CrowdfundingPage() {
    const [isMatrixOpen, setIsMatrixOpen] = useState(false);

    return (
        <main className="min-h-screen bg-zinc-950 text-white font-serif w-full max-w-full box-border pb-24 relative overflow-x-hidden">

            {/* Top Back Button Area - Completely static, independent block at the very top */}
            <div className="w-full box-border px-4 py-8 bg-zinc-950 border-b border-zinc-900">
                <div className="w-full max-w-4xl mx-auto flex">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ffbf00] transition-colors text-sm tracking-widest font-bold">
                        <ChevronLeft className="w-5 h-5" />
                        BACK TO HOME
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-4xl mx-auto pt-10 px-4 box-border space-y-16">

                {/* Header */}
                <header className="w-full text-center space-y-6 box-border">
                    <div className="inline-block px-4 py-2 border border-[#8b0000]/50 bg-[#8b0000]/10 rounded border text-[#ffbf00] tracking-widest text-xs box-border">
                        MotionGallery プロジェクト
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#ffbf00] leading-snug whitespace-pre-line box-border break-words">
                        スナック「さくらみち」<br />
                        <span className="text-xl md:text-3xl text-white mt-2 block">映画化応援プロジェクト</span>
                    </h1>
                    <p className="text-zinc-300 tracking-wide text-sm md:text-base leading-relaxed whitespace-pre-line box-border break-words">
                        実在の場所から生まれる、虚実皮膜の物語。<br />
                        映画と舞台をまたにかけるこの挑戦を、<br className="md:hidden block" />ぜひ皆様と一緒に実現させてください。
                    </p>

                    {/* Top CTA Button */}
                    <div className="pt-4 w-full box-border flex justify-center">
                        <a
                            href={MOTION_GALLERY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-4 bg-[#ffbf00] text-zinc-950 hover:bg-zinc-200 transition-colors rounded font-bold tracking-widest text-sm box-border"
                        >
                            <Gift className="w-5 h-5 flex-shrink-0" />
                            <span className="whitespace-pre-line break-words">プロジェクトの詳細を見る</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                    </div>
                </header>

                <div className="w-full h-px bg-zinc-800 my-8 box-border" />

                {/* Tiers List */}
                <section className="w-full space-y-8 box-border">
                    <div className="w-full text-center space-y-2 mb-6 box-border">
                        <h2 className="text-xl font-bold text-[#ffbf00] tracking-widest whitespace-pre-line break-words">リターンメニュー</h2>
                        <p className="text-zinc-500 text-xs tracking-widest whitespace-pre-line break-words">お好きなプランをお選びください</p>
                    </div>

                    <div className="w-full space-y-6 box-border">
                        {TIERS.map((tier) => (
                            <div
                                key={tier.id}
                                className={`w-full box-border bg-zinc-900 border ${tier.id >= 4 ? 'border-[#ffbf00]/50' : 'border-zinc-800'} p-5 rounded-md relative`}
                            >
                                <div className="w-full flex items-start gap-4 border-b border-zinc-800 pb-4 mb-4 box-border">
                                    <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800 flex-shrink-0">
                                        {tier.icon}
                                    </div>
                                    <div className="w-full box-border text-left">
                                        <h3 className="text-base md:text-xl font-bold text-white mb-2 leading-snug whitespace-pre-line break-words">
                                            {tier.name}
                                        </h3>
                                        <p className="text-[#ffbf00] text-base md:text-lg font-bold tracking-widest">
                                            ¥{tier.price}
                                        </p>
                                    </div>
                                </div>

                                <p className="w-full text-zinc-300 text-sm leading-relaxed tracking-wide whitespace-pre-line break-words mb-4 box-border">
                                    {tier.description}
                                </p>

                                <div className="w-full bg-zinc-950/80 p-4 rounded border border-zinc-900 box-border mb-6">
                                    <h4 className="text-xs text-zinc-500 tracking-widest mb-3 whitespace-pre-line break-words">特典内容</h4>
                                    <ul className="w-full space-y-3 box-border">
                                        {tier.returns.map((ret, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 tracking-wide leading-relaxed whitespace-pre-line break-words box-border">
                                                <span className="text-[#ffbf00] flex-shrink-0">•</span>
                                                <span className="w-full">{ret}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-full box-border">
                                    <a
                                        href={MOTION_GALLERY_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 border border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-zinc-950 transition-colors text-sm font-bold tracking-widest rounded box-border"
                                    >
                                        <span className="whitespace-pre-line break-words">このプランを支援する</span>
                                        <ChevronLeft className="w-4 h-4 rotate-180 flex-shrink-0" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-800 my-10 box-border" />

                {/* Bottom CTA */}
                <div className="w-full text-center space-y-6 box-border pb-10">
                    <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest leading-relaxed whitespace-pre-line break-words">
                        皆様のご来店、<br className="md:hidden block" />心よりお待ちしております
                    </h2>
                    <div className="w-full box-border flex justify-center">
                        <a
                            href={MOTION_GALLERY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#ffbf00] text-zinc-950 hover:bg-zinc-200 transition-colors rounded font-bold tracking-widest text-sm box-border"
                        >
                            <span className="whitespace-pre-line break-words">MotionGalleryへ進む</span>
                            <ExternalLink className="w-5 h-5 ml-1 flex-shrink-0" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Floating Action Button (FAB) for Matrix */}
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

                        <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0 text-center">
                            <a
                                href={MOTION_GALLERY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ffbf00] text-zinc-950 hover:bg-white transition-colors text-xs font-bold tracking-widest rounded-sm"
                            >
                                MotionGalleryで支援する
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
