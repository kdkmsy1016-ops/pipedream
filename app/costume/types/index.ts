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
  variation?: string | null;
  propsText?: string | null;
  notes?: string | null;
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
