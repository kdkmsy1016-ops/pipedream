import { CostumeLook, CostumePhoto, Character } from "../types";

export interface CreateLookParams {
  photoUrl: string;
  characterId?: string | null;
  characterTag?: string | null;
  lookTitle?: string | null;
  category?: CostumePhoto["category"];
  sourceType?: CostumePhoto["sourceType"];
  sourceFile?: string | null;
  sourceSheet?: string | null;
  sourceAnchor?: string | null;
  fileSize?: number;
  mimeType?: string;
}

export interface AddPhotoToLookParams {
  lookId: string;
  photoUrl: string;
  makeMain?: boolean;
  category?: CostumePhoto["category"];
  sourceType?: CostumePhoto["sourceType"];
  sourceFile?: string | null;
  sourceSheet?: string | null;
  sourceAnchor?: string | null;
}

/**
 * 画像からCostumeLookを即時生成する共通処理
 * （通常アップロードおよび将来のExcel画像抽出の両方から呼び出されます）
 */
export function createLookFromImage(
  params: CreateLookParams,
  context: {
    existingLooks: CostumeLook[];
    characters: Character[];
    photos: CostumePhoto[];
  }
): {
  newLook: CostumeLook;
  newPhoto: CostumePhoto;
  updatedLooks: CostumeLook[];
  updatedPhotos: CostumePhoto[];
} {
  const { existingLooks, characters, photos } = context;
  const nowIso = new Date().toISOString();

  const charId = params.characterId || "UNCLASSIFIED";
  const char = characters.find((c) => c.id === charId);
  const charTag = params.characterTag || (char ? char.name : "未分類");

  // キャラクターごとに次のLOOK番号を自動採番
  const charLooks = existingLooks.filter((l) => l.characterId === charId);
  const nextNum = charLooks.length + 1;
  const lookCode = `LOOK ${String(nextNum).padStart(2, "0")}`;

  const newLookId = `LOOK_${charId}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  const photoId = `PHOTO_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  const newPhoto: CostumePhoto = {
    id: photoId,
    hash: "", // Direct uploadの場合は空文字またはURL基準
    url: params.photoUrl,
    characterId: charId !== "UNCLASSIFIED" ? charId : null,
    costumeLookId: newLookId,
    category: params.category || "full_body",
    isMainForLook: true,
    sourceType: params.sourceType || "manual_upload",
    sourceFile: params.sourceFile || null,
    sourceSheet: params.sourceSheet || null,
    sourceAnchor: params.sourceAnchor || null,
    createdAt: nowIso,
  };

  const newLook: CostumeLook = {
    id: newLookId,
    characterId: charId,
    characterTag: charTag,
    lookNumber: nextNum,
    lookCode,
    title: params.lookTitle || null,
    description: "",
    mainPhotoId: photoId,
    mainPhotoUrl: params.photoUrl,
    photos: [params.photoUrl],
    sortOrder: nextNum,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const updatedLooks = [...existingLooks, newLook];
  const updatedPhotos = [...photos, newPhoto];

  return {
    newLook,
    newPhoto,
    updatedLooks,
    updatedPhotos,
  };
}

/**
 * 既存LOOKへ追加写真を登録する共通処理
 */
export function addPhotoToExistingLook(
  params: AddPhotoToLookParams,
  context: {
    existingLooks: CostumeLook[];
    photos: CostumePhoto[];
  }
): {
  updatedLook: CostumeLook;
  newPhoto: CostumePhoto;
  updatedLooks: CostumeLook[];
  updatedPhotos: CostumePhoto[];
} {
  const { existingLooks, photos } = context;
  const nowIso = new Date().toISOString();

  const lookIndex = existingLooks.findIndex((l) => l.id === params.lookId);
  if (lookIndex === -1) {
    throw new Error(`Look not found: ${params.lookId}`);
  }

  const look = existingLooks[lookIndex];
  const photoId = `PHOTO_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  const newPhoto: CostumePhoto = {
    id: photoId,
    hash: "",
    url: params.photoUrl,
    characterId: look.characterId !== "UNCLASSIFIED" ? look.characterId : null,
    costumeLookId: look.id,
    category: params.category || "full_body",
    isMainForLook: Boolean(params.makeMain),
    sourceType: params.sourceType || "manual_upload",
    sourceFile: params.sourceFile || null,
    sourceSheet: params.sourceSheet || null,
    sourceAnchor: params.sourceAnchor || null,
    createdAt: nowIso,
  };

  const photoList = look.photos ? [...look.photos, params.photoUrl] : [params.photoUrl];
  const mainPhotoUrl = params.makeMain || !look.mainPhotoUrl ? params.photoUrl : look.mainPhotoUrl;
  const mainPhotoId = params.makeMain || !look.mainPhotoId ? photoId : look.mainPhotoId;

  const updatedLook: CostumeLook = {
    ...look,
    mainPhotoUrl,
    mainPhotoId,
    photos: photoList,
    updatedAt: nowIso,
  };

  const updatedLooks = [...existingLooks];
  updatedLooks[lookIndex] = updatedLook;
  const updatedPhotos = [...photos, newPhoto];

  return {
    updatedLook,
    newPhoto,
    updatedLooks,
    updatedPhotos,
  };
}
