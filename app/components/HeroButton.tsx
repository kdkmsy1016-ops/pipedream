import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HeroButtonProps {
    href: string;
    icon: LucideIcon;
    label: any; // Relaxed type for safety
    variant: "line" | "ticket" | "gold";
    external?: boolean;
    compact?: boolean;
}

export default function HeroButton({ href, icon: Icon, label, variant, external = false, className = "", disabled = false, compact = false }: HeroButtonProps & { className?: string; disabled?: boolean }) {
    const defaultPadding = compact ? "px-6 py-2 lg:px-8 lg:py-3" : "px-8 py-4 lg:px-10 lg:py-5";
    const baseClass = `group relative inline-flex items-center justify-center gap-3 ${defaultPadding} rounded-sm transition-all mt-4 lg:mt-2 w-full max-w-sm lg:w-auto`;

    const variantStyles = {
        line: "bg-[#06c755] text-white hover:bg-[#05b34c]",
        ticket: "bg-white text-black hover:bg-accent",
        gold: "bg-accent text-black hover:bg-white hover:text-accent shadow-[0_0_15px_rgba(255,191,0,0.5)] animate-pulse"
    };

    const combinedClass = `${baseClass} ${variantStyles[variant]} ${className}`;

    const content = (
        <>
            <Icon size={20} className="lg:w-6 lg:h-6 flex-shrink-0" />
            <span
                className="font-bold tracking-widest text-sm lg:text-base text-center leading-tight"
                style={{ whiteSpace: 'pre-line' }}
            >
                {label}
            </span>
        </>
    );

    if (disabled) {
        return (
            <div className={`${baseClass} ${variantStyles[variant]} opacity-50 cursor-not-allowed ${className}`}>
                {content}
            </div>
        );
    }

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={combinedClass}
            >
                {content}
            </a>
        );
    }

    return (
        <a href={href} className={combinedClass}>
            {content}
        </a>
    );
}
