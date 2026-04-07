"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import HeroButton from "./HeroButton";

export default function AboutFilm() {
    return (
        <section className="py-20 md:py-32 px-6 bg-zinc-950 text-white flex flex-col items-center border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl w-full text-center space-y-12"
            >
                <div className="space-y-4">
                    <span className="text-xs md:text-sm tracking-[0.2em] text-[#ffbf00] uppercase font-serif block">
                        About Film
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-widest font-serif">
                        物語
                    </h2>
                </div>

                <div className="text-sm md:text-base leading-loose tracking-wide text-zinc-300 font-serif text-justify md:text-center space-y-6">
                    <p>
                        2021年、東京郊外。コロナ禍を言い訳に夢を諦め、スナック「さくらみち」でバイトする俳優志望の桃華は、監督志望の恋人・修平と共依存の日々を送っていた。
                    </p>
                    <p>
                        叔父であるマスター・絹山の協力も得て、甘い幻想（パイプドリーム）を断ち切るべくスナックでの演劇上演を決意するが、無常にも3回目の緊急事態宣言が出されてしまう……。
                    </p>
                </div>

                <div className="pt-10 border-t border-white/10 space-y-6 flex flex-col items-center">
                    <p className="text-sm md:text-base text-zinc-400 font-serif tracking-widest">
                        この物語を完成させ、劇場へ届けるために。<br className="hidden md:block" />
                        現在、クラウドファンディングにて制作支援を募っています。
                    </p>
                    <HeroButton
                        href="/crowdfunding"
                        icon={Gift}
                        label="プロジェクト詳細を見る（MotionGallery）"
                        variant="gold"
                    />
                </div>
            </motion.div>
        </section>
    );
}
