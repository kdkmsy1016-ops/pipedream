import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingStageLink() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
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
                    <Link href="/stage">
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
                                    Stage Performance
                                </span>
                                <span className="text-white font-serif tracking-wide group-hover:text-accent transition-colors duration-300">
                                    舞台『場末のパイプドリーム』詳細へ
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
