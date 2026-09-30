"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const FILM_STAFF_CAST = [
  {
    role: "監督・脚本・編集",
    name: "久高 将也",
    image: "/prof/kudaka.jpg",
    bio: "15年以上にわたり映画・映像制作の現場に携わる。映画『盈虚とパイプドリーム』にて長編映画初監督。"
  }
];

const CAST_MEMBERS = [
  { role: "桃華（俳優志望）", desc: "夢と現実に揺れる主人公" },
  { role: "修平（映画監督志望）", desc: "桃華と同依存の日々を送る恋人" },
  { role: "マスター 絹山", desc: "実在スナック「さくらみち」のマスター" }
];

export default function CastStaffRenewedSection() {
  return (
    <section id="cast-staff" className="bg-zinc-950 py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            CAST &amp; STAFF
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            スタッフ・キャスト
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 font-serif tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-balanced text-auto-phrase">
            映画『盈虚とパイプドリーム』を創り上げる制作陣。
          </p>
        </div>

        {/* Key Staff */}
        <div className="max-w-xl mx-auto w-full">
          {FILM_STAFF_CAST.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-zinc-900/40 border border-white/5 p-5 sm:p-6 md:p-8 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 font-serif"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0 shadow-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left space-y-1.5 sm:space-y-2">
                <span className="text-[11px] sm:text-xs text-accent font-bold tracking-wider sm:tracking-widest uppercase block">
                  {member.role}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-wide sm:tracking-widest">
                  {member.name}
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed tracking-normal sm:tracking-wider text-auto-phrase">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Characters / Cast info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-black/50 border border-white/5 p-4 sm:p-6 md:p-8 rounded-lg space-y-4 sm:space-y-6 font-serif"
        >
          <h3 className="text-sm md:text-base font-bold text-foreground tracking-wide sm:tracking-widest text-center border-b border-white/10 pb-3 sm:pb-4">
            主要登場人物
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center md:text-left">
            {CAST_MEMBERS.map((c) => (
              <div key={c.role} className="p-3 sm:p-4 bg-zinc-900/30 border border-white/5 rounded space-y-1">
                <p className="text-sm font-bold text-accent text-auto-phrase">{c.role}</p>
                <p className="text-xs text-foreground/60 tracking-normal sm:tracking-wider text-auto-phrase">{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
