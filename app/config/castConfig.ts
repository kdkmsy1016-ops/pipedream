/**
 * 映画『盈虚とパイプドリーム』
 * キャスト・登場人物（CAST / CHARACTER）データ設定
 * 
 * 主要キャスト4名（役柄紹介 × 出演者本人紹介）および
 * その他の登場人物（OTHER CHARACTERS）の情報を一元管理します。
 * 将来のプロフィール文修正、写真差し替え、SNS URL変更は
 * 本ファイルのデータを更新することでサイト全体に反映されます。
 */

export interface MainCastCharacter {
  id: string;
  // 役柄情報 (CHARACTER)
  role: string;             // 役名 (例: "如月桃華")
  age: string;              // 年齢 (例: "23歳")
  roleTagline: string;      // 役柄肩書き (例: "俳優志望")
  roleBio: string[];        // 役柄プロフィール (2021年時点, 3〜5行)
  // 俳優本人情報 (CAST)
  actorName: string;        // 俳優名 (例: "コトハ")
  actorRomaji: string;      // 英字表記 (例: "KOTOHA")
  actorBio: string[];       // 俳優プロフィール (2〜4行)
  image?: string | null;    // 写真パス (例: "/prof/kotoha.jpg")。未登録時はnull
  // リンク
  links?: {
    x?: string;
    instagram?: string;
    website?: string;
    agency?: {
      name: string;
      url?: string;
    };
  };
}

export interface OtherCharacter {
  id: string;
  name: string;             // 役名
  romaji: string;           // 英字表記
  age: string;              // 年齢
  tagline: string;          // 肩書き
  bio: string;              // 簡略役柄紹介
}

export interface DirectorStaff {
  role: string;
  name: string;
  image: string;
  bio: string;
}

// 監督・スタッフ
export const FILM_DIRECTOR: DirectorStaff = {
  role: "監督・脚本・編集",
  name: "久高 将也",
  image: "/prof/kudaka.jpg",
  bio: "15年以上にわたり映画・映像制作の現場に携わる。映画『盈虚とパイプドリーム』にて長編映画初監督。"
};

// 主要キャスト・登場人物 (4名)
export const MAIN_CAST_CHARACTERS: MainCastCharacter[] = [
  {
    id: "kisaragi-momoka",
    role: "如月桃華",
    age: "23歳",
    roleTagline: "俳優志望",
    roleBio: [
      "スナック「さくらみち」で働きながら、俳優として活動している。芝居が好きだが、他者の期待や感情を背負い込みやすい。",
      "演出家・久原沙也加の劇団オーディションに挑む一方、コロナ禍の中で思うように活動できない日々を送っている。"
    ],
    actorName: "コトハ",
    actorRomaji: "KOTOHA",
    actorBio: [
      "俳優。広島県出身。舞台・映画・ドラマ・MVなど映像作品を中心に活動。",
      "演技のほか、歌やダンスなど幅広い表現活動に取り組む。"
    ],
    image: null, // 写真追加時は "/prof/kotoha.jpg" 等を指定
    links: {
      x: "https://x.com/kotoha_sforzo",
      instagram: "https://www.instagram.com/kotoha_sforzo/"
    }
  },
  {
    id: "kanbayashi-shuhei",
    role: "神林修平",
    age: "25歳",
    roleTagline: "映画監督志望",
    roleBio: [
      "桃華の恋人。桃華とちはるを出演させた自主映画を一本完成させているが、その後は次作へ進めずにいる。",
      "フードデリバリーで生活をつなぎながら、映画を撮る機会を模索している。"
    ],
    actorName: "福井 将真",
    actorRomaji: "SHOMA FUKUI",
    actorBio: [
      "俳優・脚本・演出。福岡県出身。「縁ぎや企画」主宰。",
      "舞台出演のほか、自身でも脚本・演出作品を発表している。"
    ],
    image: null, // 写真追加時は "/prof/fukui.jpg" 等を指定
    links: {
      x: "https://x.com/resolution217",
      instagram: "https://www.instagram.com/shoma_fukui/"
    }
  },
  {
    id: "sasaki-ayako",
    role: "佐々木綾子",
    age: "53歳",
    roleTagline: "小料理屋「こまち」の女将",
    roleBio: [
      "「さくらみち」の向かいで店を営む。絹山とは、言葉にしないまま親しい時間を重ねている。"
    ],
    actorName: "かずさ 容子",
    actorRomaji: "YOKO KAZUSA",
    actorBio: [
      "俳優。東京都出身。1987年に宝塚歌劇団へ入団。舞台・テレビを中心に活動。『大岡越前』『水戸黄門』『流れる雲よ』などに出演。"
    ],
    image: null, // 写真追加時は "/prof/kazusa.jpg" 等を指定
    links: {
      x: "https://x.com/kazusa_yoko"
    }
  },
  {
    id: "kinuyama-akira",
    role: "絹山彰",
    age: "55歳",
    roleTagline: "スナック「さくらみち」マスター",
    roleBio: [
      "スナック「さくらみち」のマスターで桃華の叔父。口数は少なく、結論を急がず、人の話を最後まで聞く人物。桃華の芝居を静かに見守っている。"
    ],
    actorName: "岸 博之",
    actorRomaji: "HIROYUKI KISHI",
    actorBio: [
      "俳優。熊本県出身。アンテーヌ所属。劇団カクスコ創立メンバー。舞台・映画・テレビドラマなど多数の作品に出演。"
    ],
    image: null, // 写真追加時は "/prof/kishi.jpg" 等を指定
    links: {
      agency: {
        name: "アンテーヌ",
        url: "https://antenne.jp/"
      }
    }
  }
];

// その他の登場人物 (4名)
export const OTHER_CHARACTERS: OtherCharacter[] = [
  {
    id: "kuhara-sayaka",
    name: "久原 沙也加",
    romaji: "KUHARA SAYAKA",
    age: "36歳",
    tagline: "演出家・俳優",
    bio: "劇団パイプドリーム主宰。ラジオパーソナリティ。桃華のオーディションを行い、俳優としての可能性を見ている。"
  },
  {
    id: "miura",
    name: "三浦",
    romaji: "MIURA",
    age: "26歳",
    tagline: "修平の元同僚",
    bio: "修平の元同僚。映画を撮れずにいる修平に、自称プロデューサー・本郷と給付制度の話を紹介する。"
  },
  {
    id: "terada",
    name: "寺田",
    romaji: "TERADA",
    age: "52歳",
    tagline: "「さくらみち」古参常連",
    bio: "大きな夢や「いつか」の話を酒席で語る一方、なかなか動かない。店の空気を明るくする常連客。"
  },
  {
    id: "tanigawa",
    name: "谷川",
    romaji: "TANIGAWA",
    age: "38歳",
    tagline: "芝居好きの常連客",
    bio: "外回りの営業職。仕事の合間に小劇場へ足を運ぶほど芝居が好きで、「さくらみち」に通う。"
  }
];
