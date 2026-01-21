"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === Timing Configuration ===
// 自由に調整可能なタイミング変数 (秒)
const FADE_IN_SPEED = 2.0;       // 1行目のフェードイン時間
const WAIT_BEFORE_ZOOM = 6.0;    // Phase 1 (1行目) の表示時間
// Phase 2
const ZOOM_SPEED = 1.2;          // ズームアニメーションの速度
const DISPLAY_HOLD = 2.0;        // 全表示後の静止時間
const EXIT_FADE = 1.0;           // 最終的な画面の消え方

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(1); // 1: Vertical Text, 2: Horizontal Zoom

    useEffect(() => {
        document.body.style.overflow = "hidden";

        // Step 1 -> Step 2 Transition (Timelines)
        const stepTimer = setTimeout(() => {
            setStep(2);
        }, WAIT_BEFORE_ZOOM * 1000);

        // Final Finish
        const totalDuration = (WAIT_BEFORE_ZOOM + ZOOM_SPEED + DISPLAY_HOLD) * 1000;
        const finishTimer = setTimeout(() => {
            onFinish();
        }, totalDuration);

        return () => {
            document.body.style.overflow = "";
            clearTimeout(stepTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white px-4 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: EXIT_FADE, ease: "easeInOut" } }}
        >
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Step 1: Vertical Text */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        className="absolute z-10 font-serif text-lg lg:text-3xl tracking-[0.2em] leading-loose vertical-rl h-[80vh] flex items-center justify-center whitespace-nowrap"
                        style={{ writingMode: "vertical-rl" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }} // Instant Cut
                        transition={{
                            duration: FADE_IN_SPEED,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-white/90">私たちは、</span>
                        <motion.span
                            className="inline-block py-4 lg:py-6"
                            initial={{ color: "#ffffff" }}
                            animate={{ color: "#ef4444" }}
                            transition={{ delay: FADE_IN_SPEED, duration: 1.0 }}
                        >
                            「不要不急」
                        </motion.span>
                        <span className="text-white/90">の中で夢を見た</span>
                    </motion.div>
                )}

                {/* Step 2: Horizontal Zoom Text */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        className="absolute z-20 flex flex-col items-center gap-6 font-serif"
                        // Initial mount is the "Cut" appearance
                        initial={{ opacity: 1 }}
                        // Exit animation (Blur Out)
                        exit={{
                            opacity: 0,
                            filter: "blur(20px)",
                            scale: 1.05,
                            transition: { duration: 3.5, ease: "easeInOut" }
                        }}
                    >

                        {/* Line 2 */}
                        <motion.div
                            initial={{ scale: 1.5, z: -100 }}
                            animate={{ scale: 1, z: 0 }}
                            transition={{
                                duration: ZOOM_SPEED,
                                ease: "circOut"
                            }}
                            className="text-xl lg:text-3xl tracking-widest text-white/90 flex items-center gap-4"
                        >
                            <span>映画</span>
                            <span className="text-sm lg:text-lg opacity-50">×</span>
                            <span>演劇</span>
                        </motion.div>

                        {/* Line 3 */}
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: ZOOM_SPEED,
                                ease: "circOut"
                            }}
                            className="text-2xl lg:text-4xl font-bold tracking-widest text-[#f59e0b] drop-shadow-lg"
                        >
                            2026年 プロジェクト始動！
                        </motion.div>
                    </motion.div>
                )}

            </div>
        </motion.div>
    );
}
