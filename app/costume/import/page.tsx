"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";
import {
  Character,
  CostumeDay,
  CostumeLook,
  Scene,
  SceneAppearance,
  ShootingDay,
  ScheduleEntry,
  CostumePhoto,
} from "../types";
import { normalizeSceneNumber, matchCharacter, matchLook } from "../lib/excel-matcher";
import { ExtractedExcelImage } from "../lib/excel-image-extractor";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  Camera,
  Shirt,
  Maximize2,
  Trash2,
  Filter,
} from "lucide-react";

type ImportType = "scene_costume" | "excel_images" | "overall_continuity" | "daily_schedule";

interface ParsedSceneCostumeRow {
  sheetName: string;
  sceneRaw: string;
  sceneClean: string;
  characterRaw: string;
  characterMatchedId: string | null;
  characterCandidates: Character[];
  dayNumberRaw?: string | number | null;
  dayMatchedId: string | null;
  lookRaw?: string | null;
  lookMatchedId: string | null;
  lookCandidates: CostumeLook[];
  costumeCandidateText?: string;
  variation?: string;
  propsText?: string;
  makeup?: string;
  remarks?: string;
  existingAssignment: SceneAppearance | null;
  hasManualOverride: boolean;
  diffStatus: "new" | "exact_match" | "has_diff" | "warning_unmatched";
  selectedAction: "overwrite" | "keep_existing" | "create_new" | "ignore";
}

export default function ImportPage() {
  const [data, setData] = useState<{
    characters: Character[];
    costumeDays: CostumeDay[];
    costumeLooks: CostumeLook[];
    scenes: Scene[];
    assignments: SceneAppearance[];
    shootingDays: ShootingDay[];
    scheduleEntries: ScheduleEntry[];
    photos?: CostumePhoto[];
  } | null>(null);

  const [importType, setImportType] = useState<ImportType>("excel_images");
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheetMode, setSelectedSheetMode] = useState<"all" | "single">("all");
  const [selectedSingleSheet, setSelectedSingleSheet] = useState<string>("");

  // シーン別衣装香盤の解析結果リスト
  const [parsedRows, setParsedRows] = useState<ParsedSceneCostumeRow[]>([]);

  // Excel埋め込み画像の抽出結果リスト
  const [extractedImages, setExtractedImages] = useState<ExtractedExcelImage[]>([]);
  const [selectedImageCategoryFilter, setSelectedImageCategoryFilter] = useState<string>("ALL");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const [statusResult, setStatusResult] = useState<{
    title: string;
    success: number;
    updated: number;
    skipped: number;
    warnings: number;
  } | null>(null);

  // 1. 既存データのロード
  const loadDatabase = () => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.error("Failed to load db in import:", err));
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // 2. ファイル選択ハンドラ
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatusResult(null);
    setParsedRows([]);
    setExtractedImages([]);

    // A) Excel埋め込み画像の抽出処理 (Server API)
    if (selected.name.endsWith(".xlsx")) {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("file", selected);

      try {
        const imgRes = await fetch("/costume/api/extract-images", {
          method: "POST",
          body: formData,
        });
        const imgData = await imgRes.json();
        if (imgData.images) {
          setExtractedImages(imgData.images);
          if (imgData.images.length > 0 && importType !== "scene_costume") {
            setImportType("excel_images");
          }
        }
      } catch (err) {
        console.error("Failed to extract images:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }

    // B) 通常のワークブック読み込み（SheetJS）
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        if (wb.SheetNames.length > 0) {
          setSelectedSingleSheet(wb.SheetNames[0]);
        }
        if (importType === "scene_costume") {
          analyzeSceneCostumeExcel(wb, "all", wb.SheetNames[0]);
        }
      } catch (err) {
        console.error("Excel parse error:", err);
      }
    };
    reader.readAsBinaryString(selected);
  };

  // 【シーン別衣装香盤】の解析
  const analyzeSceneCostumeExcel = (
    wb: XLSX.WorkBook,
    sheetMode: "all" | "single",
    singleSheet: string
  ) => {
    if (!data) return;
    setIsAnalyzing(true);

    const targetSheets =
      sheetMode === "single"
        ? [singleSheet]
        : wb.SheetNames.filter((s) => !/^(目次|メモ|説明|template)/i.test(s));

    const rows: ParsedSceneCostumeRow[] = [];

    targetSheets.forEach((sheetName) => {
      const ws = wb.Sheets[sheetName];
      if (!ws) return;

      const rawGrid: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rawGrid.length === 0) return;

      let detectedSceneRaw = sheetName;
      let sceneClean = normalizeSceneNumber(sheetName);

      for (let r = 0; r < Math.min(rawGrid.length, 5); r++) {
        const firstCell = String(rawGrid[r]?.[0] || "");
        if (/S\s*\d+/i.test(firstCell)) {
          const m = firstCell.match(/S\s*(\d+[A-Za-z0-9\-_]*)/i);
          if (m) {
            detectedSceneRaw = m[0];
            sceneClean = normalizeSceneNumber(m[1]);
          }
        }
      }

      let sheetDayNum: any = null;
      rawGrid.forEach((r) => {
        const label = String(r?.[0] || "").trim();
        if (/日替わり/i.test(label) && r[1] !== undefined) {
          sheetDayNum = r[1];
        }
      });

      let charRowIdx = -1;
      let costumeRowIdx = -1;
      let propsRowIdx = -1;
      let makeupRowIdx = -1;
      let remarksRowIdx = -1;
      let sourceRowIdx = -1;

      rawGrid.forEach((row, idx) => {
        const header = String(row?.[0] || "").trim();
        if (/キャラクター|役名|人物/i.test(header)) charRowIdx = idx;
        if (/衣装・装身具|衣装候補|衣装/i.test(header)) costumeRowIdx = idx;
        if (/小道具|持道具/i.test(header)) propsRowIdx = idx;
        if (/メイク|髪型/i.test(header)) makeupRowIdx = idx;
        if (/備考|特記事項/i.test(header)) remarksRowIdx = idx;
        if (/引継ぎ元|元衣装|第9稿/i.test(header)) sourceRowIdx = idx;
      });

      if (charRowIdx !== -1) {
        const charRow = rawGrid[charRowIdx];
        for (let col = 1; col < charRow.length; col++) {
          const charNameRaw = String(charRow[col] || "").trim();
          if (!charNameRaw || /写真貼付|未設定|なし/i.test(charNameRaw)) continue;

          const costumeCandidateText = costumeRowIdx !== -1 ? String(rawGrid[costumeRowIdx]?.[col] || "").trim() : "";
          const propsText = propsRowIdx !== -1 ? String(rawGrid[propsRowIdx]?.[col] || "").trim() : "";
          const makeupText = makeupRowIdx !== -1 ? String(rawGrid[makeupRowIdx]?.[col] || "").trim() : "";
          const remarksText = remarksRowIdx !== -1 ? String(rawGrid[remarksRowIdx]?.[col] || "").trim() : "";
          const sourceText = sourceRowIdx !== -1 ? String(rawGrid[sourceRowIdx]?.[col] || "").trim() : "";

          const { matchedChar, candidates } = matchCharacter(charNameRaw, data.characters);
          const charId = matchedChar?.id || null;

          let dayMatchedId: string | null = null;
          if (charId && sheetDayNum) {
            const num = parseInt(String(sheetDayNum), 10);
            const foundDay = data.costumeDays.find(
              (d) => d.characterId === charId && d.dayNumber === num
            );
            if (foundDay) dayMatchedId = foundDay.id;
          }

          const charLooks = data.costumeLooks.filter((l) => l.characterId === charId);
          const lookSearchText = sourceText || costumeCandidateText;
          const { matchedLook, candidates: lookCandidates } = matchLook(lookSearchText, charLooks);

          const matchedScene = data.scenes.find(
            (s) => s.sceneNumber === sceneClean || s.id === `S${sceneClean}`
          );

          let existingAsg: SceneAppearance | null = null;
          if (matchedScene && charId) {
            existingAsg =
              data.assignments.find(
                (a) => a.sceneId === matchedScene.id && a.characterId === charId
              ) || null;
          }

          const hasManual = Boolean(existingAsg?.manualOverride);

          let diffStatus: "new" | "exact_match" | "has_diff" | "warning_unmatched" = "new";
          let defaultAction: "overwrite" | "keep_existing" | "create_new" | "ignore" = "create_new";

          if (!matchedChar) {
            diffStatus = "warning_unmatched";
            defaultAction = "ignore";
          } else if (existingAsg) {
            const isSameProps = (existingAsg.propsText || "") === (propsText || "");
            const isSameRemarks = (existingAsg.notes || "") === (remarksText || "");
            if (isSameProps && isSameRemarks) {
              diffStatus = "exact_match";
              defaultAction = "keep_existing";
            } else {
              diffStatus = "has_diff";
              defaultAction = hasManual ? "keep_existing" : "overwrite";
            }
          }

          rows.push({
            sheetName,
            sceneRaw: detectedSceneRaw,
            sceneClean,
            characterRaw: charNameRaw,
            characterMatchedId: charId,
            characterCandidates: candidates,
            dayNumberRaw: sheetDayNum,
            dayMatchedId,
            lookRaw: lookSearchText || null,
            lookMatchedId: matchedLook?.id || null,
            lookCandidates,
            costumeCandidateText,
            propsText,
            makeup: makeupText,
            remarks: remarksText,
            existingAssignment: existingAsg,
            hasManualOverride: hasManual,
            diffStatus,
            selectedAction: defaultAction,
          });
        }
      }
    });

    setParsedRows(rows);
    setIsAnalyzing(false);
  };

  // 3. 画像のインポート保存処理
  const handleExecuteImageImport = async () => {
    if (extractedImages.length === 0) return;
    setIsImporting(true);

    try {
      const targetImages = extractedImages.filter(
        (img) => img.selectedAction !== "ignore"
      );

      const payload = {
        images: targetImages.map((img) => ({
          dataBase64: img.dataBase64,
          fileName: img.fileName,
          mimeType: img.mimeType,
          hash: img.hash,
          characterId: img.selectedCharacterId || null,
          costumeLookId: img.selectedLookId || null,
          costumeDayId: img.selectedCostumeDayId || null,
          category: img.selectedCategory,
          makeMainForLook: Boolean(img.makeMainForLook),
          sourceFile: file?.name || "Excel",
          sourceSheet: img.sheetName,
          sourceAnchor: img.anchor.anchorStr,
        })),
      };

      const res = await fetch("/costume/api/save-excel-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setStatusResult({
          title: "Excel画像のインポートが正常に完了しました！",
          success: resData.savedCount,
          updated: 0,
          skipped: resData.skippedCount,
          warnings: 0,
        });
        loadDatabase();
      } else {
        alert("画像保存に失敗しました: " + resData.error);
      }
    } catch (e: any) {
      console.error("Save image error:", e);
      alert("画像のインポートに失敗しました。");
    } finally {
      setIsImporting(false);
    }
  };

  // 4. シーン別衣装香盤テキストのインポート保存
  const handleExecuteSceneCostumeImport = async () => {
    if (!data || parsedRows.length === 0) return;
    setIsImporting(true);

    try {
      let scenes = [...data.scenes];
      let assignments = [...data.assignments];
      const nowIso = new Date().toISOString();
      let successCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      parsedRows.forEach((row) => {
        if (row.selectedAction === "ignore" || !row.characterMatchedId) {
          skippedCount++;
          return;
        }

        let targetScene = scenes.find(
          (s) => s.sceneNumber === row.sceneClean || s.id === `S${row.sceneClean}`
        );
        if (!targetScene) {
          const num = parseInt(row.sceneClean, 10) || scenes.length + 1;
          targetScene = {
            id: `S${row.sceneClean}`,
            sceneNumber: row.sceneClean,
            sortOrder: num * 10,
            summary: "",
          };
          scenes.push(targetScene);
        }

        const char = data.characters.find((c) => c.id === row.characterMatchedId);
        const charName = char ? char.name : row.characterRaw;

        const existingIdx = assignments.findIndex(
          (a) =>
            a.sceneId === targetScene!.id && a.characterId === row.characterMatchedId
        );

        if (existingIdx !== -1) {
          if (row.selectedAction === "keep_existing") {
            skippedCount++;
            return;
          }
          const old = assignments[existingIdx];
          assignments[existingIdx] = {
            ...old,
            costumeDayId: row.dayMatchedId || old.costumeDayId,
            costumeLookId: row.lookMatchedId || old.costumeLookId,
            costumeCandidate: row.costumeCandidateText || old.costumeCandidate,
            propsText: row.propsText || old.propsText,
            makeup: row.makeup || old.makeup,
            notes: row.remarks || old.notes,
            importSource: `${file?.name || "Excel"} - ${row.sheetName}`,
            importedAt: nowIso,
          };
          updatedCount++;
        } else {
          const newAsg: SceneAppearance = {
            id: `ASG_${targetScene.id}_${row.characterMatchedId}_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 6)}`,
            sceneId: targetScene.id,
            characterId: row.characterMatchedId,
            characterName: charName,
            costumeDayId: row.dayMatchedId || null,
            costumeLookId: row.lookMatchedId || null,
            costumeCandidate: row.costumeCandidateText || null,
            propsText: row.propsText || null,
            makeup: row.makeup || null,
            notes: row.remarks || null,
            manualOverride: false,
            importSource: `${file?.name || "Excel"} - ${row.sheetName}`,
            importedAt: nowIso,
            sortOrder: assignments.filter((a) => a.sceneId === targetScene!.id).length + 1,
          };
          assignments.push(newAsg);
          successCount++;
        }
      });

      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          scenes,
          assignments,
        }),
      });

      setStatusResult({
        title: "シーン別衣装香盤のインポートが完了しました！",
        success: successCount,
        updated: updatedCount,
        skipped: skippedCount,
        warnings: 0,
      });
      loadDatabase();
    } catch (e) {
      console.error("Save error:", e);
      alert("インポート結果の保存に失敗しました。");
    } finally {
      setIsImporting(false);
    }
  };

  // フィルタリング（抽出画像カテゴリ）
  const filteredExtractedImages = extractedImages.filter((img) => {
    if (selectedImageCategoryFilter === "ALL") return true;
    return img.selectedCategory === selectedImageCategoryFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 画面トップバー */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            IMPORT（Excelファイル・埋め込み画像取り込み）
          </h1>
        </div>

        {/* 4種類のインポート種別タブ */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800">
          <button
            onClick={() => setImportType("excel_images")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              importType === "excel_images"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Excel埋め込み画像抽出 ({extractedImages.length} 枚検出)</span>
          </button>
          <button
            onClick={() => {
              setImportType("scene_costume");
              if (workbook) analyzeSceneCostumeExcel(workbook, "all", selectedSingleSheet);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "scene_costume"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            シーン別衣装香盤 (各シーン×各人物のテキスト・小道具)
          </button>
          <button
            onClick={() => setImportType("overall_continuity")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "overall_continuity"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            通し香盤 (シーン番号・場所・劇中日)
          </button>
          <button
            onClick={() => setImportType("daily_schedule")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "daily_schedule"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            日々スケ (撮影日・撮影順・時刻)
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {importType === "excel_images" && (
            <span>
              .xlsx内部のZIP構造（xl/media, xl/drawings）を直接解析し、貼り付けられた衣装写真・小道具写真をセル配置アンカーとシート名から自動推定します。重複画像はSHA-256ハッシュで自動検知され、安全に取り込めます。
            </span>
          )}
          {importType === "scene_costume" && (
            <span>各シーンシート（S1, S2, S3...）から、登場人物・衣装・小道具・持道具・メイク・備考を抽出します。</span>
          )}
        </p>
      </div>

      {/* ファイルアップロードドロップゾーン */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md space-y-4 text-center">
        <label className="block cursor-pointer border-2 border-dashed border-zinc-700 hover:border-amber-400 p-8 rounded-md transition-colors bg-zinc-950">
          <UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-zinc-200 block">
            {file ? file.name : "Excelファイルを選択またはドラッグ＆ドロップ (.xlsx 優先)"}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">
            即時上書きは行われません。画像・テキストともにプレビューで確認・修正してから反映します。
          </span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* 解析中インジケータ */}
      {isAnalyzing && (
        <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-md text-amber-400 text-xs font-mono animate-pulse flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Excel内の画像バイナリとDrawingアンカーを解析しています...</span>
        </div>
      )}

      {/* 【モード1】Excel埋め込み画像プレビュー & 紐付けエディタ */}
      {importType === "excel_images" && !isAnalyzing && extractedImages.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>抽出された埋め込み写真プレビュー</span>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-amber-400">
                  全 {extractedImages.length} 枚
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1">
                シート名とセル配置（アンカー位置）から紐付け先を初期推定しています。必要に応じてキャラクターやLOOKを変更してください。
              </p>
            </div>

            {/* 一括操作 & カテゴリ絞り込み */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">絞り込み:</span>
              <select
                value={selectedImageCategoryFilter}
                onChange={(e) => setSelectedImageCategoryFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded text-xs px-2 py-1 text-zinc-200"
              >
                <option value="ALL">全カテゴリ</option>
                <option value="full_body">全身</option>
                <option value="upper_body">上半身</option>
                <option value="shoes">靴</option>
                <option value="accessory">持道具/アクセ</option>
                <option value="prop">小道具</option>
                <option value="makeup">メイク</option>
                <option value="unclassified">未分類</option>
              </select>

              <button
                onClick={() => {
                  const next = extractedImages.map((img) => ({
                    ...img,
                    selectedAction: "import_to_look" as const,
                  }));
                  setExtractedImages(next);
                }}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded"
              >
                すべてLOOKへ紐付け
              </button>
            </div>
          </div>

          {/* 画像カードグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredExtractedImages.map((img, idx) => {
              const charLooks = data?.costumeLooks.filter(
                (l) => l.characterId === img.selectedCharacterId
              ) || [];

              return (
                <div
                  key={img.id}
                  className={`bg-zinc-950 border rounded-md p-3 space-y-2.5 flex flex-col justify-between transition-colors ${
                    img.isDuplicateOfId
                      ? "border-zinc-800 opacity-60"
                      : img.selectedAction === "ignore"
                      ? "border-zinc-800 opacity-40"
                      : "border-zinc-700 hover:border-amber-400/50"
                  }`}
                >
                  {/* サムネイル (2:3 縦長サムネイル contain) */}
                  <div className="costume-thumb-container border border-zinc-800 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataBase64}
                      alt={img.fileName}
                      className="costume-thumb-img"
                    />
                    <button
                      onClick={() => setLightboxUrl(img.dataBase64)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black rounded text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="拡大表示"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* 重複バッジ */}
                    {img.isDuplicateOfId && (
                      <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-mono border border-zinc-700">
                        既存重複 (登録済)
                      </span>
                    )}
                  </div>

                  {/* Excel由来情報 (シート / セルアンカー) */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-1 font-mono">
                      <span className="truncate text-amber-400 font-bold">
                        {img.sheetName}
                      </span>
                      <span>セル: {img.anchor.anchorStr}</span>
                    </div>

                    {/* キャラクター選択 */}
                    <div className="space-y-0.5">
                      <label className="text-[10px] text-zinc-500 font-mono block">
                        対象人物:
                      </label>
                      <select
                        value={img.selectedCharacterId || ""}
                        onChange={(e) => {
                          const next = [...extractedImages];
                          next[idx].selectedCharacterId = e.target.value || null;
                          // LOOKも再設定
                          const firstLook = data?.costumeLooks.find(
                            (l) => l.characterId === e.target.value
                          );
                          next[idx].selectedLookId = firstLook ? firstLook.id : null;
                          setExtractedImages(next);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                      >
                        <option value="">(未分類 / 指定なし)</option>
                        {data?.characters.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* LOOK選択 */}
                    {img.selectedCharacterId && (
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-zinc-500 font-mono block">
                          紐付け先LOOK:
                        </label>
                        <select
                          value={img.selectedLookId || ""}
                          onChange={(e) => {
                            const next = [...extractedImages];
                            next[idx].selectedLookId = e.target.value || null;
                            setExtractedImages(next);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value="">(未設定 - LOOKなし)</option>
                          {charLooks.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.lookCode} : {l.title || "名称未定"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* 写真カテゴリ */}
                    <div className="space-y-0.5">
                      <label className="text-[10px] text-zinc-500 font-mono block">
                        カテゴリ:
                      </label>
                      <select
                        value={img.selectedCategory}
                        onChange={(e) => {
                          const next = [...extractedImages];
                          next[idx].selectedCategory = e.target.value as any;
                          setExtractedImages(next);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-1 text-xs text-zinc-300"
                      >
                        <option value="full_body">全身</option>
                        <option value="upper_body">上半身</option>
                        <option value="shoes">靴・履物</option>
                        <option value="accessory">持道具 / アクセ</option>
                        <option value="prop">小道具</option>
                        <option value="makeup">メイク / 髪型</option>
                        <option value="unclassified">未分類</option>
                      </select>
                    </div>

                    {/* 代表写真フラグ */}
                    {img.selectedLookId && (
                      <label className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(img.makeMainForLook)}
                          onChange={(e) => {
                            const next = [...extractedImages];
                            next[idx].makeMainForLook = e.target.checked;
                            setExtractedImages(next);
                          }}
                        />
                        <span>LOOKの代表写真に設定</span>
                      </label>
                    )}

                    {/* 取り込みアクション */}
                    <div className="pt-1">
                      <select
                        value={img.selectedAction}
                        onChange={(e) => {
                          const next = [...extractedImages];
                          next[idx].selectedAction = e.target.value as any;
                          setExtractedImages(next);
                        }}
                        className={`w-full text-xs font-bold rounded px-2 py-1 border ${
                          img.selectedAction === "import_to_look"
                            ? "bg-amber-400 text-black border-amber-300"
                            : img.selectedAction === "import_unclassified"
                            ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                            : "bg-zinc-900 text-zinc-500 border-zinc-800"
                        }`}
                      >
                        <option value="import_to_look">LOOK写真として取込</option>
                        <option value="import_unclassified">未分類写真として取込</option>
                        <option value="ignore">除外（取り込まない）</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 取り込み確定ボタン */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
            <div className="text-xs text-zinc-400 space-x-3 font-mono">
              <span>
                取込予定:{" "}
                {extractedImages.filter((i) => i.selectedAction !== "ignore").length}{" "}
                枚
              </span>
              <span>
                除外:{" "}
                {extractedImages.filter((i) => i.selectedAction === "ignore").length}{" "}
                枚
              </span>
            </div>

            <button
              disabled={isImporting || extractedImages.length === 0}
              onClick={handleExecuteImageImport}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2.5 rounded transition-all active:scale-95 disabled:opacity-40 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>{isImporting ? "アップロード・保存中..." : "抽出画像をVercel Blobへ取り込む"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 【モード2】シーン別衣装香盤のプレビュー */}
      {importType === "scene_costume" && !isAnalyzing && parsedRows.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>解析・照合結果プレビュー</span>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-amber-400">
                  全 {parsedRows.length} 件
                </span>
              </h2>
            </div>
          </div>

          {/* 照合テーブル */}
          <div className="overflow-x-auto border border-zinc-800 rounded bg-zinc-950 max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono z-10">
                <tr>
                  <th className="p-2 w-16">シーン</th>
                  <th className="p-2 w-32">Excel人物</th>
                  <th className="p-2 w-36">照合人物</th>
                  <th className="p-2 w-28">日替わり</th>
                  <th className="p-2 w-44">衣装候補</th>
                  <th className="p-2">持道具 / 小道具</th>
                  <th className="p-2 w-28">備考</th>
                  <th className="p-2 w-28">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/60">
                    <td className="p-2 font-mono font-bold text-amber-400">
                      S{row.sceneClean}
                    </td>
                    <td className="p-2 font-mono">{row.characterRaw}</td>
                    <td className="p-2 font-bold">
                      {
                        data?.characters.find((c) => c.id === row.characterMatchedId)
                          ?.name || "-"
                      }
                    </td>
                    <td className="p-2 font-mono">
                      {row.dayNumberRaw ? `日替わり${row.dayNumberRaw}` : "-"}
                    </td>
                    <td className="p-2 truncate max-w-xs">
                      {row.costumeCandidateText || "-"}
                    </td>
                    <td className="p-2 truncate max-w-xs">{row.propsText || "-"}</td>
                    <td className="p-2 text-zinc-400">{row.remarks || "-"}</td>
                    <td className="p-2">
                      <select
                        value={row.selectedAction}
                        onChange={(e) => {
                          const next = [...parsedRows];
                          next[idx].selectedAction = e.target.value as any;
                          setParsedRows(next);
                        }}
                        className="bg-zinc-900 border border-zinc-700 text-xs rounded px-1.5 py-0.5"
                      >
                        <option value="create_new">新規作成</option>
                        <option value="overwrite">上書き</option>
                        <option value="keep_existing">既存維持</option>
                        <option value="ignore">除外</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={isImporting}
              onClick={handleExecuteSceneCostumeImport}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2.5 rounded transition-all active:scale-95 shadow-lg"
            >
              <span>{isImporting ? "インポート中..." : "テキスト情報を確定して反映"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 完了結果メッセージ */}
      {statusResult && (
        <div className="p-4 rounded-md bg-zinc-900 border border-emerald-500/40 text-zinc-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{statusResult.title}</span>
          </div>
          <p className="font-mono text-zinc-400">
            保存成功: {statusResult.success} 件 / スキップ（重複または除外）:{" "}
            {statusResult.skipped} 件
          </p>
          <p className="text-[11px] text-zinc-500 pt-1">
            CHARACTER、SCENE、SCHEDULE、および印刷用PDFに即時反映されています。
          </p>
        </div>
      )}

      {/* 拡大写真モーダル (LightBox) */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="拡大写真"
              className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
