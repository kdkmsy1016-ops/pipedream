import "./costume.css";
import CostumeNavbar from "./components/CostumeNavbar";

export const metadata = {
  title: "映画『盈虚とパイプドリーム』衣装香盤",
  description: "現場用 衣装香盤Webシステム (CHARACTER / SCENE / SCHEDULE)",
};

export default function CostumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-black">
      <CostumeNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 md:p-6 print:p-0 print:max-w-none">
        {children}
      </main>
    </div>
  );
}
