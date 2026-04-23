export const MOTION_GALLERY_URL = "https://motion-gallery.net/projects/eikyo-to-pipedream";

export const TIERS = [
    {
        id: 1,
        name: "【ふらっと一杯！】プラン",
        price: "3,000",
        description: "はじめて応援してくださる方向けのライトプラン。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">A</div>,
        returns: [
            "お礼メール",
            "映画キービジュアル デジタルカード（1点）",
            "舞台『場末のパイプドリーム』キービジュアル デジタルカード（俳優サイン付き／1点）",
            "クレジット等に支援者（Special Thanks）としてお名前記載（小サイズ・1名分）"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64600"
    },
    {
        id: 2,
        name: "【マスター、もう一杯だけ！】プラン",
        price: "6,000",
        description: "作品資料も楽しみたい方向け。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">B</div>,
        returns: [
            "プランAの特典すべて",
            "脚本（最終稿）PDFデータ",
            "舞台『場末のパイプドリーム』舞台写真デジタルフォトブック（PDF／約20P予定）"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64601"
    },
    {
        id: 3,
        name: "【また来ちゃった！さくらみち常連客】プラン",
        price: "12,000",
        description: "舞台本編までしっかり楽しみたい方向け。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">C</div>,
        returns: [
            "プランBの特典すべて（※クレジットは中サイズにアップグレード）",
            "舞台『場末のパイプドリーム』公演本編 限定アーカイブ（限定URL／パスコード）",
            "名前入りボトルキープ札（小サイズ／梅）（1名分）"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64602"
    },
    {
        id: 4,
        name: "【マスターいつもの！さくらみち超常連客】プラン",
        price: "30,000",
        description: "“支援者として作品に名前を残したい”方向け。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">D</div>,
        returns: [
            "プランCの特典すべて（※ボトルキープ札・梅は含まず竹に変更、クレジットは大サイズ）",
            "キャスト・監督のサイン入り完成台本（製本版）",
            "名前入りボトルキープ札（中サイズ／竹）（1名分）"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64603"
    },
    {
        id: 5,
        name: "【新しいの入れといて！さくらみちボトルキープ】プラン",
        price: "60,000",
        description: "作品世界への参加感が高い、象徴的なリターン付きプラン。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">E</div>,
        returns: [
            "プランDの特典すべて（※ボトルキープ札・竹は含まず松に変更）",
            "中ボトルのボトルキープ札にお名前記載（松）（1名分）※劇中で使用後、現物郵送",
            "映画『盈虚とパイプドリーム』限定試写動画 視聴URL ※完成後、オンライン／視聴期限1か月"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64604"
    },
    {
        id: 6,
        name: "【スナックさくらみち貸切・完成記念パーティーご招待！】プラン",
        price: "100,000",
        description: "完成後の特別な場を一緒に楽しむ上位プラン。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">F</div>,
        returns: [
            "プランEの特典すべて",
            "映画の舞台となるスナック「さくらみち」（東京都稲城市）で行う試写会に、キャスト・スタッフと参加 ※完成記念パーティー／試写会ご招待"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64605"
    },
    {
        id: 7,
        name: "【アソシエイトプロデューサー権】プラン",
        price: "300,000",
        description: "個人・法人協賛向けの最上位プラン。",
        icon: <div className="text-[#ffbf00] font-bold text-lg leading-none w-5 h-5 flex items-center justify-center">G</div>,
        returns: [
            "プランFの特典すべて（※クレジットがアソシエイトプロデューサーに変更）",
            "クレジット等にアソシエイトプロデューサー（協賛）としてお名前記載（1名分）",
            "法人・企業ロゴ掲載可"
        ],
        url: "https://motion-gallery.net/projects/eikyo-to-pipedream/collection/new?ticket_id=64606"
    }
];

export const MATRIX_FEATURES = [
    { name: "お礼メール", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "映画・舞台KV デジタルカード", tiers: [1, 2, 3, 4, 5, 6, 7] },
    { name: "STクレジット(小)", tiers: [1, 2] },
    { name: "台本PDF・舞台フォトブック", tiers: [2, 3, 4, 5, 6, 7] },
    { name: "STクレジット(中)", tiers: [3] },
    { name: "名前入りキープ札(梅)", tiers: [3] },
    { name: "舞台公演 限定アーカイブ", tiers: [3, 4, 5, 6, 7] },
    { name: "STクレジット(大)", tiers: [4, 5, 6] },
    { name: "名前入りキープ札(竹)", tiers: [4] },
    { name: "キャスト・監督サイン入り完成台本", tiers: [4, 5, 6, 7] },
    { name: "名前入りキープ札(松)※使用後郵送", tiers: [5, 6, 7] },
    { name: "映画限定試写動画(オンライン)", tiers: [5, 6, 7] },
    { name: "完成記念パーティーご招待", tiers: [6, 7] },
    { name: "APお名前記載・ロゴ掲載", tiers: [7] }
];
