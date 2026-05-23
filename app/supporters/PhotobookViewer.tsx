"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

const PAGES = Array.from({ length: 20 }, (_, i) => `/images/photobook/page-${i + 1}.webp`);

interface PhotobookViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PhotobookViewer({ isOpen, onClose }: PhotobookViewerProps) {
    const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
    const [currentPage, setCurrentPage] = useState(0);
    const [preloaded, setPreloaded] = useState(false);
    const flipBookRef = useRef<any>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Track window resize to calculate responsive page dimensions
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    // Performance: Preload pages 5 to 20 in the background
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const preloadImages = async () => {
                const promises = PAGES.slice(4).map((src) => {
                    return new Promise((resolve) => {
                        const img = new window.Image();
                        img.src = src;
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                });
                await Promise.all(promises);
                setPreloaded(true);
            };
            preloadImages();
        }, 1000);

        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    const isLandscape = windowSize.width > windowSize.height;
    const displayMode = isLandscape ? "double" : "single";

    // Calculate dimensions based on aspect ratio 3:4 (width:height)
    let pageWidth = 0;
    let pageHeight = 0;

    if (isLandscape) {
        // Landscape: Double page spread (Total book width = 2 * pageWidth)
        const maxTotalWidth = windowSize.width - 160; // Leave margin for navigation arrows
        const maxTotalHeight = windowSize.height - 160;

        // Try fitting based on height
        pageHeight = maxTotalHeight;
        pageWidth = pageHeight * (3 / 4);

        // If total width exceeds screen width, scale down based on width
        if (pageWidth * 2 > maxTotalWidth) {
            pageWidth = maxTotalWidth / 2;
            pageHeight = pageWidth * (4 / 3);
        }
    } else {
        // Portrait: Single page (Total book width = pageWidth)
        const maxTotalWidth = windowSize.width - 40;
        const maxTotalHeight = windowSize.height - 160;

        pageWidth = maxTotalWidth;
        pageHeight = pageWidth * (4 / 3);

        if (pageHeight > maxTotalHeight) {
            pageHeight = maxTotalHeight;
            pageWidth = pageHeight * (3 / 4);
        }
    }

    pageWidth = Math.round(pageWidth);
    pageHeight = Math.round(pageHeight);

    const handlePrev = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    const handleNext = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };

    const onFlip = (e: any) => {
        setCurrentPage(e.data);
    };

    const getPageIndicator = () => {
        if (displayMode === "single") {
            return `${currentPage + 1} / 20`;
        } else {
            if (currentPage === 0) {
                return "1 / 20";
            }
            if (currentPage === 19) {
                return "20 / 20";
            }
            const leftPageNum = currentPage + 1;
            const rightPageNum = Math.min(leftPageNum + 1, 20);
            return `${leftPageNum} – ${rightPageNum} / 20`;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 bg-[#0b0e14] flex flex-col items-center justify-center select-none"
            >
                {/* Header / A24 Minimal Close Button */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-[#ffbf00] transition-colors p-3 flex items-center gap-2 group tracking-widest text-xs font-serif uppercase cursor-pointer"
                    >
                        <span>CLOSE</span>
                        <X className="w-4 h-4 stroke-1 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Left Navigation Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ffbf00] disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 z-40 cursor-pointer"
                    aria-label="Previous Page"
                >
                    <ChevronLeft className="w-8 h-8 stroke-1" />
                </button>

                {/* Main Flipbook Wrapper */}
                <div 
                    className="relative flex items-center justify-center"
                    style={{
                        width: isLandscape ? `${pageWidth * 2}px` : `${pageWidth}px`,
                        height: `${pageHeight}px`
                    }}
                >
                    <HTMLFlipBook
                        width={pageWidth}
                        height={pageHeight}
                        size="fixed"
                        minWidth={pageWidth}
                        maxWidth={pageWidth}
                        minHeight={pageHeight}
                        maxHeight={pageHeight}
                        display={displayMode}
                        ref={flipBookRef}
                        onFlip={onFlip}
                        showCover={isLandscape}
                        drawShadow={true}
                        maxShadowOpacity={0.6}
                        flippingTime={800}
                        usePortrait={!isLandscape}
                        className="mx-auto shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
                        key={`${displayMode}-${pageWidth}-${pageHeight}`}
                        startPage={currentPage}
                    >
                        {PAGES.map((src, index) => {
                            const isLeftPage = index % 2 === 1;
                            const showPage = index < 4 || preloaded;

                            return (
                                <div
                                    key={index}
                                    className="w-full h-full bg-[#0d1117] border border-zinc-900/50 relative overflow-hidden box-border"
                                >
                                    {showPage ? (
                                        <img
                                            src={src}
                                            alt={`Page ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading={index < 4 ? "eager" : "lazy"}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#0b0e14]">
                                            <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#ffbf00] rounded-full animate-spin" />
                                        </div>
                                    )}

                                    {/* 3D Page Crease Shadow Effect (Moves with page) */}
                                    {isLandscape && index > 0 && index < 19 && (
                                        <div
                                            className={`absolute top-0 bottom-0 pointer-events-none w-16 z-20 transition-opacity ${
                                                isLeftPage
                                                    ? "right-0 bg-gradient-to-l from-black/45 via-black/10 to-transparent"
                                                    : "left-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </HTMLFlipBook>

                    {/* Book Binding Crease Shadow overlay (Stationary in 3D center) */}
                    {isLandscape && currentPage > 0 && currentPage < 19 && (
                        <div
                            className="absolute top-0 bottom-0 pointer-events-none z-30 w-[40px] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                            style={{
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)"
                            }}
                        />
                    )}
                </div>

                {/* Right Navigation Arrow */}
                <button
                    onClick={handleNext}
                    disabled={currentPage >= PAGES.length - 1}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ffbf00] disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 z-40 cursor-pointer"
                    aria-label="Next Page"
                >
                    <ChevronRight className="w-8 h-8 stroke-1" />
                </button>

                {/* Footer Page Number / A24 Minimal design */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
                    <p className="text-zinc-500 text-xs tracking-[0.2em] font-serif uppercase">
                        {getPageIndicator()}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
