"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import HTMLFlipBook from "react-pageflip";

const PAGES = Array.from({ length: 20 }, (_, i) => `/images/photobook/page-${i + 1}.webp`);

const isIOSDevice = () => {
    if (typeof window === "undefined") return false;

    return (
        /iP(ad|hone|od)/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
};

interface PhotobookViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PhotobookViewer({ isOpen, onClose }: PhotobookViewerProps) {
    const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
    const [currentPage, setCurrentPage] = useState(0);
    const [preloaded, setPreloaded] = useState(false);
    const transformRef = useRef<ReactZoomPanPinchRef>(null);
    const tapStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
    const activePointersRef = useRef<Set<number>>(new Set());
    const isPinchingRef = useRef(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flipBookRef = useRef<any>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const uiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isActuallyFullscreen = isFullscreen || isPseudoFullscreen;

    // Sync fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            const active = !!document.fullscreenElement;
            setIsFullscreen(active);

            if (active) {
                setIsPseudoFullscreen(false);
            }
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const canUseNativeFullscreen = () => {
        if (typeof document === "undefined") return false;
        if (isIOSDevice()) return false;

        return !!document.documentElement.requestFullscreen;
    };

    // Timer to auto-hide UI overlays
    const resetUITimer = useCallback(() => {
        setShowUI(true);
        if (uiTimeoutRef.current) {
            clearTimeout(uiTimeoutRef.current);
        }
        uiTimeoutRef.current = setTimeout(() => {
            setShowUI(false);
        }, 3000); // Auto-hide after 3 seconds of inactivity
    }, []);

    // Track user activity to trigger UI visibility (mouse, touch, click)
    useEffect(() => {
        if (!isOpen) return;

        const handleActivity = () => {
            resetUITimer();
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("touchstart", handleActivity);
        window.addEventListener("click", handleActivity);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        resetUITimer(); // Start initial countdown on mount

        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
            window.removeEventListener("click", handleActivity);
            if (uiTimeoutRef.current) {
                clearTimeout(uiTimeoutRef.current);
            }
        };
    }, [isOpen, resetUITimer]);

    const toggleFullscreen = async () => {
        // iOS / iPhone Chrome ではネイティブFullscreenを試さず、即座に疑似Fullscreenへ切り替える
        if (isIOSDevice()) {
            setIsPseudoFullscreen((prev) => {
                const next = !prev;
                if (next) {
                    setShowUI(false);
                } else {
                    setShowUI(true);
                }
                return next;
            });
            return;
        }

        try {
            if (canUseNativeFullscreen()) {
                if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
                    setIsPseudoFullscreen(false);
                } else {
                    await document.exitFullscreen();
                }
            } else {
                setIsPseudoFullscreen((prev) => !prev);
            }
        } catch (err) {
            console.warn("Native fullscreen failed. Falling back to pseudo fullscreen.", err);
            setIsPseudoFullscreen((prev) => !prev);
        }
    };

    const handleClose = async () => {
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Failed to exit fullscreen:", err);
        }
        setIsPseudoFullscreen(false);
        onClose();
    };

    // Track window resize and orientation changes to determine orientation
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
            const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

            setWindowSize({
                width: viewportWidth,
                height: viewportHeight,
            });
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, [isOpen]);

    const isLandscape = windowSize.width > windowSize.height;
    const displayMode = isLandscape ? "double" : "single";

    // Aspect ratio of a single page is 2480 / 3508
    const pageAspectRatio = 2480 / 3508;
    let pageWidth = 0;
    let pageHeight = 0;

    if (isLandscape) {
        const horizontalMargin = isActuallyFullscreen ? 48 : 160;
        const verticalMargin = isActuallyFullscreen ? 32 : 120;

        const maxTotalWidth = windowSize.width - horizontalMargin;
        const maxTotalHeight = windowSize.height - verticalMargin;

        pageWidth = maxTotalWidth / 2;
        pageHeight = pageWidth / pageAspectRatio;

        if (pageHeight > maxTotalHeight) {
            pageHeight = maxTotalHeight;
            pageWidth = pageHeight * pageAspectRatio;
        }
    } else {
        const horizontalMargin = isActuallyFullscreen ? 8 : 40;
        const verticalMargin = isActuallyFullscreen ? 24 : 160;

        const maxTotalWidth = windowSize.width - horizontalMargin;
        const maxTotalHeight = windowSize.height - verticalMargin;

        pageWidth = maxTotalWidth;
        pageHeight = pageWidth / pageAspectRatio;

        if (pageHeight > maxTotalHeight) {
            pageHeight = maxTotalHeight;
            pageWidth = pageHeight * pageAspectRatio;
        }
    }

    pageWidth = Math.round(pageWidth);
    pageHeight = Math.round(pageHeight);

    const totalPages = PAGES.length;
    const bookWidth = displayMode === "double" ? pageWidth * 2 : pageWidth;

    let coverOffsetX = 0;
    if (displayMode === "double") {
        if (currentPage === 0) {
            coverOffsetX = -pageWidth / 2;
        } else if (currentPage >= totalPages - 1) {
            coverOffsetX = pageWidth / 2;
        }
    }

    const handlePrev = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    }, []);

    const handleNext = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
        }
    }, []);

    const handleTapPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        activePointersRef.current.add(e.pointerId);

        if (activePointersRef.current.size > 1) {
            isPinchingRef.current = true;
            tapStartRef.current = null;
            return;
        }

        tapStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            pointerId: e.pointerId,
        };
    }, []);

    const handleTapPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        activePointersRef.current.delete(e.pointerId);

        if (isPinchingRef.current) {
            if (activePointersRef.current.size === 0) {
                isPinchingRef.current = false;
            }
            tapStartRef.current = null;
            return;
        }

        if (!tapStartRef.current) return;
        if (tapStartRef.current.pointerId !== e.pointerId) return;

        const dx = Math.abs(e.clientX - tapStartRef.current.x);
        const dy = Math.abs(e.clientY - tapStartRef.current.y);

        tapStartRef.current = null;

        // 10px以上動いた場合はタップではなくドラッグ／フリック扱いにする
        if (dx > 10 || dy > 10) return;

        const tapX = e.clientX;
        const screenCenter = window.innerWidth / 2;

        if (tapX < screenCenter) {
            handlePrev();
        } else {
            handleNext();
        }
    }, [handlePrev, handleNext]);

    const handleTapPointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        activePointersRef.current.delete(e.pointerId);

        if (activePointersRef.current.size === 0) {
            isPinchingRef.current = false;
        }

        tapStartRef.current = null;
    }, []);

    // 2. ページがめくられた時にStateを更新
    const onPageChange = useCallback((e: { data: number }) => {
        setCurrentPage(e.data);
    }, []);

    // Keyboard navigation (Arrow keys)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleNext, handlePrev]);



    // Lock body and html scroll when modal is open or pseudo-fullscreen is active
    useEffect(() => {
        if (isOpen || isPseudoFullscreen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
            document.body.style.overscrollBehavior = "none";
            document.documentElement.style.overscrollBehavior = "none";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.overscrollBehavior = "";
            document.documentElement.style.overscrollBehavior = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.overscrollBehavior = "";
            document.documentElement.style.overscrollBehavior = "";
        };
    }, [isOpen, isPseudoFullscreen]);


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

    const getPageIndicator = () => {
        if (displayMode === "single") {
            return `${currentPage + 1} / 20`;
        } else {
            if (currentPage === 0) {
                return "1 / 20";
            }
            if (currentPage === PAGES.length - 1) {
                return "20 / 20";
            }
            const leftPageNum = currentPage + 1;
            const rightPageNum = Math.min(leftPageNum + 1, PAGES.length);
            return `${leftPageNum} – ${rightPageNum} / 20`;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={[
                    "fixed inset-0 bg-black flex flex-col items-center justify-center select-none overflow-hidden",
                    isActuallyFullscreen ? "z-[99999]" : "z-[9999]",
                ].join(" ")}
                style={{
                    width: "100vw",
                    height: "100dvh",
                    minHeight: "100svh",
                    paddingTop: isActuallyFullscreen ? "env(safe-area-inset-top)" : undefined,
                    paddingBottom: isActuallyFullscreen ? "env(safe-area-inset-bottom)" : undefined,
                }}
            >
                {/* Header Actions */}
                <AnimatePresence>
                    {showUI && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={[
                                "absolute right-4 z-50 flex items-center gap-3",
                                isActuallyFullscreen ? "top-3" : "top-6",
                            ].join(" ")}
                        >
                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-zinc-500 hover:text-[#ffbf00] transition-colors p-3 flex items-center gap-2 group tracking-widest text-xs font-serif uppercase cursor-pointer"
                            >
                                <span>{isActuallyFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
                                {isActuallyFullscreen ? (
                                    <Minimize2 className="w-4 h-4 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                ) : (
                                    <Maximize2 className="w-4 h-4 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                )}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="text-zinc-500 hover:text-[#ffbf00] transition-colors p-3 flex items-center gap-2 group tracking-widest text-xs font-serif uppercase cursor-pointer"
                            >
                                <span>CLOSE</span>
                                <X className="w-4 h-4 stroke-1 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Left Navigation Arrow */}
                <AnimatePresence>
                    {showUI && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ffbf00] disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 z-40 cursor-pointer"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft className="w-8 h-8 stroke-1" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <div
                    className="absolute inset-0 z-30"
                    style={{
                        touchAction: "pan-x pan-y pinch-zoom",
                    }}
                    onPointerDown={handleTapPointerDown}
                    onPointerUp={handleTapPointerUp}
                    onPointerCancel={handleTapPointerCancel}
                />

                {/* Main Viewer Wrapper */}
                <div 
                    className="relative flex items-center justify-center w-full h-full"
                >
                    <TransformWrapper
                        ref={transformRef}
                        initialScale={1}
                        minScale={0.9}
                        maxScale={4}
                        centerOnInit={true}
                        wheel={{ disabled: false }}
                        pinch={{ disabled: false }}
                        doubleClick={{ mode: "reset" }}
                    >
                        <TransformComponent
                            wrapperClass="!w-full !h-full relative"
                            contentClass="!w-full !h-full relative"
                        >
                            {/* Inner wrapper container with custom translation centering on the book dimensions */}
                            <div 
                                className="absolute top-1/2 left-1/2 transition-transform duration-500 ease-out origin-center"
                                style={{
                                    width: `${bookWidth}px`,
                                    height: `${pageHeight}px`,
                                    // 通常の中央寄せ（-50%, -50%）に加えて、表紙/裏表紙 ofset (coverOffsetX) を合算する
                                    transform: `translate(-50%, -50%) translateX(${coverOffsetX}px)`
                                }}
                            >
                                <HTMLFlipBook
                                    width={pageWidth}
                                    height={pageHeight}
                                    size="fixed"
                                    autoSize={false}
                                    display={displayMode}
                                    ref={flipBookRef}
                                    onFlip={onPageChange}
                                    showCover={true}
                                    drawShadow={false}
                                    flippingTime={300}
                                    usePortrait={!isLandscape}
                                    useMouseEvents={false}
                                    mobileScrollSupport={true}
                                    className="shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
                                    style={{
                                        width: `${bookWidth}px`,
                                        height: `${pageHeight}px`,
                                        margin: 0,
                                        boxSizing: "border-box",
                                    }}
                                    key={`${displayMode}-${pageWidth}-${pageHeight}`}
                                    startPage={currentPage}
                                >
                                    {PAGES.map((src, index) => {
                                        const showPage = index < 4 || preloaded;

                                        return (
                                            <div
                                                key={index}
                                                className="w-full h-full bg-[#0b0e14] relative overflow-hidden box-border"
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
                                            </div>
                                        );
                                    })}
                                </HTMLFlipBook>
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>

                {/* Right Navigation Arrow */}
                <AnimatePresence>
                    {showUI && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleNext}
                            disabled={currentPage >= PAGES.length - 1}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ffbf00] disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 z-40 cursor-pointer"
                            aria-label="Next Page"
                        >
                            <ChevronRight className="w-8 h-8 stroke-1" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Footer Page Number */}
                <AnimatePresence>
                    {showUI && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className={[
                                "absolute left-1/2 -translate-x-1/2 z-40",
                                isActuallyFullscreen ? "bottom-3" : "bottom-8",
                            ].join(" ")}
                        >
                            <p className="text-zinc-500 text-xs tracking-[0.2em] font-serif uppercase">
                                {getPageIndicator()}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
