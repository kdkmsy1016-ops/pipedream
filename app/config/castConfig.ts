/**
 * 映画『盈虚とパイプドリーム』出演者（CAST）プロフィール設定
 * 
 * 将来的に所属事務所やご本人からの正式プロフィール更新、写真ファイルの追加・変更、
 * SNSリンクの変更があった際は、本ファイル内の配列データを編集することで
 * サイト全体に即座に反映されます。
 */

export interface CastMember {
  id: string;
  role: string;          // 役名 (例: "如月桃華")
  name: string;          // 氏名 (例: "コトハ")
  romaji: string;        // 英字表記 (例: "KOTOHA")
  image?: string | null; // キャスト写真パス (例: "/prof/kotoha.jpg")。nullの場合は洗練されたプレースホルダーを表示
  bio: string[];         // プロフィール文章 (段落ごとに配列)
  sns?: {
    x?: string;          // X URL
    instagram?: string;  // Instagram URL
  };
}

export const CAST_PROFILES: CastMember[] = [
  {
    id: "kotoha",
    role: "如月桃華",
    name: "コトハ",
    romaji: "KOTOHA",
    image: null, // 写真追加時は "/prof/kotoha.jpg" 等を指定
    bio: [
      "広島県出身。",
      "舞台・映画・ドラマ・MVなど映像作品を中心に活動。",
      "演技のほか、歌やダンスなど幅広い表現活動に取り組む。"
    ],
    sns: {
      x: "https://x.com/kotoha_sforzo",
      instagram: "https://www.instagram.com/kotoha_sforzo/"
    }
  },
  {
    id: "fukui-shoma",
    role: "神林修平",
    name: "福井 将真",
    romaji: "SHOMA FUKUI",
    image: null, // 写真追加時は "/prof/fukui.jpg" 等を指定
    bio: [
      "俳優・脚本・演出。福岡県出身。",
      "「縁ぎや企画」主宰。",
      "舞台出演のほか、自身でも脚本・演出作品を発表している。"
    ],
    sns: {
      x: "https://x.com/resolution217",
      instagram: "https://www.instagram.com/shoma_fukui/"
    }
  },
  {
    id: "kazusa-yoko",
    role: "佐々木綾子",
    name: "かずさ 容子",
    romaji: "YOKO KAZUSA",
    image: null, // 写真追加時は "/prof/kazusa.jpg" 等を指定
    bio: [
      "東京都出身。",
      "1987年に宝塚歌劇団へ入団。舞台・テレビを中心に活動。",
      "『大岡越前』『水戸黄門』『流れる雲よ』などに出演。"
    ],
    sns: {
      x: "https://x.com/kazusa_yoko"
    }
  },
  {
    id: "kishi-hiroyuki",
    role: "絹山彰",
    name: "岸 博之",
    romaji: "HIROYUKI KISHI",
    image: null, // 写真追加時は "/prof/kishi.jpg" 等を指定
    bio: [
      "俳優。熊本県出身。",
      "アンテーヌ所属。劇団カクスコ創立メンバー。",
      "映画『おくりびと』『クライマーズ・ハイ』、ドラマ『相棒』『特捜9』など多数出演。"
    ]
    // SNSなし
  }
];
