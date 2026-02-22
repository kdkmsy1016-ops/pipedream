"use client";

import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import DynamicTicketButton from "../components/DynamicTicketButton";
import LineSection from "../components/LineSection";
import FloatingTicketButton from "../components/FloatingTicketButton";
import ContactSection from "../components/ContactSection";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

// Gallery Images
const GALLERY_IMAGES = [
    { src: "/images/flyer-front-full.webp", alt: "Flyer Front" },
    { src: "/images/flyer-back-full.webp", alt: "Flyer Back" }
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500, // Reduced distance for faster feel
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 500 : -500,
        opacity: 0,
        scale: 0.95
    })
};

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.section
        className={`py-16 md:py-24 space-y-8 ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
    >
        {children}
    </motion.section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl md:text-2xl text-accent font-serif tracking-widest text-center border-b border-accent/30 pb-4 mb-8 inline-block mx-auto">
        {children}
    </h3>
);

export default function StagePage() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setIsZoomed(false); // Reset zoom UI state
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            let next = prev + newDirection;
            if (next < 0) next = GALLERY_IMAGES.length - 1;
            if (next >= GALLERY_IMAGES.length) next = 0;
            return next;
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedIndex(null);
            if (!isZoomed) { // Only allow keyboard nav when not zoomed (optional, but safer)
                if (e.key === "ArrowRight") paginate(1);
                if (e.key === "ArrowLeft") paginate(-1);
            }
        };
        if (selectedIndex !== null) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, paginate, isZoomed]);

    // Swipe handlers
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <main className="min-h-screen bg-black text-white font-serif relative">

            {/* Header: Key Visual */}
            <header className="relative w-full cursor-zoom-in">
                {/* PC Image (≥768px) */}
                <div
                    className="hidden md:block w-full group cursor-pointer"
                    onClick={() => { setDirection(0); setSelectedIndex(0); }}
                >
                    <motion.div layoutId="flyer-front-pc">
                        <Image
                            src="/images/flyer-front-pc.jpg"
                            alt="Stage Play Key Visual"
                            width={1920}
                            height={1080}
                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            priority
                        />
                    </motion.div>
                </div>

                {/* Mobile Image (<768px) */}
                <div
                    className="block md:hidden w-full bg-black group cursor-pointer"
                    onClick={() => { setDirection(0); setSelectedIndex(0); }}
                >
                    <motion.div layoutId="flyer-front-mobile">
                        <Image
                            src="/images/flyer-front-mobile.jpg"
                            alt="Stage Play Key Visual"
                            width={800}
                            height={1200}
                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            priority
                        />
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointers-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                >
                    <span className="font-serif text-[10px] tracking-[0.3em] text-[#ffbf00]/70">SCROLL</span>
                    <div className="w-[1px] h-[60px] bg-[#ffbf00]/30 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#ffbf00]"
                            animate={{ top: ["-100%", "100%"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            </header>

            {/* Content Sections... (omitted for brevity, keep existing content structure) */}
            <div className="max-w-4xl mx-auto px-6 pt-[40vh] pb-32 space-y-20 md:space-y-32">
                {/* ... existing sections ... */}
                {/* Intro */}
                <Section className="text-center leading-loose text-lg md:text-xl text-gray-300">
                    <SectionTitle>Introduction</SectionTitle>
                    <div className="space-y-6">
                        <p>ユージン・オニールの戯曲<br />『氷人来たる』に着想を得て、<br /><br className="hidden md:inline" />現代日本のスナックを舞台に<br />再構築した二人芝居</p>
                        <p>人生の再起を信じて<br />酒場に集う人々の<br />「明日」という幻想と、<br /><br className="hidden md:inline" />それを断ち切ろうとする<br />一人の女の来訪を通じて、</p>
                        <p className="text-xl md:text-2xl text-white font-bold py-4 block">
                            「人は真実だけで生きられるのか」<br />
                            「夢は生きるために必要な嘘なのか」
                        </p>
                        <p>という普遍的な問いを、<br />密室劇として描く</p>
                        <div className="pt-4 opacity-80 text-base">
                            <p>登場人物は二人のみ</p>
                            <p>観客は常連客として舞台空間に組み込まれ、<br />演劇の世界をともに“体感”します</p>
                        </div>
                    </div>
                </Section>
                {/* Story */}
                <Section className="text-center bg-white/5 p-8 md:p-12 rounded-sm border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <SectionTitle>Story</SectionTitle>
                    <div className="text-base md:text-lg leading-loose text-center space-y-6 font-light">
                        <p>
                            場末のスナック「ホープ」。<br />
                            誕生日を迎えたマスター・春男は、<br />常連客（＝観客）に囲まれ、<br />いつも通り「明日こそ人生を立て直す」と<br />冗談めかして語っている。
                        </p>
                        <p>
                            そこへ現れるのは、<br />保険会社の営業として成功した<br />常連・ヒッキー。<br />
                            彼女は酒を振る舞いながら、<br />春男に問いかける。
                        </p>
                        <p className="text-center text-lg md:text-xl text-accent py-2">
                            「その“明日”って、いつ来るの？」
                        </p>
                        <p>
                            やがて彼女は、<br />春男を店の外へと連れ出し、<br />夢を実行させようとする。<br />
                            しかし現実に直面した春男は、<br />何一つ変えられない自分に気づき、<br />崩壊していく——
                        </p>
                    </div>
                </Section>
                {/* Cast */}
                <Section className="text-center">
                    <SectionTitle>Cast & Staff</SectionTitle>
                    <div className="space-y-12">
                        {/* Cast */}
                        <div className="space-y-4">
                            <div className="text-accent text-sm tracking-widest uppercase mb-4">Cast</div>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-xl md:text-2xl font-bold">
                                <span>コトハ</span>
                                <span className="hidden md:block w-px h-6 bg-white/30"></span>
                                <span>福井将真</span>
                            </div>
                        </div>

                        {/* Main Staff */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base md:text-lg">
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">脚本</span>
                                久高将也
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">演出</span>
                                福井将真
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">プロデューサー</span>
                                町田直樹
                            </div>
                        </div>

                        {/* Technical Staff */}
                        <div className="bg-white/5 p-6 rounded-sm max-w-2xl mx-auto md:grid md:grid-cols-2 gap-y-4 text-sm md:text-base text-left md:text-center">
                            <div className="flex justify-between md:block px-4 border-b md:border-b-0 md:border-r border-white/10 py-2">
                                <span className="text-gray-500 md:mr-2">舞台監督</span>
                                <span>伊東秀悟</span>
                            </div>
                            <div className="flex justify-between md:block px-4 border-b md:border-b-0 md:border-r border-white/10 py-2">
                                <span className="text-gray-500 md:mr-2">音響</span>
                                <span>宮崎裕之</span>
                            </div>
                            <div className="flex justify-between md:block px-4 border-b md:border-b-0 md:border-r border-white/10 py-2">
                                <span className="text-gray-500 md:mr-2">照明</span>
                                <span>西村竜眞</span>
                            </div>
                            <div className="flex justify-between md:block px-4 border-b md:border-b-0 md:border-r border-white/10 py-2">
                                <span className="text-gray-500 md:mr-2">キービジュアル・映像</span>
                                <span>久高将也</span>
                            </div>
                            <div className="flex justify-between md:block px-4 border-b md:border-b-0 md:border-r border-white/10 py-2">
                                <span className="text-gray-500 md:mr-2">記録撮影</span>
                                <span>河西大地</span>
                            </div>
                        </div>
                    </div>
                </Section>
                {/* Time Table */}
                <Section>
                    <SectionTitle>Time Table</SectionTitle>
                    <div className="max-w-xl mx-auto space-y-12">
                        {/* Schedule List */}
                        <div className="space-y-6 font-serif tracking-widest">
                            {[
                                { date: "4.3 (Fri)", times: ["13:00", "18:00"] },
                                { date: "4.4 (Sat)", times: ["13:00", "18:00"] },
                                { date: "4.5 (Sun)", times: ["12:00", "16:00"] },
                            ].map((schedule, i) => (
                                <div key={i} className="flex justify-between items-baseline border-b border-white/10 pb-2">
                                    <div className="text-2xl md:text-3xl font-bold text-white/90">
                                        {schedule.date}
                                    </div>
                                    <div className="flex gap-6 text-lg md:text-xl text-accent/80">
                                        {schedule.times.map((time, j) => (
                                            <span key={j}>{time}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note & CTA */}
                        <div className="text-center space-y-8">
                            <p className="text-s text-gray-500 tracking-wide">
                                ※受付開始は開演の45分前、開場は30分前
                            </p>

                            <DynamicTicketButton
                                className="w-full max-w-md mx-auto"
                                releasedLabel="BUY TICKET"
                                preReleaseLabel={`チケット予約はこちら\n（2/21 21:00受付開始）`}
                            />
                            <div className="bg-white/5 p-8 rounded-sm space-y-6 max-w-lg mx-auto">
                                <div className="space-y-2 text-gray-300">
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span>前売り / 当日</span>
                                        <span>4,000円</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span>アフタートーク付き</span>
                                        <span>5,000円</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
                {/* Access */}
                <Section className="text-center space-y-8">
                    <SectionTitle>ACCESS</SectionTitle>

                    <div className="space-y-2">
                        <p className="text-lg md:text-xl font-bold">下北沢 小劇場 楽園</p>
                        <p className="text-gray-300">〒155-0031 東京都世田谷区北沢2丁目10-18</p>
                        <p className="text-accent text-sm md:text-base">下北沢駅 小田急線・京王井の頭線 東口より徒歩約3分</p>
                    </div>

                    <div className="w-full h-[400px] border border-accent rounded-sm overflow-hidden">
                        <iframe
                            src="https://maps.google.com/maps?q=下北沢+小劇場+楽園&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Theater Map"
                        ></iframe>
                    </div>
                </Section>
            </div>

            {/* Contact Section */}
            <ContactSection />

            {/* Crowdfunding Section */}
            <div className="border-t border-[#ffbf00]/20 pt-20 pb-20">
                <LineSection />
            </div>


            <FloatingTicketButton />

            {/* Gallery Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-0 md:p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Controls */}
                        <div className={`transition-opacity duration-300 ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                            <button
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[80]"
                                onClick={() => setSelectedIndex(null)}
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <button
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[80] hidden md:block"
                                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            >
                                <ChevronLeft className="w-12 h-12" />
                            </button>

                            <button
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[80] hidden md:block"
                                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            >
                                <ChevronRight className="w-12 h-12" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative w-full h-full max-w-7xl max-h-screen flex items-center justify-center pointer-events-none">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={selectedIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag={isZoomed ? false : "x"} // Disable swiping when zoomed
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        if (isZoomed) return;
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute w-full h-full flex items-center justify-center pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()} // Keep Open
                                >
                                    {/* Pinch Zoom Wrapper */}
                                    <TransformWrapper
                                        ref={transformComponentRef}
                                        initialScale={1}
                                        minScale={1}
                                        maxScale={5}
                                        doubleClick={{ disabled: false, mode: "zoomIn", step: 3 }}
                                        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
                                        onZoom={({ state }) => setIsZoomed(state.scale > 1.01)}
                                        onTransformed={({ state }) => setIsZoomed(state.scale > 1.01)}
                                    >
                                        <TransformComponent
                                            wrapperStyle={{ width: "100%", height: "100%" }}
                                            contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        >
                                            <div className="relative w-full h-full flex items-center justify-center relative">
                                                <Image
                                                    src={GALLERY_IMAGES[selectedIndex].src}
                                                    alt={GALLERY_IMAGES[selectedIndex].alt}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                    draggable={false} // Prevent native drag
                                                />
                                            </div>
                                        </TransformComponent>
                                    </TransformWrapper>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Indicators */}
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[80] transition-opacity duration-300 ${isZoomed ? "opacity-0" : "opacity-100"}`}>
                            {GALLERY_IMAGES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setDirection(i > selectedIndex ? 1 : -1); setSelectedIndex(i); }}
                                    className={`transition-colors ${i === selectedIndex ? "text-[#ffbf00]" : "text-white/30 hover:text-white/70"}`}
                                >
                                    <Circle className={`w-3 h-3 ${i === selectedIndex ? "fill-current" : ""}`} />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

