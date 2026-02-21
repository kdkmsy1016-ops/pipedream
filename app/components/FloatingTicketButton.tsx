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
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-max"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                {isReleased ? (
                    <motion.a
                        href="https://www.quartet-online.net/ticket/basueno"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-black/80 backdrop-blur-lg border border-[#ffbf00] text-[#ffbf00] font-serif px-8 py-4 rounded-full hover:bg-[#ffbf00] hover:text-black transition-colors duration-300 shadow-[0_0_20px_rgba(255,191,0,0.4)]"
                        animate={{
                            y: [0, -6, 0],
                            scale: [1, 1, 1.05, 1],
                            boxShadow: ["0 0 20px rgba(255,191,0,0.4)", "0 0 20px rgba(255,191,0,0.4)", "0 0 35px rgba(255,191,0,0.7)", "0 0 20px rgba(255,191,0,0.4)"]
                        }}
                        whileHover={{
                            y: -4,
                            scale: 1.05,
                            boxShadow: "0 0 30px rgba(255,191,0,0.8)"
                        }}
                        transition={{
                            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            scale: { duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" },
                            boxShadow: { duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" },
                            default: { duration: 0.3 }
                        }}
                    >
                        <Ticket className="w-5 h-5" />
                        <span className="tracking-widest font-bold">TICKET BUY</span>
                    </motion.a>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-[#ffbf00]/50 text-[#ffbf00]/70 font-serif px-6 py-3 rounded-full cursor-not-allowed"
                    >
                        <Ticket className="w-5 h-5 opacity-50" />
                        <span className="tracking-widest text-sm">2/21 21:00 発売開始</span>
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
