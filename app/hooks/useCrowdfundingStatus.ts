"use client";

import { useState, useEffect } from "react";

const LAUNCH_DATE_MS = new Date("2026-04-01T12:00:00+09:00").getTime();

export function useCrowdfundingStatus() {
    // We initialize to false to prevent hydration mismatch.
    // As soon as the component mounts, we check the actual time.
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const check = () => {
            setIsStarted(Date.now() >= LAUNCH_DATE_MS);
        };
        
        check(); // Perform initial check
        
        // Polling every second to immediately flip exactly at 12:00
        const interval = setInterval(check, 1000);
        return () => clearInterval(interval);
    }, []);

    return isStarted;
}
