import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { loadCostumeDatabase, saveCostumeDatabase } from "../../lib/store";
import { CostumePhoto, CostumeLook } from "../../types";

export const dynamic = "force-dynamic";

interface ImageUploadPayload {
  dataBase64: string;
  fileName: string;
  mimeType: string;
  hash: string;
  action: "create_new_look" | "add_to_existing_look" | "import_unclassified" | "ignore";
  characterId?: string | null;
  characterTag?: string | null;
  costumeLookId?: string | null;
  lookTitle?: string | null;
  category: CostumePhoto["category"];
  makeMainForLook?: boolean;
  sourceFile?: string | null;
  sourceSheet?: string | null;
  sourceAnchor?: string | null;
}

export async function POST(req: Request) {
  try {
    const body: { images: ImageUploadPayload[] } = await req.json();
    if (!body.images || body.images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const db = loadCostumeDatabase();
    let currentPhotos = [...(db.photos || [])];
    let looks = [...db.costumeLooks];
    const characters = db.characters;

    let savedCount = 0;
    let createdLookCount = 0;
    let skippedCount = 0;
    const nowIso = new Date().toISOString();

    for (const item of body.images) {
      if (item.action === "ignore") {
        skippedCount++;
        continue;
      }

      // 1. 重複チェック (同一ハッシュ)
      const existing = currentPhotos.find((p) => p.hash === item.hash);
      if (existing) {
        skippedCount++;
        continue;
      }

      // Base64からバッファに変換
      const base64Data = item.dataBase64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const cleanFileName = `${Date.now()}_${item.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      let photoUrl = "";

      // 2. Vercel Blob または ローカルフォールバック保存
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`costume/excel-images/${cleanFileName}`, buffer, {
          access: "public",
          contentType: item.mimeType,
        });
        photoUrl = blob.url;
      } else {
        const uploadDir = path.join(process.cwd(), "public", "costume-uploads", "excel-images");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, cleanFileName);
        fs.writeFileSync(filePath, buffer);
        photoUrl = `/costume-uploads/excel-images/${cleanFileName}`;
      }

      // 3. キャラクター特定
      const charId = item.characterId || "UNCLASSIFIED";
      const char = characters.find((c) => c.id === charId);
      const charTag = item.characterTag || (char ? char.name : "未分類");

      let targetLookId = item.costumeLookId || null;

      // 4. 【要件1】画像インポート = 新規LOOK即時作成
      if (item.action === "create_new_look" || !targetLookId) {
        // キャラクターごとの既存LOOKから次の番号を自動採番
        const charExistingLooks = looks.filter((l) => l.characterId === charId);
        const nextLookNum = charExistingLooks.length + 1;
        const lookCode = `LOOK ${String(nextLookNum).padStart(2, "0")}`;

        const newLookId = `LOOK_${charId}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 6)}`;

        const newLook: CostumeLook = {
          id: newLookId,
          characterId: charId,
          characterTag: charTag,
          lookNumber: nextLookNum,
          lookCode,
          title: item.lookTitle || (item.sourceSheet ? `${item.sourceSheet}の衣装` : null),
          description: `Excel画像取込 (${item.sourceFile || "Excel"} - ${item.sourceSheet || ""} ${item.sourceAnchor || ""})`,
          mainPhotoId: null, // 写真作成後に設定
          mainPhotoUrl: photoUrl, // 代表写真として即時設定
          photos: [photoUrl],
          sortOrder: nextLookNum,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        looks.push(newLook);
        targetLookId = newLookId;
        createdLookCount++;
      } else if (item.action === "add_to_existing_look" && targetLookId) {
        // 既存LOOKへの追加写真登録
        const lIdx = looks.findIndex((l) => l.id === targetLookId);
        if (lIdx !== -1) {
          const l = looks[lIdx];
          const photos = l.photos ? [...l.photos, photoUrl] : [photoUrl];
          const mainPhotoUrl = (!l.mainPhotoUrl || item.makeMainForLook) ? photoUrl : l.mainPhotoUrl;
          looks[lIdx] = {
            ...l,
            mainPhotoUrl,
            photos,
            updatedAt: nowIso,
          };
        }
      }

      // 5. Photo レコードの作成
      const photoId = `PHOTO_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newPhoto: CostumePhoto = {
        id: photoId,
        hash: item.hash,
        url: photoUrl,
        characterId: charId !== "UNCLASSIFIED" ? charId : null,
        costumeLookId: targetLookId,
        category: item.category,
        isMainForLook: true,
        sourceType: "excel_embedded_image",
        sourceFile: item.sourceFile || null,
        sourceSheet: item.sourceSheet || null,
        sourceAnchor: item.sourceAnchor || null,
        createdAt: nowIso,
      };

      // LOOKのmainPhotoIdを更新
      const targetLookIndex = looks.findIndex((l) => l.id === targetLookId);
      if (targetLookIndex !== -1 && !looks[targetLookIndex].mainPhotoId) {
        looks[targetLookIndex].mainPhotoId = photoId;
      }

      currentPhotos.push(newPhoto);
      savedCount++;
    }

    // 6. データベースへ永続保存
    db.photos = currentPhotos;
    db.costumeLooks = looks;
    saveCostumeDatabase(db);

    return NextResponse.json({
      success: true,
      savedCount,
      createdLookCount,
      skippedCount,
      totalPhotos: currentPhotos.length,
      totalLooks: looks.length,
    });
  } catch (error: any) {
    console.error("Save excel images error:", error);
    return NextResponse.json(
      { error: "Failed to save excel images: " + error.message },
      { status: 500 }
    );
  }
}
