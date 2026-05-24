"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
    const pagesPerView = isPortrait ? 1 : 2;

    const visiblePages =
        pagesPerView === 1
            ? [currentPage]
            : [currentPage, currentPage + 1].filter((index) => index < PAGES.length);

    const goNext = useCallback(() => {
        setCurrentPage((prev) => {
            const step = pagesPerView === 1 ? 1 : 2;
            return Math.min(prev + step, PAGES.length - 1);
        });
    }, [pagesPerView]);

    const goPrev = useCallback(() => {
        setCurrentPage((prev) => {
            const step = pagesPerView === 1 ? 1 : 2;
            return Math.max(prev - step, 0);
        });
    }, [pagesPerView]);

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

    if (!isOpen) return null;

    const getPageIndicator = () => {
        if (pagesPerView === 1) {
            return `${currentPage + 1} / ${PAGES.length}`;
        } else {
            if (currentPage === 0) {
                return `1 / ${PAGES.length}`;
            }
            if (currentPage === PAGES.length - 1) {
                return `${PAGES.length} / ${PAGES.length}`;
            }
            const leftPageNum = currentPage + 1;
            const rightPageNum = Math.min(leftPageNum + 1, PAGES.length);
            return `${leftPageNum} – ${rightPageNum} / ${PAGES.length}`;
        }
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
                        <div className="flex items-center justify-center gap-2 w-full h-full p-4">
                            {visiblePages.map((pageIndex) => (
                                <img
                                    key={pageIndex}
                                    src={PAGES[pageIndex]}
                                    alt={`Page ${pageIndex + 1}`}
                                    className="max-h-[calc(100dvh-80px)] max-w-full object-contain select-none shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
                                    draggable={false}
                                />
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
