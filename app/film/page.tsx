import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Film: 盈虚とパイプドリーム",
    description: "映画『盈虚とパイプドリーム』の詳細情報。",
};

export default function FilmPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white font-serif relative z-10">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-widest mb-4">
                映画『盈虚とパイプドリーム』
            </h1>
            <p className="text-xl tracking-widest opacity-70">
                Coming Soon
            </p>
        </div>
    );
}
