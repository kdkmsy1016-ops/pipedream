"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CostumeNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "CHARACTER", href: "/costume/characters", desc: "人物別" },
    { label: "SCENE", href: "/costume/scenes", desc: "シーン別" },
    { label: "SCHEDULE", href: "/costume/schedule", desc: "撮影日別" },
    { label: "IMPORT", href: "/costume/import", desc: "Excel取込" },
    { label: "PRINT / PDF", href: "/costume/print", desc: "A4印刷" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 text-zinc-100 px-4 py-2.5 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/costume/characters"
            className="flex items-center gap-2 group"
          >
            <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded tracking-wider">
              現場用
            </span>
            <span className="font-bold text-sm tracking-wide text-zinc-200 group-hover:text-amber-400 transition-colors">
              『盈虚とパイプドリーム』衣装香盤
            </span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/costume/characters" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-400 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] hidden md:inline ${
                    isActive ? "text-zinc-800" : "text-zinc-500"
                  }`}
                >
                  ({item.desc})
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
