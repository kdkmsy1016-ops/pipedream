"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
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
    const transformRef = useRef<ReactZoomPanPinchRef>(null);
    const touchStartX = useRef<number | null>(null);
    const isMultiTouch = useRef(false);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flipBookRef = useRef<any>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync fullscreen state & support
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsFullscreenSupported(
            typeof window !== "undefined" &&
            !!document.documentElement.requestFullscreen
        );

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Auto-request native fullscreen on mount when isOpen is true
    useEffect(() => {
        if (isOpen) {
            const enterFullscreen = async () => {
                try {
                    const docEl = document.documentElement;
                    if (docEl.requestFullscreen && !document.fullscreenElement) {
                        await docEl.requestFullscreen();
                    }
                } catch (err) {
                    console.warn("Auto-fullscreen request failed:", err);
                }
            };
            const timer = setTimeout(enterFullscreen, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
        try {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (err) {
            console.error("Fullscreen toggle failed:", err);
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
        onClose();
    };

    // Track window resize and orientation changes to determine orientation
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            // 100ms delay to let iOS Safari complete viewport settling
            setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, 100);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
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
        // Landscape: Double page spread (Total book width = pageWidth * 2)
        const maxTotalWidth = windowSize.width - 160; // Leave margin for navigation arrows
        const maxTotalHeight = windowSize.height - 120; // Leave margin for header/footer

        pageWidth = maxTotalWidth / 2;
        pageHeight = pageWidth / pageAspectRatio;

        if (pageHeight > maxTotalHeight) {
            pageHeight = maxTotalHeight;
            pageWidth = pageHeight * pageAspectRatio;
        }
    } else {
        // Portrait: Single page (Total book width = pageWidth)
        const maxTotalWidth = windowSize.width - 40;
        const maxTotalHeight = windowSize.height - 160;

        pageWidth = maxTotalWidth;
        pageHeight = pageWidth / pageAspectRatio;

        if (pageHeight > maxTotalHeight) {
            pageHeight = maxTotalHeight;
            pageWidth = pageHeight * pageAspectRatio;
        }
    }

    pageWidth = Math.round(pageWidth);
    pageHeight = Math.round(pageHeight);

    // Compute cover & back cover centering translation
    let transformStyle = "none";
    if (displayMode === "double") {
        if (currentPage === 0) {
            transformStyle = `translateX(-${pageWidth / 2}px)`;
        } else if (currentPage === PAGES.length - 1) {
            transformStyle = `translateX(${pageWidth / 2}px)`;
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

    const onFlip = useCallback((e: { data: number }) => {
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

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length > 1) {
            isMultiTouch.current = true;
        } else {
            touchStartX.current = e.touches[0].clientX;
            isMultiTouch.current = false;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || isMultiTouch.current) {
            touchStartX.current = null;
            isMultiTouch.current = false;
            return;
        }

        // Check if zoomed in (scale > 1.05) to avoid conflict with panning
        const scale = transformRef.current?.state?.scale || 1;
        if (scale > 1.05) {
            touchStartX.current = null;
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX.current - touchEndX;

        // Increase threshold to 120px for longer, intentional swipes
        if (diffX > 120) {
            handleNext();
        } else if (diffX < -120) {
            handlePrev();
        }

        touchStartX.current = null;
    };

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
                className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none"
            >
                {/* Header Actions */}
                <AnimatePresence>
                    {showUI && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-6 right-6 z-50 flex items-center gap-4"
                        >
                            {/* Fullscreen Button */}
                            {isFullscreenSupported && (
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-zinc-500 hover:text-[#ffbf00] transition-colors p-3 flex items-center gap-2 group tracking-widest text-xs font-serif uppercase cursor-pointer"
                                >
                                    <span>{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
                                    {isFullscreen ? (
                                        <Minimize2 className="w-4 h-4 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                    ) : (
                                        <Maximize2 className="w-4 h-4 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                    )}
                                </button>
                            )}

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

                {/* Main Viewer Wrapper */}
                <div 
                    className="relative flex items-center justify-center w-full h-full"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
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
                            wrapperClass="!w-full !h-full flex items-center justify-center"
                            contentClass="flex items-center justify-center"
                        >
                            {/* Centering Wrapper Container with custom flex centering & slide transform */}
                            <div className="flex items-center justify-center">
                                <div 
                                    className="relative flex items-center justify-center transition-transform duration-500 ease-in-out"
                                    style={{
                                        width: isLandscape ? `${pageWidth * 2}px` : `${pageWidth}px`,
                                        height: `${pageHeight}px`,
                                        transform: transformStyle
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
                                        showCover={true}
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

                                    {/* Book Binding Crease Shadow overlay (Stationary in 3D center crease) */}
                                    {isLandscape && currentPage > 0 && currentPage < 19 && (
                                        <div
                                            className="absolute top-0 bottom-0 pointer-events-none z-30 w-[40px]"
                                            style={{
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)"
                                            }}
                                        />
                                    )}
                                </div>
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
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
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
