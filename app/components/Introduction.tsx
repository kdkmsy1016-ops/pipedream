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
                        <span className="inline-block">スクリーンの中の</span>
                        <span className="font-bold text-accent/90"> “嘘” </span>
                        <span className="inline-block">が、</span><br className="block md:hidden" />
                        <span className="inline-block">板の上で</span>
                        <span className="font-bold text-accent/90"> “真実” </span>
                        <span className="inline-block">になる。</span>
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
                        <span className="inline-block">今秋撮影予定の映画</span>
                        <span className="inline-block">『盈虚とパイプドリーム』</span><br className="hidden md:inline" />
                        <span className="inline-block">そして、その世界から派生する舞台</span>
                        <span className="inline-block">『場末のパイプドリーム』</span><br />
                        <span className="inline-block">映画の中で描かれる「劇中劇」を、</span>
                        <span className="inline-block ml-[0.1em] md:ml-0">現実の劇場で上演する——</span><br className="hidden md:inline" />
                        <span className="inline-block">スクリーンと舞台、</span><span className="inline-block ml-[0.1em] md:ml-0">二つの世界が交錯する</span><span className="inline-block">実験的プロジェクト</span>
                    </p>
                    <p>
                        <span className="inline-block">原案は、ユージン・オニールの名作</span>
                        <span className="inline-block">『氷人來たる』</span>
                    </p>
                    <p>
                        <span className="inline-block">行き場のない魂たちが紡ぐ、</span><span className="inline-block ml-[0.1em] md:ml-0">淡く儚い夢の在り処</span><br className="hidden md:inline" />
                        <span className="inline-block">煙のくゆる酒場で、</span><span className="inline-block ml-[0.1em] md:ml-0">人々は何を待ち続けているのか</span>
                    </p>
                    <p>
                        <span className="inline-block">その「パイプドリーム（幻想）」の</span><span className="inline-block">果てにあるものは、</span><br className="hidden md:inline" />
                        <span className="inline-block">絶望か、それとも——</span>
                    </p>
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="pt-16 flex flex-col md:flex-row items-center justify-center gap-4 w-full"
                >
                    <Link
                        href="/film"
                        className="group relative w-full md:w-auto px-8 py-4 border border-foreground/30 text-foreground/80 font-serif tracking-widest text-sm transition-all hover:bg-foreground hover:text-background hover:border-transparent text-center uppercase"
                    >
                        映画『盈虚とパイプドリーム』詳細
                    </Link>

                    <Link
                        href="/stage"
                        className="group relative w-full md:w-auto px-8 py-4 border border-foreground/30 text-foreground/80 font-serif tracking-widest text-sm transition-all hover:bg-foreground hover:text-background hover:border-transparent text-center uppercase"
                    >
                        舞台『場末のパイプドリーム』詳細
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
