"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OFFICIAL_SOCIAL_LINKS } from "../config/socialConfig";

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

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 max-w-md sm:max-w-none mx-auto">
                    <Link href="/contact" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center justify-center min-h-[48px] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base tracking-wider md:tracking-[0.2em] font-bold text-[#ffbf00] border border-[#ffbf00]/50 hover:border-[#ffbf00] transition-colors duration-300 rounded-sm w-full sm:w-auto"
                        >
                            <span className="relative z-10">[ CONTACT ]</span>
                            <div className="absolute inset-0 bg-[#ffbf00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                        </motion.button>
                    </Link>

                    <a
                        href={OFFICIAL_SOCIAL_LINKS.x.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base tracking-wider md:tracking-[0.15em] font-bold text-foreground/90 hover:text-white border border-white/20 hover:border-accent/60 bg-zinc-900/40 hover:bg-zinc-800 transition-all duration-300 rounded-sm w-full sm:w-auto active:scale-95"
                    >
                        <svg className="w-4 h-4 fill-current text-accent" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>[ 公式X @eikyo_pipedream ]</span>
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
