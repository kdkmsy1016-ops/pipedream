import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { loadCostumeDatabase, saveCostumeDatabase } from "../../lib/store";
import { CostumePhoto } from "../../types";

export const dynamic = "force-dynamic";

interface ImageUploadPayload {
  dataBase64: string;
  fileName: string;
  mimeType: string;
  hash: string;
  characterId?: string | null;
  costumeLookId?: string | null;
  costumeDayId?: string | null;
  sceneId?: string | null;
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

    let savedCount = 0;
    let skippedCount = 0;
    const nowIso = new Date().toISOString();

    for (const item of body.images) {
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

      // 3. Photo メタデータ作成
      const newPhoto: CostumePhoto = {
        id: `PHOTO_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        hash: item.hash,
        url: photoUrl,
        characterId: item.characterId || null,
        costumeLookId: item.costumeLookId || null,
        costumeDayId: item.costumeDayId || null,
        sceneId: item.sceneId || null,
        category: item.category,
        isMainForLook: Boolean(item.makeMainForLook),
        sourceType: "excel_embedded_image",
        sourceFile: item.sourceFile || null,
        sourceSheet: item.sourceSheet || null,
        sourceAnchor: item.sourceAnchor || null,
        createdAt: nowIso,
      };

      currentPhotos.push(newPhoto);

      // 4. LOOKの代表写真または写真ライブラリへの自動反映
      if (item.costumeLookId) {
        const lIdx = looks.findIndex((l) => l.id === item.costumeLookId);
        if (lIdx !== -1) {
          const l = looks[lIdx];
          const photos = l.photos ? [...l.photos, photoUrl] : [photoUrl];
          // 代表写真が未設定、またはmakeMainForLookが指定されている場合
          const mainPhotoUrl = (!l.mainPhotoUrl || item.makeMainForLook) ? photoUrl : l.mainPhotoUrl;
          looks[lIdx] = {
            ...l,
            mainPhotoUrl,
            photos,
          };
        }
      }

      savedCount++;
    }

    // 5. データベースへ永続保存
    db.photos = currentPhotos;
    db.costumeLooks = looks;
    saveCostumeDatabase(db);

    return NextResponse.json({
      success: true,
      savedCount,
      skippedCount,
      totalPhotos: currentPhotos.length,
    });
  } catch (error: any) {
    console.error("Save excel images error:", error);
    return NextResponse.json(
      { error: "Failed to save excel images: " + error.message },
      { status: 500 }
    );
  }
}
