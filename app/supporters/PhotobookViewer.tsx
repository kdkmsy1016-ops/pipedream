"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

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

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Timer to auto-hide UI in fullscreen mode
    const resetUITimer = useCallback(() => {
        if (!isFullscreen) {
            setShowUI(true);
            return;
        }
        setShowUI(true);
        if (uiTimeoutRef.current) {
            clearTimeout(uiTimeoutRef.current);
        }
        uiTimeoutRef.current = setTimeout(() => {
            setShowUI(false);
        }, 3000); // Auto-hide after 3 seconds of inactivity
    }, [isFullscreen]);

    // Track user activity to trigger UI visibility in fullscreen
    useEffect(() => {
        if (!isOpen) return;
        if (!isFullscreen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowUI(true);
            return;
        }

        const handleActivity = () => {
            resetUITimer();
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("touchstart", handleActivity);
        window.addEventListener("click", handleActivity);

        resetUITimer(); // Start initial countdown

        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
            window.removeEventListener("click", handleActivity);
            if (uiTimeoutRef.current) {
                clearTimeout(uiTimeoutRef.current);
            }
        };
    }, [isOpen, isFullscreen, resetUITimer]);

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

    // Track window resize to determine orientation
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

    const isLandscape = windowSize.width > windowSize.height;

    const handlePrev = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
        if (!isLandscape) {
            setCurrentPage((prev) => Math.max(prev - 1, 0));
        } else {
            if (currentPage === PAGES.length - 1) {
                setCurrentPage(PAGES.length - 3); // Go back to last spread (18 & 19, indices 17 & 18)
            } else if (currentPage === 1) {
                setCurrentPage(0); // Go back to Cover (index 0)
            } else {
                setCurrentPage((prev) => Math.max(prev - 2, 0));
            }
        }
    }, [isLandscape, currentPage]);

    const handleNext = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
        if (!isLandscape) {
            setCurrentPage((prev) => Math.min(prev + 1, PAGES.length - 1));
        } else {
            if (currentPage === 0) {
                setCurrentPage(1); // Go to first spread (2 & 3, indices 1 & 2)
            } else if (currentPage === PAGES.length - 3) {
                setCurrentPage(PAGES.length - 1); // Go to Back Cover (index 19)
            } else {
                setCurrentPage((prev) => Math.min(prev + 2, PAGES.length - 1));
            }
        }
    }, [isLandscape, currentPage]);

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
    }, [isOpen, currentPage, isLandscape, handleNext, handlePrev]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;

        // Check if zoomed in (scale > 1.05) to avoid conflict with panning
        const scale = transformRef.current?.state?.scale || 1;
        if (scale > 1.05) {
            touchStartX.current = null;
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX.current - touchEndX;

        if (diffX > 50) {
            handleNext();
        } else if (diffX < -50) {
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

    // Adjust page position when orientation changes to align with spreads
    useEffect(() => {
        if (isLandscape) {
            if (currentPage > 0 && currentPage < PAGES.length - 1) {
                if (currentPage % 2 === 0) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setCurrentPage(currentPage - 1);
                }
            }
        }
    }, [isLandscape, currentPage]);

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
        if (!isLandscape) {
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

    const isDoubleSpread = isLandscape && currentPage > 0 && currentPage < PAGES.length - 1;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-[#0b0e14] flex flex-col items-center justify-center select-none"
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

                            {/* A24 Close Button */}
                            <button
                                onClick={onClose}
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
                    className={`relative flex items-center justify-center w-full transition-all duration-300 ${isFullscreen ? "max-h-screen px-0" : "max-h-[75vh] px-4"}`}
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
                            {isDoubleSpread ? (
                                /* Landscape: Double Page Spread (100% Seamless, 0px gap) */
                                <div 
                                    style={{
                                        width: isFullscreen ? "100vw" : "85vw",
                                        maxWidth: isFullscreen ? "calc(100vh * 4960 / 3508)" : "min(896px, calc(70vh * 4960 / 3508))",
                                        maxHeight: isFullscreen ? "100vh" : "70vh",
                                        aspectRatio: "4960 / 3508"
                                    }}
                                    className={`relative flex bg-[#0b0e14] overflow-hidden gap-0 border-0 p-0 m-0 transition-all duration-300 ${isFullscreen ? "" : "shadow-[0_30px_70px_rgba(0,0,0,0.8)]"}`}
                                >
                                    {/* Left Page */}
                                    <div className="w-1/2 h-full relative overflow-hidden">
                                        {preloaded || currentPage < 4 ? (
                                            <img
                                                src={PAGES[currentPage]}
                                                alt={`Page ${currentPage + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#0b0e14]">
                                                <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#ffbf00] rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Right Page */}
                                    <div className="w-1/2 h-full relative overflow-hidden">
                                        {preloaded || currentPage + 1 < 4 ? (
                                            <img
                                                src={PAGES[currentPage + 1]}
                                                alt={`Page ${currentPage + 2}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#0b0e14]">
                                                <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#ffbf00] rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Portrait (or Landscape Cover/Back Cover): Single Page */
                                <div 
                                    style={{
                                        width: isFullscreen ? "100vw" : "85vw",
                                        maxWidth: isFullscreen ? "calc(100vh * 2480 / 3508)" : "min(448px, calc(70vh * 2480 / 3508))",
                                        maxHeight: isFullscreen ? "100vh" : "70vh",
                                        aspectRatio: "2480 / 3508"
                                    }}
                                    className={`relative bg-[#0b0e14] overflow-hidden border-0 p-0 m-0 transition-all duration-300 ${isFullscreen ? "" : "shadow-[0_30px_70px_rgba(0,0,0,0.8)]"}`}
                                >
                                    {preloaded || currentPage < 4 ? (
                                        <img
                                            src={PAGES[currentPage]}
                                            alt={`Page ${currentPage + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#0b0e14]">
                                            <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#ffbf00] rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            )}
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
