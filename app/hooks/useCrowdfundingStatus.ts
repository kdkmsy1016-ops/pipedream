"use client";

import { useState, useEffect } from "react";

export function useCrowdfundingStatus() {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        // Unconditionally enable the buttons (time has already passed).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsStarted(true);
    }, []);

    return isStarted;
}
