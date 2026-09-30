"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DirectorsMessageSection() {
  return (
    <section id="director-message" className="bg-background py-24 md:py-36 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs md:text-sm tracking-[0.2em] text-accent/80 font-serif uppercase">
            Director's Message
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.15em] font-serif text-foreground">
            「映画を完成させるために」
          </h2>
        </div>

        {/* Profile Card & Essay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 md:p-12 space-y-10 font-serif"
        >
          {/* Portrait & Title */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-8">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-zinc-700 flex-shrink-0 shadow-lg">
              <Image
                src="/prof/kudaka.jpg"
                alt="監督・脚本・編集 久高 将也"
                fill
                sizes="(max-width: 768px) 112px, 144px"
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <p className="text-xs md:text-sm text-accent tracking-widest uppercase font-bold">
                監督・脚本・編集
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-widest">
                久高 将也
              </h3>
              <p className="text-xs text-foreground/60 tracking-wider">
                Masaya Kudaka / Director & Filmmaker
              </p>
            </div>
          </div>

          {/* Statement Essay */}
          <div className="space-y-6 text-foreground/85 leading-loose text-base md:text-lg tracking-wide text-justify md:text-left">
            <p>
              これまで、映像の仕事に15年以上携わってきました。数々の現場で経験を重ね、信頼できるスタッフや関係者の方々との素晴らしいつながりにも恵まれてきました。
            </p>
            <p>
              しかし、自分自身が「監督」として一本の長編映画をゼロから立ち上げ、完成まで導くことには、これまでとは全く異なる質の難しさがあります。
            </p>
            <p>
              映画製作には助成金制度や公的支援といった枠組みも存在します。ですが、監督としての十分な実績がない段階では、そうした制作資金や公的支援を得ることは決して容易ではありません。映画制作に必要な工程の複雑さや費用の大きさを知っているからこそ、その壁の高さも切実に実感しています。
            </p>
            <p>
              過去にクラウドファンディングで皆様から頂いた温かいご支援以外は、自己資金を中心に制作を進めています。
            </p>
            <p className="text-foreground font-bold text-lg md:text-xl border-l-2 border-accent pl-4 py-1 my-6 bg-accent/5">
              「長く映像の仕事をしてきた。それでも、自分自身が監督として一本の長編映画を完成させるには、これまでとは違う難しさがある。だからこそ、まず一本、何としても完成させる。」
            </p>
            <p>
              まずこの一本を最後まで作り切り、完成した作品を携えてその先の可能性を探していきたいと考えています。
            </p>
            <p className="pt-2 text-foreground/90">
              この映画がどこまで辿り着けるのか。完成までの歩みを、静かに見守っていただけましたら幸いです。
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
