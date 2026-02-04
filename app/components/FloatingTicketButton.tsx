"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "lucide-react";

const TARGET_DATE_STR = "2026-02-21T21:00:00+09:00";
const TARGET_DATE = new Date(TARGET_DATE_STR).getTime();

export default function FloatingTicketButton() {
    const [isReleased, setIsReleased] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkTime = () => {
            const now = Date.now();
            if (now >= TARGET_DATE) {
                setIsReleased(true);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-6 right-6 z-40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                {isReleased ? (
                    <a
                        href="https://t.livepocket.jp/t/basusue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-black/60 backdrop-blur-md border border-[#ffbf00] text-[#ffbf00] font-serif px-6 py-3 rounded-full hover:bg-[#ffbf00] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,191,0,0.2)]"
                    >
                        <Ticket className="w-5 h-5" />
                        <span className="tracking-widest font-bold">TICKET BUY</span>
                    </a>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-[#ffbf00]/50 text-[#ffbf00]/70 font-serif px-6 py-3 rounded-full cursor-not-allowed"
                    >
                        <Ticket className="w-5 h-5 opacity-50" />
                        <span className="tracking-widest text-sm">2/21 21:00 発売開始</span>
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
