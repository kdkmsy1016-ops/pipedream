"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutFilm() {
    return (
        <section id="about-film" className="relative bg-background py-32 md:py-48 px-6 flex flex-col items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/about_bg.jpg"
                    alt="About Film Background"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-3xl w-full text-center space-y-16"
            >
                <div className="space-y-8">
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase">
                        About Film
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-widest font-serif text-foreground">
                        物語
                    </h3>
                </div>

                <div
                    className="space-y-8 text-foreground/80 leading-loose font-serif text-base md:text-lg lg:text-xl px-8 md:px-0 text-center max-w-3xl mx-auto"
                    style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}
                >
                    <p>
                        2021年、東京郊外。<br className="hidden md:block" />コロナ禍を言い訳に夢を諦め、スナック「さくらみち」でバイトする俳優志望の桃華は、監督志望の恋人・修平と共依存の日々を送っていた。
                    </p>
                    <p>
                        叔父であるマスター・絹山の協力も得て、甘い幻想（パイプドリーム）を断ち切るべくスナックでの演劇上演を決意するが、無常にも3回目の緊急事態宣言が出されてしまう……。
                    </p>
                </div>

            </motion.div>
        </section>
    );
}
