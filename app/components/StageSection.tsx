"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function StageSection() {
    return (
        <section className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-black border-t border-white/5 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto w-full flex flex-col items-center"
            >
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs tracking-[0.2em] text-foreground/50 uppercase block">Stage Play</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-wider">
                            場末の<br className="md:hidden" />パイプドリーム
                        </h2>
                    </div>

                    <div className="py-6 border-y border-white/10 space-y-4">
                        <p className="text-lg md:text-xl font-serif">2026.4.3(Fri) - 4.5(Sun)</p>
                        <p className="text-sm md:text-base text-foreground/70">at 下北沢 小劇場 楽園</p>
                    </div>

                    <a
                        href="#"
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 w-full bg-foreground text-background hover:bg-accent hover:text-black transition-colors duration-300 rounded-sm"
                    >
                        <Ticket size={24} />
                        <span className="font-bold tracking-wider">チケットを予約する</span>
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
