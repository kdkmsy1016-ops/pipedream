"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const menuItems = [
        { label: "Top", href: "/" },
        { label: "Introduction", href: "/#introduction" },
        { label: "Film", href: "/film" },
        { label: "Stage", href: "/stage" },
        { label: "Contact", href: "mailto:contact@example.com" },
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
                        className="fixed inset-0 z-40 bg-black flex items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-8 font-serif text-white">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.2 + index * 0.1,
                                        duration: 0.8,
                                        ease: "easeOut",
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="text-2xl lg:text-4xl tracking-[0.2em] relative group overflow-hidden block"
                                    >
                                        <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                                            {item.label}
                                        </span>
                                        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-gray-400">
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
