"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { OFFICIAL_SOCIAL_LINKS } from "../config/socialConfig";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const menuItems = [
        { label: "Top", href: "#hero" },
        { label: "Trailer", href: "#trailer" },
        { label: "About Film", href: "#about" },
        { label: "Message", href: "#director-message" },
        { label: "News", href: "#news" },
        { label: "Support", href: "#support" },
        { label: "Support Details", href: "#support-details" },
        { label: "Roadmap", href: "#roadmap" },
        { label: "Characters", href: "#cast-staff" },
        { label: "Cast Profile", href: "#cast-profile" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            {/* Hamburger Button (Fixed Top-Right) */}
            <button
                onClick={toggleMenu}
                className="fixed top-6 right-6 lg:top-8 lg:right-8 z-50 w-12 h-12 flex flex-col items-center justify-center gap-1.5 mix-blend-difference text-white focus:outline-none"
                aria-label="Menu"
            >
                <motion.div
                    animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    className="w-8 h-[1px] bg-current"
                />
                <motion.div
                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-8 h-[1px] bg-current"
                />
                <motion.div
                    animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    className="w-8 h-[1px] bg-current"
                />
            </button>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex items-center justify-center overflow-y-auto py-16 px-4"
                    >
                        <nav className="flex flex-col items-center gap-4 sm:gap-6 font-serif text-white max-h-full my-auto py-4">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.1 + index * 0.04,
                                        duration: 0.4,
                                        ease: "easeOut",
                                    }}
                                >
                                    {item.href.startsWith("/") ? (
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="text-lg sm:text-xl lg:text-3xl tracking-wider sm:tracking-[0.15em] lg:tracking-[0.2em] relative group overflow-hidden block py-1"
                                        >
                                            <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                                                {item.label}
                                            </span>
                                            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-accent">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="text-lg sm:text-xl lg:text-3xl tracking-wider sm:tracking-[0.15em] lg:tracking-[0.2em] relative group overflow-hidden block py-1"
                                        >
                                            <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                                                {item.label}
                                            </span>
                                            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-accent">
                                                {item.label}
                                            </span>
                                        </a>
                                    )}
                                </motion.div>
                            ))}

                            {/* Official Social Link */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 + menuItems.length * 0.04,
                                    duration: 0.4,
                                    ease: "easeOut",
                                }}
                                className="pt-4 border-t border-white/10 w-full text-center"
                            >
                                <a
                                    href={OFFICIAL_SOCIAL_LINKS.x.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-accent/40 bg-zinc-900/40 hover:bg-zinc-800 text-xs sm:text-sm text-foreground/80 hover:text-white transition-all active:scale-95 font-sans"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current text-accent" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    <span>公式X @eikyo_pipedream</span>
                                </a>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
