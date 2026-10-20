import { NextResponse } from "next/server";
import { loadCostumeDatabase, saveCostumeDatabase } from "../../../lib/store";
import { createLookFromImage, addPhotoToExistingLook } from "../../../lib/look-service";

export const dynamic = "force-dynamic";

interface BatchRegisterItem {
  photoUrl: string;
  action: "create_new_look" | "add_to_existing_look";
  characterId?: string | null;
  characterTag?: string | null;
  lookTitle?: string | null;
  targetLookId?: string | null;
  makeMain?: boolean;
  category?: any;
  fileSize?: number;
  mimeType?: string;
  fileName?: string;
}

export async function POST(req: Request) {
  try {
    const body: { items: BatchRegisterItem[] } = await req.json();
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "登録対象の画像がありません" }, { status: 400 });
    }

    const db = loadCostumeDatabase();
    let currentLooks = [...db.costumeLooks];
    let currentPhotos = [...(db.photos || [])];
    const characters = db.characters;

    let successCount = 0;
    let createdLookCount = 0;
    let addedPhotoCount = 0;

    for (const item of body.items) {
      if (item.action === "create_new_look") {
        const result = createLookFromImage(
          {
            photoUrl: item.photoUrl,
            characterId: item.characterId,
            characterTag: item.characterTag,
            lookTitle: item.lookTitle,
            category: item.category || "full_body",
            sourceType: "manual_upload",
            sourceFile: item.fileName || null,
            fileSize: item.fileSize,
            mimeType: item.mimeType,
          },
          {
            existingLooks: currentLooks,
            characters,
            photos: currentPhotos,
          }
        );
        currentLooks = result.updatedLooks;
        currentPhotos = result.updatedPhotos;
        createdLookCount++;
        successCount++;
      } else if (item.action === "add_to_existing_look" && item.targetLookId) {
        const result = addPhotoToExistingLook(
          {
            lookId: item.targetLookId,
            photoUrl: item.photoUrl,
            makeMain: item.makeMain,
            category: item.category || "full_body",
            sourceType: "manual_upload",
            sourceFile: item.fileName || null,
          },
          {
            existingLooks: currentLooks,
            photos: currentPhotos,
          }
        );
        currentLooks = result.updatedLooks;
        currentPhotos = result.updatedPhotos;
        addedPhotoCount++;
        successCount++;
      }
    }

    // DB永続保存
    db.costumeLooks = currentLooks;
    db.photos = currentPhotos;
    saveCostumeDatabase(db);

    return NextResponse.json({
      success: true,
      successCount,
      createdLookCount,
      addedPhotoCount,
      totalLooks: currentLooks.length,
      totalPhotos: currentPhotos.length,
    });
  } catch (error: any) {
    console.error("Batch register looks error:", error);
    return NextResponse.json(
      { error: "LOOK登録処理に失敗しました: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
