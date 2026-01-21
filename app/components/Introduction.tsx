"use client";

import { motion } from "framer-motion";

export default function Introduction() {
    return (
        <section className="bg-background py-24 px-6 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-16">

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

                {/* Main Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-8 text-foreground/80 leading-loose font-serif text-base md:text-lg lg:text-xl"
                >
                    <p>
                        今秋撮影予定の映画『盈虚とパイプドリーム』<br />
                        そのスピンオフ舞台『場末のパイプドリーム』
                    </p>
                    <p>
                        スクリーンと劇場、二つの空間で交錯する物語。<br />
                        映画『盈虚とパイプドリーム』の劇中劇を実際に公演。<br />
                        ユージン・オニールの名作『氷人來たる』を原案に、<br />
                        行き場のない魂たちが紡ぐ、淡く儚い夢の在り処を描く。
                    </p>
                    <p>
                        煙のくゆる酒場で、<br className="md:hidden" />人々に何を待ち続けているのか。<br />
                        その「パイプドリーム（幻想）」の果てにあるものは——
                    </p>
                </motion.div>

                {/* Signature Credits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                    className="pt-12 flex flex-col items-center justify-center gap-2 text-foreground/60 font-serif text-sm tracking-widest"
                >
                    <div className="space-y-4 text-center">
                        {/* Tier 1: Original Concept */}
                        <div className="text-foreground/60 tracking-widest text-xs lg:text-sm font-serif">
                            <p>原案：ユージン・オニール</p>
                            <p className="text-[10px] lg:text-xs">（『氷人來たる』に着想を得て）</p>
                        </div>

                        {/* Tier 2: Main Staff */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-foreground/90 font-serif text-sm lg:text-base tracking-widest">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-foreground/50">脚本</span>
                                <span>久高 将也</span>
                            </div>
                            <div className="hidden sm:block w-[1px] h-3 bg-foreground/20" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-foreground/50">演出</span>
                                <span>福井 将真</span>
                            </div>
                            <div className="hidden sm:block w-[1px] h-3 bg-foreground/20" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-foreground/50">プロデューサー</span>
                                <span>町田 直樹</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
