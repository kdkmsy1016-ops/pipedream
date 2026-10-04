"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Users } from "lucide-react";

const FILM_STAFF_CAST = [
  {
    role: "監督・脚本・編集",
    name: "久高 将也",
    image: "/prof/kudaka.jpg",
    bio: "15年以上にわたり映画・映像制作の現場に携わる。映画『盈虚とパイプドリーム』にて長編映画初監督。"
  }
];

interface Character {
  name: string;
  romaji: string;
  age: string;
  tagline: string;
  description: string[];
}

// 主要登場人物（5名）
const MAIN_CHARACTERS: Character[] = [
  {
    name: "如月 桃華",
    romaji: "KISARAGI MOMOKA",
    age: "23歳",
    tagline: "俳優志望",
    description: [
      "スナック「さくらみち」で働きながら、俳優として活動している。",
      "芝居が好きだが、他者の期待や感情を背負い込みやすい。",
      "演出家・久原沙也加の劇団オーディションに挑む一方、コロナ禍の中で思うように活動できない日々を送っている。"
    ]
  },
  {
    name: "神林 修平",
    romaji: "KANBAYASHI SHUHEI",
    age: "25歳",
    tagline: "映画監督志望",
    description: [
      "桃華の恋人。",
      "桃華とちはるを出演させた自主映画を一本完成させているが、その後は次作へ進めずにいる。",
      "フードデリバリーで生活をつなぎながら、映画を撮る機会を模索している。"
    ]
  },
  {
    name: "絹山 彰",
    romaji: "KINUYAMA AKIRA",
    age: "55歳",
    tagline: "スナック「さくらみち」のマスター",
    description: [
      "桃華の叔父。",
      "口数は少なく、結論を急がず、人の話を最後まで聞く人物。",
      "「さくらみち」を営みながら、桃華の芝居を静かに見守っている。"
    ]
  },
  {
    name: "佐々木 綾子",
    romaji: "SASAKI AYAKO",
    age: "53歳",
    tagline: "小料理屋「こまち」の女将",
    description: [
      "「さくらみち」の向かいにある小料理屋「こまち」を営む。",
      "絹山とは、言葉にしないまま親しい時間を重ねている。"
    ]
  },
  {
    name: "久原 沙也加",
    romaji: "KUHARA SAYAKA",
    age: "36歳",
    tagline: "演出家・俳優",
    description: [
      "劇団パイプドリーム主宰。ラジオ番組のパーソナリティでもある。",
      "桃華のオーディションを行い、俳優としての可能性を見ている。"
    ]
  }
];

// その他の登場人物（3名）
const SUB_CHARACTERS: Character[] = [
  {
    name: "三浦",
    romaji: "MIURA",
    age: "26歳",
    tagline: "修平の元同僚",
    description: [
      "修平の元同僚。",
      "映画を撮れずにいる修平に、自称プロデューサー・本郷とクリエイター向け給付制度の話を紹介する。"
    ]
  },
  {
    name: "寺田",
    romaji: "TERADA",
    age: "52歳",
    tagline: "「さくらみち」の古参常連",
    description: [
      "大きな夢や「いつか」の話を酒席で語る一方、なかなか動かない。",
      "店の空気を明るくする常連客の一人。"
    ]
  },
  {
    name: "谷川",
    romaji: "TANIGAWA",
    age: "39歳",
    tagline: "芝居好きの常連客",
    description: [
      "外回りの営業職。",
      "仕事の合間に小劇場へ足を運ぶほど芝居が好きで、「さくらみち」にも通っている。"
    ]
  }
];

export default function CastStaffRenewedSection() {
  const [showSubCharacters, setShowSubCharacters] = useState(false);

  return (
    <section id="cast-staff" className="bg-zinc-950 py-24 sm:py-32 md:py-44 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden font-serif">
      <div className="max-w-4xl w-full mx-auto space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 uppercase break-normal">
            CAST &amp; STAFF
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground text-balanced">
            スタッフ・キャスト
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-balanced text-auto-phrase">
            映画『盈虚とパイプドリーム』を創り上げる制作陣と登場人物。
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
              className="bg-zinc-900/40 border border-white/5 p-5 sm:p-6 md:p-8 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
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

        {/* Characters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Section Subtitle */}
          <div className="text-center space-y-1.5 border-b border-white/10 pb-4">
            <p className="text-[11px] sm:text-xs font-mono tracking-widest text-accent uppercase">
              CHARACTERS
            </p>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-wider md:tracking-widest">
              主要登場人物
            </h3>
          </div>

          {/* Main Characters Grid (5名) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {MAIN_CHARACTERS.map((char) => (
              <div
                key={char.name}
                className="bg-zinc-900/50 border border-white/10 hover:border-accent/40 rounded-lg p-5 sm:p-6 transition-all duration-300 space-y-3.5 flex flex-col justify-between shadow-lg"
              >
                {/* Header: Name, Romaji, Age, Tagline */}
                <div className="space-y-2 border-b border-white/5 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <h4 className="text-lg sm:text-xl font-bold text-foreground tracking-wide">
                        {char.name}
                      </h4>
                      <span className="text-[10px] font-mono tracking-widest text-foreground/50 uppercase">
                        {char.romaji}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-accent/90 font-bold bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                      {char.age}
                    </span>
                  </div>

                  {/* 肩書き */}
                  <p className="text-xs sm:text-[13px] font-bold text-accent tracking-wide">
                    {char.tagline}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2 text-xs sm:text-[13px] text-foreground/80 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
                  {char.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sub Characters Section (その他の登場人物: 3名) */}
          <div className="pt-2">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSubCharacters((prev) => !prev)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 rounded text-xs sm:text-sm tracking-wider transition-all cursor-pointer active:scale-98"
                aria-expanded={showSubCharacters}
              >
                <Users className="w-4 h-4 text-accent/80" />
                <span>
                  {showSubCharacters ? "その他の登場人物を閉じる" : "その他の登場人物を見る（三浦・寺田・谷川）"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showSubCharacters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {showSubCharacters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    {SUB_CHARACTERS.map((char) => (
                      <div
                        key={char.name}
                        className="bg-zinc-900/40 border border-white/10 hover:border-accent/30 rounded-lg p-5 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5 border-b border-white/5 pb-2.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <h4 className="text-base sm:text-lg font-bold text-foreground tracking-wide">
                                {char.name}
                              </h4>
                              <span className="text-[10px] font-mono tracking-widest text-foreground/50 uppercase">
                                {char.romaji}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-accent/80 font-bold bg-accent/10 px-1.5 py-0.5 rounded">
                              {char.age}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-accent/90 tracking-wide">
                            {char.tagline}
                          </p>
                        </div>

                        <div className="space-y-2 text-xs text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
                          {char.description.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cast notice */}
          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-foreground/50 tracking-normal sm:tracking-wider">
              ※ 出演キャストおよび追加制作スタッフは、キャスティング進捗に合わせて随時発表いたします。
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
