"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactSection() {
    return (
        <section className="py-16 sm:py-20 md:py-32 w-full bg-black text-white font-serif border-t border-white/5 mx-auto">
            <motion.div
                className="container mx-auto px-4 sm:px-6 text-center space-y-10 sm:space-y-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
            >
                <div className="space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm md:text-base tracking-normal sm:tracking-widest text-gray-400 text-auto-phrase">
                        ご不明な点や、メッセージはこちらから
                    </p>
                    <div className="w-8 h-[1px] bg-[#ffbf00] mx-auto opacity-50" />
                </div>

                <div>
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center justify-center min-h-[48px] px-8 sm:px-12 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base tracking-wider md:tracking-[0.2em] font-bold text-[#ffbf00] border border-[#ffbf00]/50 hover:border-[#ffbf00] transition-colors duration-300 rounded-sm"
                        >
                            <span className="relative z-10">[ CONTACT ]</span>
                            <div className="absolute inset-0 bg-[#ffbf00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
