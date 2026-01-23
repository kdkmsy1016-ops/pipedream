import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stage: 場末のパイプドリーム",
    description: "舞台『場末のパイプドリーム』の詳細情報。",
};

export default function StagePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white font-serif relative z-10">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-widest mb-4">
                舞台『場末のパイプドリーム』
            </h1>
            <p className="text-xl tracking-widest opacity-70">
                Coming Soon
            </p>
        </div>
    );
}
