"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const GALLERY_IMAGES = [
    { id: 1, src: "https://picsum.photos/seed/gallery1/800/600", alt: "Gallery Image 1" },
    { id: 2, src: "https://picsum.photos/seed/gallery2/800/600", alt: "Gallery Image 2" },
    { id: 3, src: "https://picsum.photos/seed/gallery3/800/600", alt: "Gallery Image 3" },
    { id: 4, src: "https://picsum.photos/seed/gallery4/800/600", alt: "Gallery Image 4" },
    { id: 5, src: "https://picsum.photos/seed/gallery5/800/600", alt: "Gallery Image 5" },
    { id: 6, src: "https://picsum.photos/seed/gallery6/800/600", alt: "Gallery Image 6" },
];

export default function GallerySection() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section id="gallery" className="bg-background py-32 md:py-48 px-4 flex flex-col items-center">
            <div className="max-w-6xl w-full space-y-16">
                
                {/* Header */}
                <div className="text-center space-y-6">
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase">
                        Gallery
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-widest font-serif text-foreground">
                        場面写真
                    </h3>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {GALLERY_IMAGES.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => setSelectedImage(img.src)}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </motion.div>
                    ))}
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
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-white hover:text-accent transition-colors z-50 bg-black/50 p-2 rounded-full"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-5xl aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                        >
                            <Image
                                src={selectedImage}
                                alt="Enlarged gallery image"
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
