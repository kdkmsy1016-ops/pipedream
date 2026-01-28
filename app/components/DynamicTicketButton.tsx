"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import HeroButton from "./HeroButton";

const TARGET_DATE_STR = "2026-02-21T21:00:00+09:00";
const TARGET_DATE = new Date(TARGET_DATE_STR).getTime();

interface DynamicTicketButtonProps {
    className?: string;
}

export default function DynamicTicketButton({ className = "" }: DynamicTicketButtonProps) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isReleased, setIsReleased] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = Date.now();
            const diff = TARGET_DATE - now;

            if (diff <= 0) {
                setIsReleased(true);
                setTimeLeft(0);
            } else {
                setIsReleased(false);
                setTimeLeft(diff);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    // Initial render (SSR/Hydration stability)
    if (timeLeft === null) {
        return (
            <HeroButton
                href="#"
                icon={Ticket}
                label="TICKET (2/21 21:00 START)"
                variant="ticket"
                disabled={true}
                className={className}
            />
        );
    }

    if (isReleased) {
        return (
            <HeroButton
                href="https://www.quartet-online.net/ticket/basueno"
                icon={Ticket}
                label="チケット予約"
                variant="gold"
                external
                className={className}
            />
        );
    }

    // Pre-release
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Show countdown if less than 24 hours
    const showCountdown = timeLeft < 24 * 60 * 60 * 1000;

    const formattedTime = `あと ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className={`flex flex-col items-center gap-3 w-full lg:w-auto ${className}`}>
            <HeroButton
                href="#"
                icon={Ticket}
                label="TICKET (2/21 21:00 START)"
                variant="ticket"
                disabled={true}
                className="w-full"
            />
            {showCountdown && (
                <span className="text-accent font-bold tracking-widest text-sm lg:text-base animate-pulse font-serif">
                    {formattedTime}
                </span>
            )}
        </div>
    );
}
