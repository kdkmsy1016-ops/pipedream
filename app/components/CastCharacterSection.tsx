"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, ExternalLink } from "lucide-react";
import {
  MAIN_CAST_CHARACTERS,
  OTHER_CHARACTERS,
  FILM_DIRECTOR,
} from "../config/castConfig";

export default function CastCharacterSection() {
  return (
    <section
      id="cast-character"
      className="bg-zinc-950 py-24 sm:py-32 md:py-44 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden font-serif"
    >
      {/* Anchors for legacy navigation compatibility */}
      <span id="cast-staff" className="sr-only" aria-hidden="true" />
      <span id="cast-profile" className="sr-only" aria-hidden="true" />

      <div className="max-w-4xl w-full mx-auto space-y-14 sm:space-y-20">

        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 uppercase break-normal">
            CAST / CHARACTER
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] text-foreground text-balanced">
            主要キャスト・登場人物
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 tracking-normal sm:tracking-widest max-w-xl mx-auto pt-1 text-balanced text-auto-phrase">
            映画『盈虚とパイプドリーム』の世界を織りなす登場人物とキャスト陣。
          </p>
        </div>

        {/* Key Staff (監督・脚本・編集) */}
        <div className="max-w-xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900/40 border border-white/5 p-4 sm:p-6 md:p-8 rounded-lg flex flex-row items-center sm:items-start gap-3.5 sm:gap-6 shadow-md"
          >
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0 shadow-md">
              <Image
                src={FILM_DIRECTOR.image}
                alt={FILM_DIRECTOR.name}
                fill
                sizes="(max-width: 640px) 64px, 112px"
                className="object-cover"
              />
            </div>
            <div className="text-left space-y-1 sm:space-y-2 min-w-0 flex-1">
              <span className="text-[10px] sm:text-xs text-accent font-bold tracking-wider sm:tracking-widest uppercase block">
                {FILM_DIRECTOR.role}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-foreground tracking-wide sm:tracking-widest">
                {FILM_DIRECTOR.name}
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed tracking-normal sm:tracking-wider text-auto-phrase">
                {FILM_DIRECTOR.bio}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main 4 Cast & Characters Grid (PC: 2列 × 2段, スマホ: 1列) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {MAIN_CAST_CHARACTERS.map((item, idx) => {
            const hasLinks = Boolean(
              item.links?.x ||
              item.links?.instagram ||
              item.links?.website ||
              item.links?.agency
            );

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-zinc-900/45 border border-white/10 hover:border-accent/40 rounded-lg p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-lg space-y-4 group"
              >
                {/* 1. キャスト写真 */}
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[360px] rounded overflow-hidden bg-black/60 border border-white/10 shadow-inner flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.actorName} (${item.role})`}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-foreground/35 select-none">
                      <User className="w-12 h-12 stroke-[1.2] text-accent/40" />
                      <span className="text-[11px] font-mono tracking-widest uppercase">
                        CAST PHOTO
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  {/* 2. 役名 / 3. 俳優名 / 4. 英字表記 */}
                  <div className="space-y-1.5 border-b border-white/5 pb-3">
                    <span className="text-xs font-mono tracking-wider text-accent font-bold uppercase block">
                      {item.role}
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                        {item.actorName}
                      </h3>
                      <span className="text-[11px] font-mono tracking-widest text-foreground/50 uppercase">
                        {item.actorRomaji}
                      </span>
                    </div>
                  </div>

                  {/* 5. 役柄プロフィール (CHARACTER) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                        CHARACTER
                      </span>
                      <span className="text-xs text-foreground/70 font-bold">
                        {item.roleTagline}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-[13px] text-foreground/80 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
                      {item.roleBio.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* 分割罫線 */}
                  <div className="border-t border-white/10 my-1" />

                  {/* 6. 俳優プロフィール (CAST) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 border border-white/15">
                        CAST
                      </span>
                      <span className="text-xs text-foreground/70 font-bold">
                        {item.actorName}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-[13px] text-foreground/75 leading-relaxed tracking-normal sm:tracking-wide text-auto-phrase">
                      {item.actorBio.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* 7. SNS / WEBSITE / AGENCY リンク */}
                  {hasLinks && (
                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                      {item.links?.x && (
                        <a
                          href={item.links.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.actorName} 公式X`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-900/80 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 text-[11px] font-sans tracking-wide transition-all active:scale-95"
                        >
                          <svg
                            className="w-3 h-3 fill-current text-accent"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          <span>X</span>
                        </a>
                      )}

                      {item.links?.instagram && (
                        <a
                          href={item.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.actorName} 公式Instagram`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-900/80 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 text-[11px] font-sans tracking-wide transition-all active:scale-95"
                        >
                          <svg
                            className="w-3 h-3 fill-current text-accent"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          <span>Instagram</span>
                        </a>
                      )}

                      {item.links?.website && (
                        <a
                          href={item.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.actorName} 公式サイト`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-900/80 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 text-[11px] font-sans tracking-wide transition-all active:scale-95"
                        >
                          <ExternalLink className="w-3 h-3 text-accent" />
                          <span>WEBSITE</span>
                        </a>
                      )}

                      {item.links?.agency && (
                        <a
                          href={item.links.agency.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.actorName} 所属事務所（${item.links.agency.name}）`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-900/80 hover:bg-zinc-800 text-foreground/80 hover:text-white border border-white/10 hover:border-accent/40 text-[11px] font-sans tracking-wide transition-all active:scale-95"
                        >
                          <ExternalLink className="w-3 h-3 text-accent" />
                          <span>AGENCY ({item.links.agency.name})</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* 13. その他の登場人物 (OTHER CHARACTERS) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 pt-4 border-t border-white/10"
        >
          {/* Subheader */}
          <div className="text-center space-y-1">
            <p className="text-[10px] sm:text-xs font-mono tracking-widest text-accent uppercase">
              OTHER CHARACTERS
            </p>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-wider md:tracking-widest">
              その他の登場人物
            </h3>
            <p className="text-xs text-foreground/50 tracking-normal sm:tracking-wider">
              ※ 出演キャストが決定次第、順次発表いたします。
            </p>
          </div>

          {/* Other Characters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {OTHER_CHARACTERS.map((char) => (
              <div
                key={char.id}
                className="bg-zinc-900/35 border border-white/10 hover:border-accent/30 rounded-lg p-4 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1 border-b border-white/5 pb-2">
                  <div className="flex items-baseline justify-between gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-foreground tracking-wide">
                      {char.name}
                    </h4>
                    <span className="text-[10px] font-mono text-accent/80 font-bold bg-accent/10 px-1.5 py-0.5 rounded">
                      {char.age}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-accent/90 font-bold tracking-wide">
                      {char.tagline}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-foreground/40 uppercase">
                      {char.romaji}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-foreground/75 leading-relaxed tracking-normal text-auto-phrase">
                  {char.bio}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
