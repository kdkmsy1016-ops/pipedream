"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Introduction() {
    return (
        <section id="introduction" className="bg-background py-24 px-6 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-16">

                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase mb-8"
                >
                    Introduction
                </motion.h2>

                {/* Catchphrase */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-12 font-serif"
                >
                    <h3 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-widest px-8 md:px-0 text-center md:whitespace-nowrap" style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                        <span className="inline-block">私たちは</span>
                        <span className="font-bold text-accent/90">「不要不急」</span>
                        <span className="inline-block">の中で、夢を見た。</span>
                    </h3>
                </motion.div>

                {/* Main Text Content (Body) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="space-y-8 text-foreground/80 leading-loose font-serif text-base md:text-lg lg:text-xl px-8 md:px-0 text-center max-w-3xl mx-auto"
                    style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}
                >
                    <p>
                        <span className="inline-block">コロナ禍のスナックから始まる、</span><br className="block md:hidden" />
                        <span className="inline-block">“人生の再生”の物語。</span>
                    </p>
                    <p>
                        <span className="inline-block">この映画は、まだ制作の過程にあります。</span>
                    </p>
                    <p>
                        <span className="inline-block">満ちては欠ける人生の痛みと<br />再生を描くこの映画を、</span><br className="block md:hidden" />
                        <span className="inline-block">一緒に完成させてくれませんか？</span>
                    </p>
                </motion.div>



            </div>
        </section>
    );
}
