/**
 * 映画『盈虚とパイプドリーム』予告編・特報動画の設定
 * ページ内埋め込みセクションおよび自動表示モーダルの両方で一元参照されます。
 */
export const TRAILER_CONFIG = {
  // YouTube動画ID
  videoId: "nbCht1onqWU",
  // 動画URL
  videoUrl: "https://youtu.be/nbCht1onqWU",
  // タイトル
  title: "映画『盈虚とパイプドリーム』特報",
  // 専用高解像度サムネイル（1920x1080）
  customThumbnailUrl: "/images/trailer-thumbnail.jpg",
  // サムネイルのフォールバック優先順リスト（1. 独自高解像度 -> 2. maxresdefault -> 3. sddefault -> 4. hqdefault）
  getThumbnailCandidates: (videoId: string = "nbCht1onqWU") => [
    "/images/trailer-thumbnail.jpg",
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  ],
};
