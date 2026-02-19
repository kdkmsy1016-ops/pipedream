"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// === Formspree Configuration ===
const FORMSPREE_FORM_ID = "myznwbdy";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export default function ContactPage() {
    const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

    // Success State
    if (state.succeeded) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center font-serif px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-center space-y-8 max-w-lg"
                >
                    <p className="text-xl md:text-2xl text-[#ffbf00] tracking-widest">
                        Thank You
                    </p>
                    <div className="space-y-4 text-gray-300 leading-loose">
                        <p className="text-lg">メッセージを承りました。</p>
                        <p>幕が上がるまで、<br />今しばらくお待ちください。</p>
                    </div>
                    <div className="pt-8">
                        <Link
                            href="/"
                            className="inline-block text-sm text-gray-500 hover:text-white transition-colors tracking-widest border-b border-transparent hover:border-white/30 pb-1"
                        >
                            CLOSE / TOPへ戻る
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white font-serif py-32 px-6 md:px-12 flex flex-col items-center">

            {/* Back Link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-24 left-6 md:left-12"
            >
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-[#ffbf00] transition-colors text-sm tracking-widest group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK
                </Link>
            </motion.div>

            <div className="w-full max-w-2xl mx-auto space-y-16">
                {/* Header */}
                <motion.header
                    className="text-center space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 className="text-3xl md:text-4xl tracking-[0.2em] text-[#ffbf00]">CONTACT</h1>
                    <p className="text-gray-400 text-sm md:text-base leading-loose tracking-wide">
                        公演に関するお問い合わせ、<br className="md:hidden" />取材依頼などはこちらからお願いいたします。
                    </p>
                </motion.header>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-8 md:space-y-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    {/* Name */}
                    <div className="space-y-2 group">
                        <label htmlFor="name" className="block text-xs text-gray-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors">
                            NAME
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            required
                            className="w-full bg-black/50 border border-[#ffbf00]/30 py-3 px-4 text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:ring-1 focus:ring-[#ffbf00] focus:shadow-[0_0_15px_rgba(255,191,0,0.2)] transition-all duration-300 placeholder-white/10"
                            placeholder="お名前"
                        />
                        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 group">
                        <label htmlFor="email" className="block text-xs text-gray-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors">
                            EMAIL
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            className="w-full bg-black/50 border border-[#ffbf00]/30 py-3 px-4 text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:ring-1 focus:ring-[#ffbf00] focus:shadow-[0_0_15px_rgba(255,191,0,0.2)] transition-all duration-300 placeholder-white/10"
                            placeholder="メールアドレス"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2 group">
                        <label htmlFor="subject" className="block text-xs text-gray-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors">
                            SUBJECT
                        </label>
                        <input
                            id="subject"
                            type="text"
                            name="subject"
                            className="w-full bg-black/50 border border-[#ffbf00]/30 py-3 px-4 text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:ring-1 focus:ring-[#ffbf00] focus:shadow-[0_0_15px_rgba(255,191,0,0.2)] transition-all duration-300 placeholder-white/10"
                            placeholder="件名"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-2 group">
                        <label htmlFor="message" className="block text-xs text-gray-500 tracking-widest group-focus-within:text-[#ffbf00] transition-colors">
                            MESSAGE
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            className="w-full bg-black/50 border border-[#ffbf00]/30 py-3 px-4 text-base md:text-lg focus:outline-none focus:border-[#ffbf00] focus:ring-1 focus:ring-[#ffbf00] focus:shadow-[0_0_15px_rgba(255,191,0,0.2)] transition-all duration-300 placeholder-white/10 resize-none leading-relaxed"
                            placeholder="お問い合わせ内容"
                        />
                        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8 text-center bg-black">
                        <motion.button
                            type="submit"
                            disabled={state.submitting}
                            animate={{
                                y: [0, -4, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            whileHover={{
                                scale: 1.05,
                                y: 0, // Stop bouncing on hover? Or keep it? User said "loop". Let's keep loop but maybe enhance? 
                                // Actually better to keep simple loop as requested.
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#ffbf00] text-black px-12 py-4 text-sm tracking-[0.2em] font-bold hover:bg-[#ffbf00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,191,0,0.3)]"
                        >
                            {state.submitting ? "送信中..." : "SEND MESSAGE"}
                        </motion.button>
                        {state.errors && Object.keys(state.errors).length > 0 && (
                            <p className="mt-4 text-red-500 text-sm">エラーが発生しました。入力内容をご確認ください。</p>
                        )}
                    </div>
                </motion.form>
            </div>
        </main>
    );
}
