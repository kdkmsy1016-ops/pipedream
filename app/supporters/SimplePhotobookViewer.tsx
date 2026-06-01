"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGES = Array.from({ length: 20 }, (_, i) => `/images/photobook/page-${i + 1}.webp`);

type SimplePhotobookViewerProps = {
    isOpen: boolean;
    onClose: () => void;
    initialPage?: number;
};

export default function SimplePhotobookViewer({ isOpen, onClose, initialPage }: SimplePhotobookViewerProps) {
    const [currentPage, setCurrentPage] = useState(initialPage ?? 0);
    const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
    const transformRef = useRef<ReactZoomPanPinchRef>(null);

    // Track window size and orientation
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

    const isPortrait = windowSize.height >= windowSize.width;
    const lastPageIndex = PAGES.length - 1;
    const isCoverPage = currentPage === 0;
    const isBackCoverPage = currentPage === lastPageIndex;
    const shouldShowSinglePage = isPortrait || isCoverPage || isBackCoverPage;
    const pagesPerView = shouldShowSinglePage ? 1 : 2;

    const visiblePages = useMemo(() => {
        return pagesPerView === 1
            ? [currentPage]
            : [currentPage, currentPage + 1].filter(
                (index) => index > 0 && index < lastPageIndex
            );
    }, [currentPage, pagesPerView, lastPageIndex]);

    // Alignment when transitioning to landscape mode
    useEffect(() => {
        if (!isOpen) return;
        if (isPortrait) return;

        const timer = setTimeout(() => {
            setCurrentPage((prev) => {
                if (prev === 0 || prev === lastPageIndex) return prev;

                const lastInnerPageIndex = lastPageIndex - 1;
                const lastSpreadStart =
                    lastInnerPageIndex % 2 === 0
                        ? lastInnerPageIndex - 1
                        : lastInnerPageIndex;

                if (prev >= lastPageIndex) return lastPageIndex;
                if (prev > lastSpreadStart) return lastSpreadStart;

                if (prev % 2 === 0) {
                    return Math.max(1, prev - 1);
                }

                return prev;
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [isOpen, isPortrait, lastPageIndex]);

    const getLastSpreadStart = useCallback(() => {
        const lastInnerPageIndex = lastPageIndex - 1;
        return Math.max(
            1,
            lastInnerPageIndex % 2 === 0
                ? lastInnerPageIndex - 1
                : lastInnerPageIndex
        );
    }, [lastPageIndex]);

    const goNext = useCallback(() => {
        setCurrentPage((prev) => {
            if (isPortrait) {
                return Math.min(prev + 1, lastPageIndex);
            }

            if (prev === 0) return 1;

            const lastSpreadStart = getLastSpreadStart();
            if (prev >= lastSpreadStart) {
                return lastPageIndex;
            }

            return Math.min(prev + 2, lastPageIndex);
        });
    }, [isPortrait, lastPageIndex, getLastSpreadStart]);

    const goPrev = useCallback(() => {
        setCurrentPage((prev) => {
            if (isPortrait) {
                return Math.max(prev - 1, 0);
            }

            if (prev === lastPageIndex) {
                return getLastSpreadStart();
            }

            if (prev <= 1) return 0;

            return Math.max(prev - 2, 0);
        });
    }, [isPortrait, lastPageIndex, getLastSpreadStart]);

    // Keyboard handlers
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                goNext();
            } else if (e.key === "ArrowLeft") {
                goPrev();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, goNext, goPrev, onClose]);

    // Tap to flip
    const handleViewerTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.closest("[data-viewer-ui='true']")) return;

        const scale = transformRef.current?.state?.scale ?? 1;
        if (scale > 1.05) return;

        const tapX = e.clientX;
        const screenCenter = window.innerWidth / 2;

        if (tapX < screenCenter) {
            goPrev();
        } else {
            goNext();
        }
    }, [goPrev, goNext]);

    // Scroll locks
    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    // Preload adjacent pages
    useEffect(() => {
        if (!isOpen) return;

        const maxVisible = Math.max(...visiblePages);
        const preloadIndexes = new Set<number>();

        // Preload next 4 pages
        for (let i = 1; i <= 4; i++) {
            preloadIndexes.add(maxVisible + i);
        }

        // Preload previous 2 pages
        const minVisible = Math.min(...visiblePages);
        for (let i = 1; i <= 2; i++) {
            preloadIndexes.add(minVisible - i);
        }

        preloadIndexes.forEach((index) => {
            if (index < 0 || index >= PAGES.length) return;

            const img = new window.Image();
            img.src = PAGES[index];
        });
    }, [isOpen, visiblePages]);

    if (!isOpen) return null;

    const getPageIndicator = () => {
        const lastPageIndex = PAGES.length - 1;

        if (currentPage === 0) {
            return `1 / ${PAGES.length}`;
        }

        if (currentPage === lastPageIndex) {
            return `${PAGES.length} / ${PAGES.length}`;
        }

        if (pagesPerView === 1) {
            return `${currentPage + 1} / ${PAGES.length}`;
        }

        const leftPageNum = currentPage + 1;
        const rightPageNum = Math.min(currentPage + 2, PAGES.length - 1);

        return `${leftPageNum} – ${rightPageNum} / ${PAGES.length}`;
    };

    const viewerPadding = 16;
    const reservedHeight = 80;

    const getPageSlotStyle = (position: number): React.CSSProperties => {
        if (pagesPerView === 2) {
            return {
                width: `calc((100vw - ${viewerPadding * 2}px) / 2)`,
                height: `calc(100dvh - ${reservedHeight}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: position === 0 ? "flex-end" : "flex-start",
                flexShrink: 0,
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
            };
        }

        return {
            width: `calc(100vw - ${viewerPadding * 2}px)`,
            height: `calc(100dvh - ${reservedHeight}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
        };
    };

    return (
        <div
            className="fixed inset-0 z-[99999] bg-black text-white overflow-hidden select-none"
            onClick={handleViewerTap}
        >
            {/* Close Button Container */}
            <div
                className="absolute top-4 right-4 z-50 flex items-center gap-3"
                data-viewer-ui="true"
            >
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white transition-colors p-3 tracking-widest text-xs font-serif uppercase cursor-pointer"
                >
                    CLOSE
                </button>
            </div>

            {/* Main Interactive Zoomable image area */}
            <div className="w-full h-full flex items-center justify-center">
                <TransformWrapper
                    ref={transformRef}
                    key={`${currentPage}-${pagesPerView}`}
                    initialScale={1}
                    minScale={1}
                    maxScale={4}
                    centerOnInit={true}
                    centerZoomedOut={true}
                    limitToBounds={true}
                    wheel={{ disabled: false }}
                    pinch={{ disabled: false }}
                    panning={{ disabled: false, velocityDisabled: true }}
                    doubleClick={{ disabled: true }}
                >
                    <TransformComponent
                        wrapperClass="!w-full !h-full"
                        contentClass="w-full h-full flex items-center justify-center"
                    >
                        <div
                            className="flex items-center justify-center h-full shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
                            style={{
                                gap: 0,
                                padding: `${viewerPadding}px`,
                                boxSizing: "border-box",
                                width: "100vw",
                            }}
                        >
                            {visiblePages.map((pageIndex, position) => (
                                <div key={pageIndex} style={getPageSlotStyle(position)}>
                                    <Image
                                        src={PAGES[pageIndex]}
                                        alt={`Page ${pageIndex + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={80}
                                        priority={pageIndex <= 2}
                                        className="object-contain select-none"
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>

            {/* Bottom Page Indicator */}
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-xs text-zinc-400 tracking-[0.2em] font-serif uppercase"
                data-viewer-ui="true"
            >
                {getPageIndicator()}
            </div>

            {/* Left Button */}
            <button
                data-viewer-ui="true"
                onClick={goPrev}
                disabled={currentPage === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-zinc-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 cursor-pointer"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-8 h-8 stroke-1" />
            </button>

            {/* Right Button */}
            <button
                data-viewer-ui="true"
                onClick={goNext}
                disabled={currentPage >= PAGES.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-zinc-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors p-4 cursor-pointer"
                aria-label="Next Page"
            >
                <ChevronRight className="w-8 h-8 stroke-1" />
            </button>
        </div>
    );
}
