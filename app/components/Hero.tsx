"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Youtube } from "lucide-react";

export default function Hero() {
    const [videoEnded, setVideoEnded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const playerRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        
        let resizeTimer: any;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkMobile, 150);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        // Load YouTube Iframe API
        if (!(window as any).YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                document.head.appendChild(tag);
            }
        }

        const initPlayer = () => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
            playerRef.current = new (window as any).YT.Player("hero-yt-player", {
                videoId: isMobile ? "2irEtYqCGZQ" : "nbCht1onqWU",
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    loop: 0,
                },
                events: {
                    onStateChange: (event: any) => {
                        if (event.data === (window as any).YT.PlayerState.ENDED) {
                            setVideoEnded(true);
                        }
                    },
                },
            });
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        }
    }, [isMounted, isMobile]);

    const toggleMute = () => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.unMute();
                setIsMuted(false);
            } else {
                playerRef.current.mute();
                setIsMuted(true);
            }
        }
    };

    const currentVideoId = isMobile ? "2irEtYqCGZQ" : "nbCht1onqWU";

    return (
        <section className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none">
            
            {/* Background Container */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                
                {/* YouTube Video */}
                {isMounted && (
                    <div 
                        className={`absolute inset-0 transition-opacity duration-1000 ${videoEnded ? 'opacity-0' : 'opacity-100'}`}
                    >
                        <div
                            id="hero-yt-player"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                minWidth: "100%",
                                minHeight: "100%",
                                width: "auto",
                                height: "auto",
                                aspectRatio: isMobile ? "9/16" : "16/9",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                )}

                {/* Fallback / End Image (hero-bg.png) */}
                <div 
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${videoEnded || !isMounted ? 'opacity-100' : 'opacity-0'}`}
                >
                    {isMounted && (
                        <Image
                            src={isMobile ? "/hero-bg-mobile.png" : "/hero-bg.png"}
                            alt="盈虚とパイプドリーム"
                            width={isMobile ? 1080 : 1920}
                            height={isMobile ? 1920 : 1080}
                            className="w-full h-full object-cover"
                            priority
                            sizes="100vw"
                        />
                    )}
                </div>

            </div>

            {/* Audio & External Link Controls */}
            {!videoEnded && isMounted && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 2 }}
                    className="absolute bottom-8 right-8 z-50 flex items-center gap-6 pointer-events-auto"
                >
                    <a
                        href={`https://youtu.be/${currentVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/40 hover:text-white/90 transition-all duration-500 font-serif text-[10px] md:text-xs uppercase tracking-widest"
                    >
                        <Youtube className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                        <span className="hidden sm:inline">Watch on YouTube</span>
                    </a>
                    <button
                        onClick={toggleMute}
                        className="text-white/40 hover:text-white/90 transition-all duration-500 flex items-center justify-center"
                        aria-label="Toggle mute"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />}
                    </button>
                </motion.div>
            )}

            {/* SEO Hidden Text */}
            <div className="sr-only">
                <h1>盈虚とパイプドリーム Phases of a Pipe Dream</h1>
                <p>私たちは『不要不急』の中で、夢を見た。</p>
                <p>脚本: 福井 将真 / 監督: 久高 将也</p>
                <p>映画プロジェクト始動</p>
            </div>

        </section>
    );
}
