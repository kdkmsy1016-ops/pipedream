"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutFilm() {
    return (
        <section id="about-film" className="bg-black py-32 px-6 md:py-48 flex flex-col items-center min-h-[100svh] justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="max-w-3xl w-full text-center space-y-24"
            >
                <div 
                    className="space-y-12 text-white/80 font-serif text-sm md:text-base px-8 md:px-0 text-center max-w-2xl mx-auto"
                    style={{ wordBreak: "keep-all", overflowWrap: "anywhere", lineHeight: 2.5, letterSpacing: '0.15em' }}
                >
                    <p>
                        2021年、東京郊外。<br className="hidden md:block" />コロナ禍を言い訳に夢を諦め、<br className="block md:hidden" />スナック「さくらみち」で<br className="hidden md:block" />バイトする俳優志望の桃華は、<br className="block md:hidden" />監督志望の恋人・修平と<br className="hidden md:block" />共依存の日々を送っていた。
                    </p>
                    <p>
                        叔父であるマスター・絹山の協力も得て、<br className="block md:hidden" />甘い幻想（パイプドリーム）を断ち切るべく<br className="hidden md:block" />スナックでの演劇上演を決意するが、<br className="block md:hidden" />無常にも3回目の<br className="hidden md:block" />緊急事態宣言が出されてしまう……。
                    </p>
                </div>

                <div className="pt-16 flex flex-col items-center">
                    <Link
                        href="/crowdfunding"
                        className="inline-block px-12 py-4 border border-white/20 text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-700 font-serif tracking-[0.3em] text-xs uppercase"
                    >
                        SUPPORT THIS PROJECT
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
