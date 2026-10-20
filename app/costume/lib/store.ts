import fs from "fs";
import path from "path";
import type {
  Character,
  CostumeDay,
  CostumeLook,
  Scene,
  SceneAppearance,
  ShootingDay,
  ScheduleEntry,
  ImportHistory,
  CostumePhoto,
} from "../types";

export interface CostumeDatabase {
  characters: Character[];
  costumeLooks: CostumeLook[];
  costumeDays: CostumeDay[];
  scenes: Scene[];
  assignments: SceneAppearance[];
  shootingDays: ShootingDay[];
  scheduleEntries: ScheduleEntry[];
  photos?: CostumePhoto[];
  importHistories?: ImportHistory[];
  updatedAt: string;
}

const DATA_FILE = path.join(
  process.cwd(),
  "app",
  "costume",
  "data",
  "seed_data.json"
);

// メモリキャッシュ
let cache: CostumeDatabase | null = null;

export function loadCostumeDatabase(): CostumeDatabase {
  if (cache) return cache;

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const json = JSON.parse(raw);

      const characters: Character[] = (json.characters || []).map(
        (c: any, idx: number) => ({
          id: c.characterId || c.id || `char_${idx}`,
          characterCode: c.characterId || c.characterCode || `char_${idx}`,
          name: c.name || c.displayName || "名称未定",
          displayName: c.displayName || c.name || null,
          actorName: c.actorName || null,
          description: c.description || null,
          sortOrder: c.sortOrder ?? idx + 1,
        })
      );

      const costumeLooks: CostumeLook[] = (json.costumeLooks || []).map(
        (l: any, idx: number) => ({
          id: l.lookId || l.id || `look_${idx}`,
          characterId: l.characterId,
          lookCode: l.lookCode || `LOOK ${idx + 1}`,
          title: l.title || null,
          description: l.description || null,
          mainPhotoUrl: l.mainPhotoUrl || null,
          photos: l.photos || [],
          sortOrder: l.sortOrder ?? idx + 1,
        })
      );

      const costumeDays: CostumeDay[] = (json.costumeDays || []).map(
        (d: any, idx: number) => ({
          id: d.costumeDayId || d.id || `cday_${idx}`,
          characterId: d.characterId,
          dayNumber: d.dayNumber ?? idx + 1,
          displayLabel: d.displayLabel || `日替わり${d.dayNumber ?? idx + 1}`,
          storyDate: d.storyDate || null,
          costumeLookId: d.lookId || d.costumeLookId || null,
          lookDiff: d.lookDiff || null,
          makeup: d.makeup || null,
          propsText: d.propsText || null,
          remarks: d.remarks || null,
          sortOrder: d.sortOrder ?? idx + 1,
          scenes: d.scenes || [],
          locations: d.locations || [],
          sceneSummary: d.sceneSummary || "",
        })
      );

      const scenes: Scene[] = (json.scenes || []).map((s: any, idx: number) => ({
        id: s.sceneId || s.id || `s_${idx}`,
        sceneNumber: String(s.sceneNumber || s.sceneId || idx + 1).replace(
          /^S/i,
          ""
        ),
        sortOrder: s.sortOrder ?? (idx + 1) * 10,
        dayNight: s.dayNight || null,
        storyDate: s.storyDate || null,
        timeOfDay: s.storyTime || s.timeOfDay || null,
        location: Array.isArray(s.locations)
          ? s.locations.join("、")
          : s.location || null,
        summary: s.summary || null,
        remarks: s.remarks || null,
      }));

      const assignments: SceneAppearance[] = (
        json.sceneCharacterAssignments || json.assignments || []
      ).map((a: any, idx: number) => ({
        id: a.id || a.assignmentId || `asg_${idx}`,
        sceneId: a.sceneId,
        characterId: a.characterId,
        characterName:
          a.characterName ||
          characters.find((c) => c.id === a.characterId)?.name ||
          a.characterId,
        costumeDayId: a.costumeDayId || null,
        costumeLookId: a.lookId || a.costumeLookId || a.overrideLookId || null,
        dayNumber: a.dayNumber || null,
        displayLabel: a.displayLabel || null,
        appearanceType: a.appearanceType || "実登場",
        costumeCandidate: a.costumeCandidate || null,
        variation: a.variation || a.lookDiff || null,
        propsText: a.sceneProps || a.propsText || null,
        makeup: a.makeup || null,
        notes: a.note || a.notes || a.remarks || null,
        manualOverride: Boolean(a.manualOverride),
        importSource: a.importSource || null,
        importedAt: a.importedAt || null,
        sortOrder: a.sortOrder ?? idx + 1,
      }));

      const shootingDays: ShootingDay[] = (json.shootingDays || []).map(
        (sd: any, idx: number) => ({
          id: sd.id || sd.shootingDayId || `sday_${idx}`,
          shootDate: sd.shootDate,
          dayCode: sd.dayCode || `DAY${idx + 1}`,
          dayLabel: sd.dayLabel || `撮影Day ${idx + 1}`,
          locationNote: sd.locationNote || null,
          remarks: sd.remarks || null,
          sortOrder: sd.sortOrder ?? idx + 1,
          sceneIds: sd.sceneIds || [],
        })
      );

      const scheduleEntries: ScheduleEntry[] = (
        json.scheduleEntries || []
      ).map((se: any, idx: number) => ({
        id: se.id || se.entryId || `entry_${idx}`,
        shootingDayId: se.shootingDayId,
        shootDate: se.shootDate,
        sceneId: se.sceneId,
        sortOrder: se.sortOrder ?? idx + 1,
        timeNote: se.timeNote ? String(se.timeNote) : null,
        sceneAction: se.sceneAction || null,
        location: se.location || null,
        remarks: se.remarks || null,
      }));

      const photos: CostumePhoto[] = json.photos || [];
      const importHistories: ImportHistory[] = json.importHistories || [];

      cache = {
        characters,
        costumeLooks,
        costumeDays,
        scenes,
        assignments,
        shootingDays,
        scheduleEntries,
        photos,
        importHistories,
        updatedAt: json.meta?.updatedAt || new Date().toISOString(),
      };
      return cache;
    } catch (e) {
      console.error("Failed to parse seed_data.json:", e);
    }
  }

  // フォールバック（空構造）
  return {
    characters: [],
    costumeLooks: [],
    costumeDays: [],
    scenes: [],
    assignments: [],
    shootingDays: [],
    scheduleEntries: [],
    photos: [],
    importHistories: [],
    updatedAt: new Date().toISOString(),
  };
}

export function saveCostumeDatabase(db: CostumeDatabase) {
  cache = db;
  try {
    const jsonOutput = {
      meta: {
        version: "9.4.0",
        title: "映画『盈虚とパイプドリーム』決定稿衣装香盤",
        updatedAt: new Date().toISOString(),
      },
      characters: db.characters,
      costumeLooks: db.costumeLooks,
      costumeDays: db.costumeDays,
      scenes: db.scenes,
      sceneCharacterAssignments: db.assignments,
      shootingDays: db.shootingDays,
      scheduleEntries: db.scheduleEntries,
      photos: db.photos || [],
      importHistories: db.importHistories || [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(jsonOutput, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save costume database to file:", err);
  }
}
