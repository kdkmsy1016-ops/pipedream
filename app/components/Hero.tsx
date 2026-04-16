"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
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

        const onYouTubeIframeAPIReady = () => {
            new (window as any).YT.Player("hero-yt-player", {
                videoId: "nbCht1onqWU",
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
            onYouTubeIframeAPIReady();
        } else {
            (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
    }, []);

    return (
        <section className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none">
            
            {/* Background Container */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                
                {/* YouTube Video */}
                <div 
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${videoEnded ? 'opacity-0' : 'opacity-100'}`}
                >
                    <div
                        id="hero-yt-player"
                        className="w-[300vw] h-[300vh] md:w-[150vw] md:h-[150vh] xl:w-[120vw] xl:h-[120vh]"
                        style={{ pointerEvents: "none" }}
                    />
                </div>

                {/* Fallback / End Image (hero-bg.png) */}
                <div 
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${videoEnded ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src="/hero-bg.png"
                        alt="盈虚とパイプドリーム"
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>

                {/* Dark Gradient Overlay for Cinematic Feel */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none" />
            </div>

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
