"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function PhotobookPage() {
    const [tier, setTier] = useState<number>(0);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedTier = sessionStorage.getItem("supporters_tier");
        if (savedTier) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTier(parseInt(savedTier, 10));
        }
        setIsChecking(false);
    }, []);

    const handleClose = () => {
        const canCloseWindow = window.opener && !window.opener.closed;

        if (canCloseWindow) {
            window.close();
            return;
        }

        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.push("/supporters");
    };

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
                    onClick={handleClose}
                    className="px-6 py-2 border border-zinc-700 hover:border-white transition-colors text-xs tracking-widest cursor-pointer"
                >
                    閉じる
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-white font-serif p-6">
            <p className="text-sm tracking-[0.3em] text-zinc-300 mb-4 text-center uppercase">
                Digital Photobook
            </p>
            <p className="text-xs tracking-widest text-zinc-500 text-center uppercase mb-8">
                — Coming Soon —
            </p>
            <p className="text-xs tracking-wider text-zinc-400 text-center leading-relaxed mb-8">
                サポーター限定コンテンツの公開まで、今しばらくお待ちください。<br />
                配信が開始されましたら、こちらの画面からご覧いただけるようになります。
            </p>
            <button
                onClick={handleClose}
                className="px-6 py-2 border border-zinc-700 hover:border-white transition-colors text-xs tracking-widest cursor-pointer"
            >
                閉じる
            </button>
        </main>
    );
}
