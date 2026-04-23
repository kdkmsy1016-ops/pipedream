"use client";

import { motion } from "framer-motion";

export default function TrailerSection() {
    return (
        <section id="trailer" className="bg-background py-32 md:py-48 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-16">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase">
                        Teaser Trailer
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-widest font-serif text-foreground">
                        特報
                    </h3>
                </div>

                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black"
                >
                    <iframe
                        src="https://www.youtube.com/embed/nbCht1onqWU?rel=0&modestbranding=1"
                        title="盈虚とパイプドリーム 特報"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full border-0"
                    />
                </motion.div>

            </div>
        </section>
    );
}
