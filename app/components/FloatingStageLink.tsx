import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingStageLink() {
    const [isVisible, setIsVisible] = useState(false);
    const [percent, setPercent] = useState<number | null>(null);

    useEffect(() => {
        // Fetch stats
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/crowdfunding-stats");
                const data = await res.json();
                if (data.success) {
                    setPercent(data.percent);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();

        // Scroll listener
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-max"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Link href="/crowdfunding">
                        <motion.div
                            className="group flex items-center gap-4 bg-black/80 backdrop-blur-lg px-8 py-4 rounded-full border border-[#ffbf00] cursor-pointer shadow-[0_0_20px_rgba(255,191,0,0.4)]"
                            animate={{
                                y: [0, -8, 0],
                                scale: [1, 1, 1.05, 1]
                            }}
                            whileHover={{
                                y: -5,
                                scale: 1.02,
                                boxShadow: "0 0 30px rgba(255,191,0,0.7)"
                            }}
                            transition={{
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                scale: { duration: 5, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" },
                                default: { duration: 0.3 }
                            }}
                        >
                            <div className="flex flex-col">
                                <span className="text-white/60 text-[10px] tracking-widest font-sans uppercase mb-1">
                                    クラウドファンディング実施中
                                </span>
                                <span className="text-white text-xs md:text-sm font-serif tracking-wide group-hover:text-accent transition-colors duration-300">
                                    現在：{percent !== null ? percent : "--"}% 達成 支援受付中
                                </span>
                            </div>
                            <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ArrowRight className="w-4 h-4 text-accent/80" />
                            </motion.div>
                        </motion.div>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
