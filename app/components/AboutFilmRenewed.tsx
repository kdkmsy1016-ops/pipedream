"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

const STILLS = [
  { id: 1, src: "/gallery/gallery-1.png", alt: "映画『盈虚とパイプドリーム』場面写真 1" },
  { id: 2, src: "/gallery/gallery-2.png", alt: "映画『盈虚とパイプドリーム』場面写真 2" },
  { id: 3, src: "/gallery/gallery-3.png", alt: "映画『盈虚とパイプドリーム』場面写真 3" },
  { id: 4, src: "/gallery/gallery-4.png", alt: "映画『盈虚とパイプドリーム』場面写真 4" },
  { id: 5, src: "/gallery/gallery-5.png", alt: "映画『盈虚とパイプドリーム』場面写真 5" },
];

export default function AboutFilmRenewed() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="about" className="relative bg-background py-24 md:py-36 px-6 flex flex-col items-center overflow-hidden border-t border-white/5">
      
      <div className="max-w-4xl w-full mx-auto space-y-20 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            About The Film
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            映画について
          </h2>
        </div>

        {/* Concept / Catchphrase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center font-serif py-6 px-4 bg-zinc-900/40 border-y border-white/5 rounded-sm"
        >
          <h3 className="text-xl md:text-3xl leading-relaxed tracking-widest text-foreground">
            私たちは<span className="font-bold text-accent mx-1">「不要不急」</span>の中で、夢を見た。
          </h3>
          <p className="text-xs md:text-sm text-foreground/60 tracking-widest mt-4">
            コロナ禍の実在スナックを舞台に描く、人生の再生の物語。
          </p>
        </motion.div>

        {/* Story / Synopsis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 text-foreground/80 leading-loose font-serif text-base md:text-lg px-2 md:px-8 text-center max-w-3xl mx-auto"
        >
          <h4 className="text-lg md:text-xl font-bold tracking-widest text-accent/90 border-b border-white/10 pb-3 inline-block">
            あらすじ
          </h4>
          <p className="tracking-wide">
            2021年、東京郊外。<br className="hidden md:block" />
            コロナ禍を言い訳に夢を諦め、実在するスナック「さくらみち」でバイトする俳優志望の桃華は、監督志望の恋人・修平と共依存の日々を送っていた。
          </p>
          <p className="tracking-wide">
            叔父であるマスター・絹山の協力も得て、甘い幻想（パイプドリーム）を断ち切るべくスナックでの演劇上演を決意するが、無常にも3回目の緊急事態宣言が出されてしまう……。
          </p>
        </motion.div>

        {/* Film Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-center font-serif border-t border-white/5 text-xs md:text-sm text-foreground/70">
          <div className="p-4 bg-zinc-900/30 rounded border border-white/5 space-y-1">
            <span className="text-accent/60 block text-[11px] tracking-widest">STAFF</span>
            <p className="text-foreground/90 font-medium">監督・脚本・編集：久高 将也</p>
            <p className="text-foreground/70">脚本：福井 将真</p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded border border-white/5 space-y-1">
            <span className="text-accent/60 block text-[11px] tracking-widest">LOCATION</span>
            <p className="text-foreground/90 font-medium">東京都稲城市</p>
            <p className="text-foreground/70">スナック「さくらみち」</p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded border border-white/5 space-y-1">
            <span className="text-accent/60 block text-[11px] tracking-widest">FORMAT</span>
            <p className="text-foreground/90 font-medium">自主制作長編映画</p>
            <p className="text-foreground/70">劇場完成＆映画祭出品目標</p>
          </div>
        </div>

        {/* Stills Gallery */}
        <div className="space-y-6 pt-8">
          <h4 className="text-center text-sm md:text-base font-serif tracking-[0.2em] text-accent/80 uppercase">
            Film Stills
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {STILLS.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative aspect-[4/3] w-full overflow-hidden rounded cursor-pointer group border border-white/10 ${idx === 0 ? "col-span-2 md:col-span-1" : ""}`}
                onClick={() => setSelectedImage(img.src)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-xs text-white tracking-widest font-serif transition-opacity duration-300 bg-black/60 px-3 py-1.5 rounded">
                    拡大表示
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-50 bg-black/50 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-[16/9] rounded overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Enlarged film still"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
