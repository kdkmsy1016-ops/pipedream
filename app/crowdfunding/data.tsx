export const MOTION_GALLERY_URL = "https://motion-gallery.net/projects/eikyo-to-pipedream";

export const TIERS = [
    {
        id: 1,
        name: "【ふらっと一杯！】プラン",
        price: "3,000",
        description: "お気持ちをご支援いただける方に。スナックさくらみちの雰囲気を味わえます。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">A</div>,
        returns: [
            "お礼メール",
            "映画『盈虚とパイプドリーム』キービジュアル デジタルカード",
            "舞台『場末のパイプドリーム』キービジュアル デジタルカード（俳優サイン付き）"
        ]
    },
    {
        id: 2,
        name: "【マスター、もう一杯だけ！】プラン",
        price: "6,000",
        description: "脚本と舞台写真で、物語の裏側までお楽しみいただけます。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">B</div>,
        returns: [
            "プランAのすべて",
            "舞台『場末のパイプドリーム』脚本（最終稿）PDFデータ",
            "舞台『場末のパイプドリーム』舞台写真デジタルフォトブック（PDF／約20P予定）"
        ]
    },
    {
        id: 3,
        name: "【また来ちゃった！さくらみち常連客】プラン",
        price: "12,000",
        description: "舞台の生きた空間を、限定アーカイブ映像で何度でも目撃できます。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">C</div>,
        returns: [
            "プランBのすべて",
            "舞台『場末のパイプドリーム』公演本編 限定アーカイブ（限定URL／パスコード）"
        ]
    },
    {
        id: 4,
        name: "【マスターいつもの！さくらみち超常連客】プラン",
        price: "30,000",
        description: "作品のエンドロールにお名前を刻み、リアルな完成台本をお届けします。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">D</div>,
        returns: [
            "プランCのすべて",
            "映画『盈虚とパイプドリーム』エンドクレジット等に支援者（Special Thanks）としてお名前記載（1名分）",
            "映画『盈虚とパイプドリーム』のキャスト・監督サイン入り完成台本（製本版）"
        ]
    },
    {
        id: 5,
        name: "【新しいの入れといて！さくらみちボトルキープ】プラン",
        price: "60,000",
        description: "映画劇中で実際に使用した「あなた名義のキープ札」と、映画のオンライン先行試写。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">E</div>,
        returns: [
            "プランDのすべて（台本等含む）",
            "映画劇中に登場するボトルのボトルキープ札にお名前記載（1名分）※劇中で使用後、現物郵送",
            "映画『盈虚とパイプドリーム』限定試写動画 視聴URL（完成後、オンライン／視聴期限1か月）"
        ]
    },
    {
        id: 6,
        name: "【スナックさくらみち貸切・完成記念パーティーご招待！】プラン",
        price: "100,000",
        description: "聖地「さくらみち」で関係者と共に完成を祝う、特別なリアルイベントへご招待。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">F</div>,
        returns: [
            "プランEのすべて",
            "映画の舞台となるスナック「さくらみち」（東京都稲城市）で行う試写会に、キャスト・スタッフと参加",
            "完成記念パーティー／試写会ご招待"
        ]
    },
    {
        id: 7,
        name: "【アソシエイトプロデューサー権】プラン",
        price: "300,000",
        description: "作品を根底から支え、共に創り上げる最高ランクのスポンサー権です。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">G</div>,
        returns: [
            "プランFのすべて",
            "映画のエンドクレジット等にアソシエイトプロデューサー（協賛）としてお名前記載（1名分）",
            "法人・企業ロゴ掲載可"
        ]
    }
];

export const MATRIX_FEATURES = [
    { name: "お礼メール", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "KV デジタルカード", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "舞台KVサイン付カード", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "舞台脚本(最終稿)PDFデータ", tiers: [2, 3, 4, 5, 6, 7] },
    { name: "舞台デジタルフォトブック", tiers: [2, 3, 4, 5, 6, 7] },
    { name: "舞台公演 限定アーカイブ", tiers: [3, 4, 5, 6, 7] },
    { name: "映画のエンドロールお名前記載", tiers: [4, 5, 6, 7] },
    { name: "映画のキャスト・監督サイン入り完成台本", tiers: [4, 5, 6, 7] },
    { name: "映画劇中にあなた名義のキープ札(現物郵送)", tiers: [5, 6, 7] },
    { name: "映画限定試写動画(オンライン)", tiers: [5, 6, 7] },
    { name: "さくらみち試写会・パーティー参加", tiers: [6, 7] },
    { name: "APクレジット・ロゴ掲載可", tiers: [7] }
];
