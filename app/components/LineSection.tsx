"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import HeroButton from "./HeroButton";

export default function LineSection() {
    return (
        <section className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-black/50 border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto w-full flex flex-col items-center"
            >
                <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-accent tracking-widest text-shadow-glow">
                        映画プロジェクト始動
                    </h2>

                    <p className="text-foreground/80 leading-loose text-sm md:text-base lg:text-lg font-serif">
                        この映画を完成させ、皆様に届けるために。<br className="hidden md:block" />
                        現在クラウドファンディングを実施中です。
                    </p>

                    <div className="pt-4 flex justify-center w-full">
                        <HeroButton
                            href="/crowdfunding"
                            icon={Gift}
                            label="プロジェクト詳細を見る（MotionGallery）"
                            variant="gold"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
