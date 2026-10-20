"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, ArrowRight } from "lucide-react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"scenes" | "schedule">("scenes");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  // 列マッピング
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({
    sceneNumber: "",
    dayNight: "",
    location: "",
    storyDate: "",
    summary: "",
    character: "",
    costumeDay: "",
  });

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // ファイル解析
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        setSheetNames(wb.SheetNames);
        const firstSheet = wb.SheetNames[0];
        setSelectedSheet(firstSheet);
        parseSheet(wb, firstSheet);
      } catch (err) {
        console.error("Excel parse error:", err);
        alert("Excelファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsBinaryString(selected);
  };

  const parseSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });
    if (data.length === 0) return;

    // ヘッダー行を探索（空行を飛ばす）
    let headerRowIdx = 0;
    for (let i = 0; i < Math.min(data.length, 5); i++) {
      if (data[i] && (data[i] as any[]).length > 2) {
        headerRowIdx = i;
        break;
      }
    }

    const header = (data[headerRowIdx] as any[]).map((col, idx) =>
      col ? String(col).trim() : `Col_${idx + 1}`
    );
    setColumns(header);

    // データ行
    const rows = data.slice(headerRowIdx + 1).filter((r: any) => r && r.length > 0);
    setRawRows(rows);

    // 自動列マッピング推測
    const mapping: { [key: string]: string } = {};
    header.forEach((col) => {
      const c = col.toLowerCase();
      if (/シーン|s#|scene/i.test(c)) mapping.sceneNumber = col;
      if (/dn|d\/n|昼夜/i.test(c)) mapping.dayNight = col;
      if (/場所|ロケ|柱/i.test(c)) mapping.location = col;
      if (/劇中日|日付|date/i.test(c)) mapping.storyDate = col;
      if (/内容|場面|ト書き/i.test(c)) mapping.summary = col;
      if (/役|人物|キャラ/i.test(c)) mapping.character = col;
      if (/日替|衣装/i.test(c)) mapping.costumeDay = col;
    });
    setColumnMapping(mapping);

    // プレビュー生成（先頭5件）
    generatePreview(rows, header, mapping);
  };

  const generatePreview = (rows: any[], header: string[], mapping: any) => {
    const preview = rows.slice(0, 5).map((r) => {
      const getVal = (colKey: string) => {
        const colName = mapping[colKey];
        if (!colName) return "-";
        const idx = header.indexOf(colName);
        return idx !== -1 && r[idx] !== undefined ? String(r[idx]) : "-";
      };

      return {
        sceneNumber: getVal("sceneNumber"),
        dayNight: getVal("dayNight"),
        location: getVal("location"),
        storyDate: getVal("storyDate"),
        summary: getVal("summary"),
        character: getVal("character"),
        costumeDay: getVal("costumeDay"),
      };
    });
    setPreviewData(preview);
  };

  // インポート実行
  const handleExecuteImport = async () => {
    if (!file || rawRows.length === 0) return;
    setImporting(true);
    setStatusMessage(null);

    try {
      // 既存データの読み込み
      const res = await fetch("/costume/api/data");
      const current = await res.json();

      let scenes = [...(current.scenes || [])];
      let assignments = [...(current.assignments || [])];

      let addedCount = 0;

      rawRows.forEach((r, idx) => {
        const getVal = (colKey: string) => {
          const colName = columnMapping[colKey];
          if (!colName) return "";
          const colIdx = columns.indexOf(colName);
          return colIdx !== -1 && r[colIdx] !== undefined ? String(r[colIdx]).trim() : "";
        };

        const scNum = getVal("sceneNumber");
        if (!scNum) return;

        const cleanNum = scNum.replace(/^S/i, "");
        const existingIdx = scenes.findIndex((s) => s.sceneNumber === cleanNum);

        const newScene = {
          id: `S${cleanNum}`,
          sceneNumber: cleanNum,
          sortOrder: (idx + 1) * 10,
          dayNight: getVal("dayNight") || null,
          storyDate: getVal("storyDate") || null,
          location: getVal("location") || null,
          summary: getVal("summary") || null,
        };

        if (existingIdx !== -1) {
          scenes[existingIdx] = { ...scenes[existingIdx], ...newScene };
        } else {
          scenes.push(newScene);
        }
        addedCount++;
      });

      // 保存
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...current,
          scenes,
          assignments,
        }),
      });

      setStatusMessage(`✅ ${addedCount} 件のシーン情報を取り込みました。`);
    } catch (err) {
      console.error("Import error:", err);
      setStatusMessage("❌ インポートに失敗しました。");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            IMPORT（Excelファイル取り込み）
          </h1>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          通し香盤または日々スケExcelを選択し、列のマッピングを確認して取り込みます。選択しただけでは上書きされません。
        </p>
      </div>

      {/* 1. ファイル選択 */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md space-y-4 text-center">
        <label className="block cursor-pointer border-2 border-dashed border-zinc-700 hover:border-amber-400 p-8 rounded-md transition-colors bg-zinc-950">
          <UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-zinc-200 block">
            {file ? file.name : "Excelファイルを選択またはドラッグ＆ドロップ"}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">
            (.xlsx / .xls / .csv)
          </span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {sheetNames.length > 1 && (
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-zinc-400">シート選択:</span>
            <select
              value={selectedSheet}
              onChange={(e) => {
                setSelectedSheet(e.target.value);
                // 再パース
              }}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
            >
              {sheetNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. 列マッピング & プレビュー */}
      {columns.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-4">
          <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2">
            列マッピングの確認・手動修正
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            {[
              { key: "sceneNumber", label: "シーン番号 *" },
              { key: "dayNight", label: "D/N (昼夜)" },
              { key: "location", label: "場所・ロケ地" },
              { key: "storyDate", label: "劇中日" },
              { key: "summary", label: "場面内容" },
              { key: "character", label: "登場人物" },
              { key: "costumeDay", label: "日替わり" },
            ].map((f) => (
              <div key={f.key} className="space-y-1">
                <label className="text-zinc-400 font-mono text-[11px] block">
                  {f.label}
                </label>
                <select
                  value={columnMapping[f.key] || ""}
                  onChange={(e) => {
                    const next = { ...columnMapping, [f.key]: e.target.value };
                    setColumnMapping(next);
                    generatePreview(rawRows, columns, next);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-amber-400 focus:outline-none focus:border-amber-400 text-xs"
                >
                  <option value="">(対応なし)</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* プレビューテーブル */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-mono text-zinc-400">
              インポートプレビュー（先頭5件）:
            </p>
            <div className="overflow-x-auto border border-zinc-800 rounded bg-zinc-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="p-2">シーン</th>
                    <th className="p-2">D/N</th>
                    <th className="p-2">場所</th>
                    <th className="p-2">劇中日</th>
                    <th className="p-2">内容</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-mono font-bold text-amber-400">
                        {row.sceneNumber}
                      </td>
                      <td className="p-2">{row.dayNight}</td>
                      <td className="p-2">{row.location}</td>
                      <td className="p-2">{row.storyDate}</td>
                      <td className="p-2 truncate max-w-xs">{row.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 実行ボタン */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-400 font-mono">
              全 {rawRows.length} 行を検出
            </span>
            <button
              disabled={importing || !columnMapping.sceneNumber}
              onClick={handleExecuteImport}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded transition-all disabled:opacity-40"
            >
              <span>{importing ? "インポート中..." : "インポートを実行"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs font-bold text-center p-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
              {statusMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
