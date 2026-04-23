"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const STAFF_MEMBERS = [
    {
        id: "director",
        role: "監督・脚本・編集",
        name: "久高 将也",
        image: "/prof/kudaka.jpg",
        comment: "「夢」という言葉には、人を前に進ませる力と、<br>現実から遠ざけてしまう危うさの両方があると<br>思っています。<br>この作品は、夢と現実の間で悩み、<br>環境や現状に揺れながらも<br>前に進もうとする人々が、<br>そこから脱却を目指す物語です。<br>この物語が、誰かの中にある<br>“まだ手放していない夢”に<br>触れることができたら嬉しいです。"
    }
];

export default function StaffCastSection() {
    return (
        <section id="staff" className="bg-zinc-950 py-32 md:py-48 px-4 flex flex-col items-center">
            <div className="max-w-6xl w-full space-y-16">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-accent/80 font-serif uppercase">
                        Staff & Cast
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-widest font-serif text-foreground">
                        スタッフ・キャスト
                    </h3>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {STAFF_MEMBERS.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-black/40 p-6 rounded-2xl border border-white/5"
                        >
                            {/* Portrait */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-90" />
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-zinc-800 shadow-xl">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        loading="lazy"
                                        sizes="(max-width: 768px) 128px, 160px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-left flex-1 space-y-3">
                                <div className="space-y-1">
                                    <p className="text-xs md:text-sm text-accent tracking-widest font-bold">
                                        {member.role}
                                    </p>
                                    <h4 className="text-lg md:text-xl font-bold text-foreground tracking-widest">
                                        {member.name}
                                    </h4>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed tracking-wide font-serif relative">
                                    <span className="text-accent/30 text-2xl absolute -top-2 -left-2 md:-left-4">"</span>
                                    <span dangerouslySetInnerHTML={{ __html: member.comment }} />
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
