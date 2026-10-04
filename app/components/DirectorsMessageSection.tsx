"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DirectorsMessageSection() {
  return (
    <section id="director-message" className="bg-background py-20 sm:py-24 md:py-36 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-3xl w-full mx-auto space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-xs md:text-sm tracking-wider md:tracking-[0.2em] text-accent/80 font-serif uppercase break-normal">
            Director's Message
          </p>
          <h2 className="text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-wide md:tracking-[0.15em] font-serif text-foreground text-balanced">
            映画を完成させるために
          </h2>
        </div>

        {/* Profile Card & Essay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/30 border border-white/5 rounded-lg p-5 sm:p-6 md:p-10 space-y-6 sm:space-y-8 font-serif"
        >
          {/* Portrait & Title */}
          <div className="flex items-center gap-4 sm:gap-5 border-b border-white/10 pb-5 sm:pb-6">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
              <Image
                src="/prof/kudaka.jpg"
                alt="監督・脚本・編集 久高 将也"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[10px] sm:text-[11px] text-accent tracking-wider sm:tracking-widest uppercase">
                監督・脚本・編集
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-wide sm:tracking-widest">
                久高 将也
              </h3>
            </div>
          </div>

          {/* Statement Essay */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-foreground/85 leading-relaxed md:leading-loose text-xs sm:text-sm md:text-base tracking-normal sm:tracking-wide text-justify sm:text-left text-auto-phrase">
            <p>
              15年以上、映像制作の現場に携わってきました。数々の経験を重ね、多くの仲間に恵まれてきましたが、自分自身が監督として一本の長編映画を成立させることは、また別の覚悟を要する挑戦でした。
            </p>
            <p className="text-foreground font-bold text-xs sm:text-sm md:text-base border-l-2 border-accent pl-3 sm:pl-4 py-1.5 my-2 sm:my-3 bg-accent/5">
              まずはこの一本を、何としても最後まで完成させる。
            </p>
            <p>
              映画制作には多くの工程と費用が伴います。公的支援だけでは十分な制作費の確保が難しく、クラウドファンディングでいただいた温かいご支援を力に、自己資金を中心に制作を進めています。
            </p>
            <p>
              完成した映画を携えて、国内外の映画祭出品やその先の劇場公開へ歩みを進めていきます。
            </p>
            <p className="pt-1 sm:pt-2 text-accent font-bold text-xs sm:text-sm md:text-base tracking-wide leading-relaxed">
              この映画がどこまで辿り着けるのか。完成までの過程を、見守っていただけましたら幸いです。
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
