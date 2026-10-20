"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Character,
  CostumeDay,
  CostumeLook,
  Scene,
  SceneAppearance,
  ShootingDay,
  ScheduleEntry,
} from "../types";
import { normalizeSceneNumber, matchCharacter, matchLook } from "../lib/excel-matcher";
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
} from "lucide-react";

type ImportType = "scene_costume" | "overall_continuity" | "daily_schedule";

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
  // 既存データとの差分検知
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
  } | null>(null);

  const [importType, setImportType] = useState<ImportType>("scene_costume");
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheetMode, setSelectedSheetMode] = useState<"all" | "single">("all");
  const [selectedSingleSheet, setSelectedSingleSheet] = useState<string>("");

  // シーン別衣装香盤の解析結果リスト
  const [parsedRows, setParsedRows] = useState<ParsedSceneCostumeRow[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusResult, setStatusResult] = useState<{
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatusResult(null);
    setParsedRows([]);

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
        // 解析実行
        analyzeWorkbook(wb, importType, "all", wb.SheetNames[0]);
      } catch (err) {
        console.error("Excel parse error:", err);
        alert("Excelファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsBinaryString(selected);
  };

  // 3. ワークブックの解析（通し香盤 / シーン別衣装香盤 / 日々スケ）
  const analyzeWorkbook = (
    wb: XLSX.WorkBook,
    type: ImportType,
    sheetMode: "all" | "single",
    singleSheet: string
  ) => {
    if (!data) return;
    setIsAnalyzing(true);

    try {
      if (type === "scene_costume") {
        analyzeSceneCostumeExcel(wb, sheetMode, singleSheet);
      } else {
        // 通し香盤・日々スケ用
        setParsedRows([]);
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 【シーン別衣装香盤】の高度解析（横持ち・縦持ち両対応、照合、差分検知）
  const analyzeSceneCostumeExcel = (
    wb: XLSX.WorkBook,
    sheetMode: "all" | "single",
    singleSheet: string
  ) => {
    if (!data) return;

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

      // シーン番号の特定（シート名が "S1", "S14、14A" の場合、またはセル内の「S1 衣装香盤」から特定）
      let detectedSceneRaw = sheetName;
      let sceneClean = normalizeSceneNumber(sheetName);

      // セル内からより正確なシーンタイトルを探す
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

      // 共通メタデータ探索（日替わり番号、劇中日など）
      let sheetDayNum: any = null;
      rawGrid.forEach((r) => {
        const label = String(r?.[0] || "").trim();
        if (/日替わり/i.test(label) && r[1] !== undefined) {
          sheetDayNum = r[1];
        }
      });

      // 行ラベルをマッピング（横持ち形式: 列方向にキャラクターが並ぶパターン）
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

      // パターンA: 横持ち（7行目にキャラクターが横に並ぶ形式）
      if (charRowIdx !== -1) {
        const charRow = rawGrid[charRowIdx];
        for (let col = 1; col < charRow.length; col++) {
          const charNameRaw = String(charRow[col] || "").trim();
          if (!charNameRaw || /写真貼付|未設定|なし/i.test(charNameRaw)) continue;

          // 項目抽出
          const costumeCandidateText = costumeRowIdx !== -1 ? String(rawGrid[costumeRowIdx]?.[col] || "").trim() : "";
          const propsText = propsRowIdx !== -1 ? String(rawGrid[propsRowIdx]?.[col] || "").trim() : "";
          const makeupText = makeupRowIdx !== -1 ? String(rawGrid[makeupRowIdx]?.[col] || "").trim() : "";
          const remarksText = remarksRowIdx !== -1 ? String(rawGrid[remarksRowIdx]?.[col] || "").trim() : "";
          const sourceText = sourceRowIdx !== -1 ? String(rawGrid[sourceRowIdx]?.[col] || "").trim() : "";

          // 1. キャラクター照合
          const { matchedChar, candidates } = matchCharacter(charNameRaw, data.characters);
          const charId = matchedChar?.id || null;

          // 2. 該当キャラクターの日替わり照合
          let dayMatchedId: string | null = null;
          if (charId && sheetDayNum) {
            const num = parseInt(String(sheetDayNum), 10);
            const foundDay = data.costumeDays.find(
              (d) => d.characterId === charId && d.dayNumber === num
            );
            if (foundDay) dayMatchedId = foundDay.id;
          }

          // 3. LOOK照合
          const charLooks = data.costumeLooks.filter((l) => l.characterId === charId);
          const lookSearchText = sourceText || costumeCandidateText;
          const { matchedLook, candidates: lookCandidates } = matchLook(lookSearchText, charLooks);

          // 4. 既存 SceneCharacterAssignment との照合・差分検知
          // シーン特定
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

          // 差分ステータス判定
          let diffStatus: "new" | "exact_match" | "has_diff" | "warning_unmatched" = "new";
          let defaultAction: "overwrite" | "keep_existing" | "create_new" | "ignore" = "create_new";

          if (!matchedChar) {
            diffStatus = "warning_unmatched";
            defaultAction = "ignore";
          } else if (existingAsg) {
            // 既存データが存在する場合
            const isSameProps = (existingAsg.propsText || "") === (propsText || "");
            const isSameRemarks = (existingAsg.notes || "") === (remarksText || "");
            if (isSameProps && isSameRemarks) {
              diffStatus = "exact_match";
              defaultAction = "keep_existing";
            } else {
              diffStatus = "has_diff";
              // 手動編集済みの場合は維持をデフォルト推奨
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
  };

  // 4. キャラクター手動再紐付け
  const handleUpdateCharMapping = (rowIdx: number, newCharId: string) => {
    if (!data) return;
    const next = [...parsedRows];
    const target = next[rowIdx];
    target.characterMatchedId = newCharId;

    // 日替わり・LOOKも再計算
    const matched = data.characters.find((c) => c.id === newCharId);
    if (matched) {
      if (target.dayNumberRaw) {
        const num = parseInt(String(target.dayNumberRaw), 10);
        const day = data.costumeDays.find(
          (d) => d.characterId === newCharId && d.dayNumber === num
        );
        target.dayMatchedId = day ? day.id : null;
      }
      const charLooks = data.costumeLooks.filter((l) => l.characterId === newCharId);
      const { matchedLook } = matchLook(target.lookRaw || "", charLooks);
      target.lookMatchedId = matchedLook ? matchedLook.id : null;
      target.diffStatus = "has_diff";
      target.selectedAction = "overwrite";
    }
    setParsedRows(next);
  };

  // 5. アクション一括変更（差分のみ上書き / 全て既存維持 / 新規のみ追加など）
  const handleBulkAction = (action: "overwrite" | "keep_existing") => {
    const next = parsedRows.map((r) => {
      if (r.hasManualOverride && action === "overwrite") {
        return r; // 手動編集済みは保護
      }
      return { ...r, selectedAction: action };
    });
    setParsedRows(next);
  };

  // 6. インポート実行・保存
  const handleExecuteImport = async () => {
    if (!data || parsedRows.length === 0) return;
    setIsImporting(true);

    try {
      let scenes = [...data.scenes];
      let assignments = [...data.assignments];
      let costumeDays = [...data.costumeDays];
      let costumeLooks = [...data.costumeLooks];

      let successCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      let warningCount = 0;

      const nowIso = new Date().toISOString();

      parsedRows.forEach((row) => {
        if (row.selectedAction === "ignore" || !row.characterMatchedId) {
          skippedCount++;
          return;
        }

        // シーン取得または作成
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

        // 既存アサインメントの確認
        const existingIdx = assignments.findIndex(
          (a) =>
            a.sceneId === targetScene!.id && a.characterId === row.characterMatchedId
        );

        if (existingIdx !== -1) {
          if (row.selectedAction === "keep_existing") {
            skippedCount++;
            return;
          }

          // 上書き
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
          // 新規追加
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

      // サーバーへ永続保存
      const payload = {
        ...data,
        scenes,
        assignments,
        costumeDays,
        costumeLooks,
        importHistories: [
          ...(data.importHistories || []),
          {
            id: `IMP_${Date.now()}`,
            fileName: file?.name || "シーン別衣装香盤.xlsx",
            importType,
            importedAt: nowIso,
            totalRows: parsedRows.length,
            successCount,
            updatedCount,
            skippedCount,
            warningCount,
          },
        ],
      };

      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setStatusResult({
        success: successCount,
        updated: updatedCount,
        skipped: skippedCount,
        warnings: warningCount,
      });

      // 最新状態を再読込
      loadDatabase();
    } catch (e) {
      console.error("Save error:", e);
      alert("インポート結果の保存に失敗しました。");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 画面トップバー */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            IMPORT（Excelファイル取り込み）
          </h1>
        </div>

        {/* 3種類のインポート種別タブ */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800">
          <button
            onClick={() => {
              setImportType("scene_costume");
              setParsedRows([]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "scene_costume"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            1. シーン別衣装香盤 (各シーン×各人物の衣装・持道具・小道具・備考)
          </button>
          <button
            onClick={() => {
              setImportType("overall_continuity");
              setParsedRows([]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "overall_continuity"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            2. 通し香盤 (シーン番号・場所・劇中日・場面内容)
          </button>
          <button
            onClick={() => {
              setImportType("daily_schedule");
              setParsedRows([]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              importType === "daily_schedule"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            3. 日々スケ (撮影日・撮影順・時刻・シーン番号)
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {importType === "scene_costume" && (
            <span>
              各シーンシート（S1, S2, S3...）から、登場人物・衣装・小道具・持道具・メイク・備考を抽出し、既存のSceneおよびCharacterと自動照合します。手動編集済みのデータは上書きから保護されます。
            </span>
          )}
          {importType === "overall_continuity" && (
            <span>通し香盤からシーン一覧と基本情報（劇中日、場所、内容）を取り込みます。</span>
          )}
          {importType === "daily_schedule" && (
            <span>日々スケExcelから撮影日・撮影順を取り込み、衣装をシーン番号で自動連携します。</span>
          )}
        </p>
      </div>

      {/* ファイルアップロードドロップゾーン */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md space-y-4 text-center">
        <label className="block cursor-pointer border-2 border-dashed border-zinc-700 hover:border-amber-400 p-8 rounded-md transition-colors bg-zinc-950">
          <UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-zinc-200 block">
            {file ? file.name : "Excelファイルを選択またはドラッグ＆ドロップ (.xlsx / .xls / .csv)"}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">
            即時上書きは行われません。解析とプレビュー・照合を経て確定します。
          </span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {sheetNames.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs bg-zinc-950 p-3 rounded border border-zinc-800">
            <span className="text-zinc-400 font-mono">対象シート:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="sheetMode"
                checked={selectedSheetMode === "all"}
                onChange={() => {
                  setSelectedSheetMode("all");
                  if (workbook) analyzeWorkbook(workbook, importType, "all", selectedSingleSheet);
                }}
              />
              <span>全シート一括 ({sheetNames.length} シート)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer ml-3">
              <input
                type="radio"
                name="sheetMode"
                checked={selectedSheetMode === "single"}
                onChange={() => {
                  setSelectedSheetMode("single");
                  if (workbook) analyzeWorkbook(workbook, importType, "single", selectedSingleSheet);
                }}
              />
              <span>単一シートのみ指定:</span>
            </label>
            {selectedSheetMode === "single" && (
              <select
                value={selectedSingleSheet}
                onChange={(e) => {
                  setSelectedSingleSheet(e.target.value);
                  if (workbook) analyzeWorkbook(workbook, importType, "single", e.target.value);
                }}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-amber-400 font-bold"
              >
                {sheetNames.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* 解析中インジケータ */}
      {isAnalyzing && (
        <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-md text-amber-400 text-xs font-mono animate-pulse flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Excelを解析し、既存SCENE・CHARACTERと照合しています...</span>
        </div>
      )}

      {/* 解析結果 & プレビュー & 差分対照テーブル */}
      {!isAnalyzing && parsedRows.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>解析・照合結果プレビュー</span>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-amber-400">
                  全 {parsedRows.length} 件のシーン×人物衣装割当
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1">
                緑: 新規追加 / 黄: 差分あり（手動保護判定あり） / 灰: 既存と完全一致 / 赤: 未照合キャラクター
              </p>
            </div>

            {/* 一括操作ボタン */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("overwrite")}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded transition-colors"
                title="手動保護済みの項目を除き、差分をすべて上書き"
              >
                差分を一括上書き
              </button>
              <button
                onClick={() => handleBulkAction("keep_existing")}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded transition-colors"
              >
                既存データをすべて維持
              </button>
            </div>
          </div>

          {/* 照合テーブル */}
          <div className="overflow-x-auto border border-zinc-800 rounded bg-zinc-950 max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono z-10">
                <tr>
                  <th className="p-2 w-16">シーン</th>
                  <th className="p-2 w-32">Excel上の人物</th>
                  <th className="p-2 w-36">照合Character</th>
                  <th className="p-2 w-28">日替わり/LOOK</th>
                  <th className="p-2 w-44">衣装候補 / 差分</th>
                  <th className="p-2">持道具 / 小道具</th>
                  <th className="p-2 w-28">備考</th>
                  <th className="p-2 w-24">状態</th>
                  <th className="p-2 w-28">取込アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {parsedRows.map((row, idx) => {
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-zinc-900/60 transition-colors ${
                        row.diffStatus === "warning_unmatched"
                          ? "bg-red-950/20"
                          : row.diffStatus === "has_diff"
                          ? "bg-amber-950/15"
                          : ""
                      }`}
                    >
                      {/* シーン番号 */}
                      <td className="p-2 font-mono font-bold text-amber-400">
                        S{row.sceneClean}
                      </td>

                      {/* Excel表記 */}
                      <td className="p-2 font-mono text-zinc-300">
                        {row.characterRaw}
                      </td>

                      {/* 照合されたCharacter */}
                      <td className="p-2">
                        {row.characterMatchedId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-100">
                              {
                                data?.characters.find(
                                  (c) => c.id === row.characterMatchedId
                                )?.name
                              }
                            </span>
                            {row.characterCandidates.length > 1 && (
                              <span
                                title="類似候補あり"
                                className="text-[10px] text-amber-400 font-mono"
                              >
                                ⚠
                              </span>
                            )}
                          </div>
                        ) : (
                          <select
                            value=""
                            onChange={(e) =>
                              handleUpdateCharMapping(idx, e.target.value)
                            }
                            className="bg-red-950/80 border border-red-700 text-red-200 text-[11px] rounded px-1.5 py-0.5"
                          >
                            <option value="">(未照合: 紐付け先を選択)</option>
                            {data?.characters.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* 日替わり & LOOK */}
                      <td className="p-2 font-mono text-[11px]">
                        <div>
                          {row.dayNumberRaw ? `日替わり${row.dayNumberRaw}` : "-"}
                        </div>
                        {row.lookRaw && (
                          <div className="text-zinc-500 text-[10px] truncate max-w-[120px]">
                            {row.lookRaw}
                          </div>
                        )}
                      </td>

                      {/* 衣装候補 / 差分 */}
                      <td className="p-2 text-[11px]">
                        <span className="line-clamp-2">
                          {row.costumeCandidateText || "-"}
                        </span>
                      </td>

                      {/* 持道具 / 小道具 */}
                      <td className="p-2 text-[11px]">
                        <span className="line-clamp-2">
                          {row.propsText || "-"}
                        </span>
                      </td>

                      {/* 備考 */}
                      <td className="p-2 text-[11px] text-zinc-400 truncate max-w-[100px]">
                        {row.remarks || "-"}
                      </td>

                      {/* 状態ラベル */}
                      <td className="p-2 text-[11px] font-mono">
                        {row.hasManualOverride ? (
                          <span className="inline-flex items-center gap-1 text-purple-400 font-bold bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-800">
                            <ShieldCheck className="w-3 h-3" />
                            保護
                          </span>
                        ) : row.diffStatus === "new" ? (
                          <span className="text-emerald-400 font-bold">
                            新規
                          </span>
                        ) : row.diffStatus === "has_diff" ? (
                          <span className="text-amber-400 font-bold">
                            差分あり
                          </span>
                        ) : row.diffStatus === "exact_match" ? (
                          <span className="text-zinc-500">一致</span>
                        ) : (
                          <span className="text-red-400 font-bold">
                            要確認
                          </span>
                        )}
                      </td>

                      {/* アクション選択 */}
                      <td className="p-2">
                        <select
                          value={row.selectedAction}
                          onChange={(e) => {
                            const next = [...parsedRows];
                            next[idx].selectedAction = e.target.value as any;
                            setParsedRows(next);
                          }}
                          className={`text-[11px] font-bold rounded px-1.5 py-0.5 border ${
                            row.selectedAction === "overwrite"
                              ? "bg-amber-400 text-black border-amber-300"
                              : row.selectedAction === "keep_existing"
                              ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                              : "bg-zinc-950 text-zinc-400 border-zinc-800"
                          }`}
                        >
                          <option value="create_new">新規作成</option>
                          <option value="overwrite">上書き</option>
                          <option value="keep_existing">既存維持</option>
                          <option value="ignore">除外</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* インポート確定ボタン */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-zinc-400 space-x-3 font-mono">
              <span>
                取込予定:{" "}
                {parsedRows.filter((r) => r.selectedAction !== "ignore").length}{" "}
                件
              </span>
              <span>
                除外:{" "}
                {parsedRows.filter((r) => r.selectedAction === "ignore").length}{" "}
                件
              </span>
            </div>

            <button
              disabled={isImporting || parsedRows.length === 0}
              onClick={handleExecuteImport}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2.5 rounded transition-all active:scale-95 disabled:opacity-40 shadow-lg"
            >
              <span>{isImporting ? "インポート中..." : "インポートを確定して反映"}</span>
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
            <span>インポートが正常に完了しました！</span>
          </div>
          <p className="font-mono text-zinc-400">
            新規追加: {statusResult.success} 件 / 更新（上書き）:{" "}
            {statusResult.updated} 件 / スキップ（既存維持）:{" "}
            {statusResult.skipped} 件
          </p>
          <p className="text-[11px] text-zinc-500 pt-1">
            CHARACTER、SCENE、SCHEDULE、および印刷用PDFに即時反映されています。上部メニューからご確認ください。
          </p>
        </div>
      )}
    </div>
  );
}
