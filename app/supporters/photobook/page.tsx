"use client";

import dynamic from "next/dynamic";

const PhotobookViewer = dynamic(() => import("../PhotobookViewer"), {
    ssr: false
});

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";


export default function PhotobookPage() {
    const [tier, setTier] = useState<number>(0);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const savedTier = sessionStorage.getItem("supporters_tier");
        if (savedTier) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTier(parseInt(savedTier, 10));
        }
        setIsChecking(false);
    }, []);

    if (isChecking) {
        return <div className="min-h-screen bg-[#0b0e14]" />;
    }

    if (tier < 2) {
        return (
            <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-white font-serif p-6">
                <Lock className="w-8 h-8 text-[#ffbf00] opacity-80 mb-4" />
                <p className="text-sm tracking-widest text-zinc-400 mb-6 text-center">
                    認証されていないか、アクセス権限がありません。<br />
                    サポーター用エントランスから入店してください。
                </p>
                <button
                    onClick={() => window.close()}
                    className="px-6 py-2 border border-zinc-700 hover:border-white transition-colors text-xs tracking-widest cursor-pointer"
                >
                    閉じる
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b0e14]">
            <PhotobookViewer isOpen={true} onClose={() => window.close()} />
        </main>
    );
}
