export interface Character {
  id: string;
  characterCode: string;
  name: string;
  displayName?: string | null;
  actorName?: string | null;
  description?: string | null;
  sortOrder: number;
}

export interface CostumeLook {
  id: string;
  characterId: string;
  lookCode: string;
  title?: string | null;
  description?: string | null;
  mainPhotoUrl?: string | null;
  photos?: string[];
  sortOrder: number;
}

export interface CostumeDay {
  id: string;
  characterId: string;
  dayNumber: number;
  displayLabel: string;
  storyDate?: string | null;
  costumeLookId?: string | null;
  lookDiff?: string | null;
  makeup?: string | null;
  propsText?: string | null;
  remarks?: string | null;
  sortOrder: number;
  // 計算・結合用
  scenes?: string[];
  locations?: string[];
  sceneSummary?: string;
}

export interface Scene {
  id: string;
  sceneNumber: string;
  sortOrder: number;
  dayNight?: string | null;
  storyDate?: string | null;
  timeOfDay?: string | null;
  location?: string | null;
  summary?: string | null;
  remarks?: string | null;
}

export interface SceneAppearance {
  id: string;
  sceneId: string;
  characterId: string;
  characterName: string;
  costumeDayId?: string | null;
  costumeLookId?: string | null;
  dayNumber?: number | null;
  displayLabel?: string | null;
  appearanceType?: string | null;
  costumeCandidate?: string | null; // 衣装候補 / 衣装・装身具
  variation?: string | null; // シーン固有差分 (ジャケット脱ぎ、汚れ等)
  propsText?: string | null; // 持道具 / 小道具
  makeup?: string | null; // メイク / 髪型
  notes?: string | null; // 備考
  manualOverride?: boolean; // 手動編集保護フラグ
  importSource?: string | null; // インポート元ファイル・シート
  importedAt?: string | null; // インポート日時
  sortOrder: number;
}

export interface ShootingDay {
  id: string;
  shootDate: string;
  dayCode: string;
  dayLabel: string;
  locationNote?: string | null;
  remarks?: string | null;
  sortOrder: number;
  sceneIds: string[];
}

export interface ScheduleEntry {
  id: string;
  shootingDayId: string;
  shootDate: string;
  sceneId: string;
  sortOrder: number;
  timeNote?: string | null;
  sceneAction?: string | null;
  location?: string | null;
  remarks?: string | null;
}

export interface PropItem {
  id: string;
  name: string;
  category: "prop" | "accessory"; // 小道具 / 持道具
  costumeDayId?: string | null;
  sceneId?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
}

// 画像メタデータ (Excel抽出 & 手動アップロード)
export interface CostumePhoto {
  id: string;
  hash: string; // SHA-256 (重複防止用)
  url: string; // Vercel Blob またはローカルURL
  characterId?: string | null;
  costumeLookId?: string | null;
  costumeDayId?: string | null;
  sceneId?: string | null;
  sceneAssignmentId?: string | null;
  category:
    | "full_body"
    | "upper_body"
    | "shoes"
    | "bag"
    | "accessory"
    | "prop"
    | "makeup"
    | "hair"
    | "unclassified";
  caption?: string | null;
  isMainForLook?: boolean;
  sourceType: "manual_upload" | "excel_embedded_image";
  sourceFile?: string | null;
  sourceSheet?: string | null;
  sourceAnchor?: string | null;
  createdAt: string;
}

export interface ImportHistory {
  id: string;
  fileName: string;
  importType: "scene_costume" | "overall_continuity" | "daily_schedule" | "excel_images";
  importedAt: string;
  totalRows: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
}
