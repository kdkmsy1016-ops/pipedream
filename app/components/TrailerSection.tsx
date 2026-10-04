"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

interface TrailerSectionProps {
  videoId?: string;
}

export default function TrailerSection({ videoId = "nbCht1onqWU" }: TrailerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section
      id="trailer"
      className="relative w-full bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 flex flex-col items-center overflow-hidden border-t border-white/5"
    >
      <div className="max-w-4xl w-full mx-auto space-y-8 sm:space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            Trailer
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            特報・予告編
          </h2>
        </div>

        {/* Video Area (16:9 aspect ratio container) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-black/90 border border-white/10 shadow-2xl group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
                title="映画『盈虚とパイプドリーム』特報"
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                onClick={handlePlay}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePlay();
                  }
                }}
                className="relative w-full h-full cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="予告編動画を再生する"
              >
                {/* Custom Thumbnail */}
                <Image
                  src="/images/trailer-thumb.jpg"
                  alt="映画『盈虚とパイプドリーム』特報サムネイル"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  priority={false}
                />

                {/* Subtle dark gradient overlay to harmonize with film aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 transition-opacity duration-300 group-hover:opacity-60" />

                {/* Centered Discreet Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-white/40 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/90 transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:text-accent group-hover:bg-black/80 shadow-lg">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ml-1 fill-current" />
                  </div>
                </div>

                {/* Subtle bottom label */}
                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex justify-between items-center text-[10px] sm:text-xs text-foreground/60 font-serif pointer-events-none">
                  <span className="tracking-widest">TEASER TRAILER</span>
                  <span className="tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">PLAY</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
