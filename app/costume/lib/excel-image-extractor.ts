import JSZip from "jszip";
import crypto from "crypto";
import { normalizeSceneNumber, matchCharacter, matchLook } from "./excel-matcher";
import { Character, CostumeDay, CostumeLook, CostumePhoto } from "../types";

export interface ExtractedExcelImage {
  id: string;
  hash: string; // SHA-256
  mediaPath: string; // "xl/media/image1.jpeg"
  fileName: string;
  mimeType: string;
  dataBase64: string; // プレビュー用 data URL
  sheetName: string;
  anchor: {
    fromCol: number;
    fromRow: number;
    toCol?: number;
    toRow?: number;
    anchorStr: string;
  };
  // 推定・照合候補
  estimatedSceneNumber?: string | null;
  estimatedCharacterId?: string | null;
  estimatedCharacterName?: string | null;
  estimatedDayNumber?: number | null;
  estimatedCostumeDayId?: string | null;
  estimatedLookId?: string | null;
  estimatedCategory: CostumePhoto["category"];
  // 既存差し替え判定・重複判定
  isDuplicateOfId?: string | null;
  duplicateLookCode?: string | null;
  // ユーザー選択
  selectedAction: "create_new_look" | "add_to_existing_look" | "import_unclassified" | "ignore";
  selectedCharacterId?: string | null;
  selectedCharacterTag?: string | null;
  selectedCostumeDayId?: string | null;
  selectedLookId?: string | null;
  targetLookTitle?: string | null;
  selectedCategory: CostumePhoto["category"];
  makeMainForLook?: boolean;
}

// 列番号をアルファベット(A, B, C... AA)に変換
function colToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = "";
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export async function extractImagesFromXlsx(
  buffer: ArrayBuffer | Buffer,
  fileName: string,
  existingData: {
    characters: Character[];
    costumeDays: CostumeDay[];
    costumeLooks: CostumeLook[];
    photos?: CostumePhoto[];
  }
): Promise<ExtractedExcelImage[]> {
  const zip = await JSZip.loadAsync(buffer);

  // 1. メディア画像バイナリを読み込み、ハッシュ計算
  const mediaFiles = Object.keys(zip.files).filter((f) =>
    f.startsWith("xl/media/")
  );
  if (mediaFiles.length === 0) return [];

  const mediaMap: {
    [path: string]: {
      buffer: Buffer;
      hash: string;
      mimeType: string;
      base64: string;
    };
  } = {};

  for (const mPath of mediaFiles) {
    const fileData = await zip.files[mPath].async("nodebuffer");
    const hash = crypto.createHash("sha256").update(fileData).digest("hex");
    const ext = mPath.split(".").pop()?.toLowerCase() || "jpeg";
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
        ? "image/webp"
        : ext === "gif"
        ? "image/gif"
        : "image/jpeg";
    const base64 = `data:${mimeType};base64,${fileData.toString("base64")}`;
    mediaMap[mPath] = { buffer: fileData, hash, mimeType, base64 };
  }

  // 2. ワークブック構成 (シート名 ↔ ワークシートXML) の取得
  const wbXml = await zip.files["xl/workbook.xml"]?.async("text");
  const wbRels = await zip.files["xl/_rels/workbook.xml.rels"]?.async("text");
  if (!wbXml || !wbRels) return [];

  // Map: rId -> worksheets/sheetX.xml
  const relMatches = [
    ...wbRels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g),
  ];
  const rIdToSheetFile: { [rId: string]: string } = {};
  relMatches.forEach((m) => {
    rIdToSheetFile[m[1]] = m[2].replace(/^xl\//, "");
  });

  // Map: sheetName -> sheetFile
  const sheetMatches = [
    ...wbXml.matchAll(/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g),
  ];
  const sheetNameToXml: { [name: string]: string } = {};
  sheetMatches.forEach((m) => {
    const target = rIdToSheetFile[m[2]];
    if (target) {
      sheetNameToXml[m[1]] = target.startsWith("worksheets/")
        ? target
        : `worksheets/${target}`;
    }
  });

  const results: ExtractedExcelImage[] = [];

  // 3. 各シートの drawing リレーションを辿り、アンカー情報を抽出
  for (const [sheetName, sheetXmlPath] of Object.entries(sheetNameToXml)) {
    const sheetRelsPath = `xl/worksheets/_rels/${path.basename(
      sheetXmlPath
    )}.rels`;
    const sheetRelsXml = await zip.files[sheetRelsPath]?.async("text");
    if (!sheetRelsXml) continue;

    // drawingX.xml のターゲットを取得
    const drawingRelMatch = sheetRelsXml.match(
      /<Relationship[^>]*Type="[^"]*\/drawing"[^>]*Target="([^"]+)"/
    );
    if (!drawingRelMatch) continue;

    const drawingTarget = drawingRelMatch[1].replace(/^\.\.\//, "");
    const drawingXmlPath = `xl/${drawingTarget}`;
    const drawingRelsPath = `xl/drawings/_rels/${path.basename(
      drawingTarget
    )}.rels`;

    const drawingXml = await zip.files[drawingXmlPath]?.async("text");
    const drawingRelsXml = await zip.files[drawingRelsPath]?.async("text");
    if (!drawingXml || !drawingRelsXml) continue;

    // drawingリレーション: rId -> ../media/imageX.jpeg
    const drawRIdToMedia: { [rId: string]: string } = {};
    for (const m of drawingRelsXml.matchAll(
      /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g
    )) {
      const mediaTarget = m[2].replace(/^\.\.\//, "xl/");
      drawRIdToMedia[m[1]] = mediaTarget;
    }

    // アンカー解析 (twoCellAnchor & oneCellAnchor)
    const anchorRegex =
      /<xdr:(twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/xdr:\1>/g;
    for (const anchorMatch of drawingXml.matchAll(anchorRegex)) {
      const body = anchorMatch[2];

      const fromCol = Number(
        body.match(/<xdr:from>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>/)?.[1] || 0
      );
      const fromRow = Number(
        body.match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/)?.[1] || 0
      );
      const toColStr = body.match(
        /<xdr:to>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>/
      )?.[1];
      const toRowStr = body.match(
        /<xdr:to>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/
      )?.[1];

      const embedId = body.match(/<a:blip[^>]*r:embed="([^"]+)"/)?.[1];
      if (!embedId) continue;

      const mediaPath = drawRIdToMedia[embedId];
      if (!mediaPath || !mediaMap[mediaPath]) continue;

      const media = mediaMap[mediaPath];
      const anchorStr = `${colToLetter(fromCol)}${fromRow + 1}${
        toColStr ? `:${colToLetter(Number(toColStr))}${Number(toRowStr) + 1}` : ""
      }`;

      // 4. キャラクター・日替わり・LOOK・シーン番号の推測
      // A) シーン番号推定（シート名が "S1", "S20" 等の場合）
      let estSceneNum: string | null = null;
      if (/^S\s*\d+/i.test(sheetName)) {
        estSceneNum = normalizeSceneNumber(sheetName);
      }

      // B) キャラクター推定
      // パターン1: シート名がキャラクター名（例: "桃華", "修平"）
      let estChar: Character | null = null;
      const sheetCharMatch = matchCharacter(sheetName, existingData.characters);
      if (sheetCharMatch.matchedChar) {
        estChar = sheetCharMatch.matchedChar;
      }

      // C) 重複チェック (既存DBの同一ハッシュ写真)
      const duplicatePhoto = (existingData.photos || []).find(
        (p) => p.hash === media.hash
      );
      const duplicateLook = duplicatePhoto?.costumeLookId
        ? existingData.costumeLooks.find((l) => l.id === duplicatePhoto.costumeLookId)
        : null;

      // D) カテゴリ初期推定（アンカー位置や名称から判定）
      let estCategory: CostumePhoto["category"] = "unclassified";
      if (/小道具/i.test(anchorStr)) estCategory = "prop";
      else if (/持道具/i.test(anchorStr)) estCategory = "accessory";
      else if (/メイク|髪型/i.test(anchorStr)) estCategory = "makeup";
      else estCategory = "full_body"; // デフォルトは全身・衣装写真

      // E) 該当キャラクターの日替わり・LOOK推定
      let estDay: CostumeDay | null = null;
      let estLook: CostumeLook | null = null;

      if (estChar) {
        const charDays = existingData.costumeDays.filter(
          (d) => d.characterId === estChar!.id
        );
        const charLooks = existingData.costumeLooks.filter(
          (l) => l.characterId === estChar!.id
        );

        if (charDays.length > 0) estDay = charDays[0];
        if (estDay?.costumeLookId) {
          estLook =
            charLooks.find((l) => l.id === estDay!.costumeLookId) || null;
        } else if (charLooks.length > 0) {
          estLook = charLooks[0];
        }
      }

      // 「画像インポート = LOOK即時作成」
      // 重複画像でなければデフォルトで create_new_look
      const initialAction = duplicatePhoto ? "ignore" : "create_new_look";

      results.push({
        id: `EXCEL_IMG_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}`,
        hash: media.hash,
        mediaPath,
        fileName: path.basename(mediaPath),
        mimeType: media.mimeType,
        dataBase64: media.base64,
        sheetName,
        anchor: {
          fromCol,
          fromRow,
          toCol: toColStr ? Number(toColStr) : undefined,
          toRow: toRowStr ? Number(toRowStr) : undefined,
          anchorStr,
        },
        estimatedSceneNumber: estSceneNum,
        estimatedCharacterId: estChar?.id || "UNCLASSIFIED",
        estimatedCharacterName: estChar?.name || "未分類",
        estimatedCostumeDayId: estDay?.id || null,
        estimatedLookId: estLook?.id || null,
        estimatedCategory: estCategory,
        isDuplicateOfId: duplicatePhoto?.id || null,
        duplicateLookCode: duplicateLook?.lookCode || null,
        selectedAction: initialAction,
        selectedCharacterId: estChar?.id || "UNCLASSIFIED",
        selectedCharacterTag: estChar?.name || "未分類",
        selectedCostumeDayId: estDay?.id || null,
        selectedLookId: null, // 新規作成時は新規LOOKが生成される
        targetLookTitle: "",
        selectedCategory: estCategory,
        makeMainForLook: true,
      });
    }
  }

  return results;
}
