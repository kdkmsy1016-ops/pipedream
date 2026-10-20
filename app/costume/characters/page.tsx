"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Character,
  CostumeDay,
  CostumeLook,
  SceneAppearance,
} from "../../types";
import {
  User,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Upload,
  Maximize2,
  Tag,
  Camera,
  Shirt,
  Search,
} from "lucide-react";

export default function CharactersPage() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [costumeLooks, setCostumeLooks] = useState<CostumeLook[]>([]);
  const [costumeDays, setCostumeDays] = useState<CostumeDay[]>([]);
  const [assignments, setAssignments] = useState<SceneAppearance[]>([]);

  const [selectedCharId, setSelectedCharId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"days" | "looks">("days");

  // 拡大写真モーダル
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // データ取得
  useEffect(() => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.characters || []);
        setCostumeLooks(data.costumeLooks || []);
        setCostumeDays(data.costumeDays || []);
        setAssignments(data.assignments || []);
        if (data.characters?.length > 0) {
          setSelectedCharId(data.characters[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load costume data:", err);
        setLoading(false);
      });
  }, []);

  // サーバー保存関数
  const saveAll = async (
    updatedDays = costumeDays,
    updatedLooks = costumeLooks,
    updatedChars = characters
  ) => {
    setSaving(true);
    try {
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characters: updatedChars,
          costumeLooks: updatedLooks,
          costumeDays: updatedDays,
          assignments,
        }),
      });
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const selectedChar = characters.find((c) => c.id === selectedCharId);

  // キャラクター別の日替わり一覧（ソート順）
  const charDays = costumeDays
    .filter((d) => d.characterId === selectedCharId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // キャラクター別のLOOK一覧
  const charLooks = costumeLooks
    .filter((l) => l.characterId === selectedCharId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // フィルタリング（人物検索）
  const filteredChars = characters.filter((c) =>
    (c.name + (c.actorName || "")).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. 日替わりの新規追加
  const handleAddDay = () => {
    if (!selectedCharId) return;
    const nextNum =
      charDays.length > 0
        ? Math.max(...charDays.map((d) => d.dayNumber)) + 1
        : 1;

    const newDay: CostumeDay = {
      id: `${selectedCharId}_DAY_${Date.now()}`,
      characterId: selectedCharId,
      dayNumber: nextNum,
      displayLabel: `日替わり${nextNum}`,
      storyDate: "",
      costumeLookId: null,
      lookDiff: "",
      makeup: "",
      propsText: "",
      remarks: "",
      sortOrder: charDays.length + 1,
      scenes: [],
      locations: [],
    };

    const nextDays = [...costumeDays, newDay];
    setCostumeDays(nextDays);
    saveAll(nextDays);
  };

  // 2. 日替わりの複製
  const handleDuplicateDay = (day: CostumeDay) => {
    const nextNum =
      charDays.length > 0
        ? Math.max(...charDays.map((d) => d.dayNumber)) + 1
        : 1;

    const dupDay: CostumeDay = {
      ...day,
      id: `${selectedCharId}_DAY_${Date.now()}`,
      dayNumber: nextNum,
      displayLabel: `日替わり${nextNum}（${day.displayLabel}の複製）`,
      sortOrder: charDays.length + 1,
    };

    const nextDays = [...costumeDays, dupDay];
    setCostumeDays(nextDays);
    saveAll(nextDays);
  };

  // 3. 日替わりの削除 (Soft Delete的動作)
  const handleDeleteDay = (dayId: string) => {
    if (!confirm("この日替わりを削除してもよろしいですか？")) return;
    const nextDays = costumeDays.filter((d) => d.id !== dayId);
    setCostumeDays(nextDays);
    saveAll(nextDays);
  };

  // 4. 日替わりの並び替え (↑ / ↓)
  const handleMoveDay = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= charDays.length) return;

    const itemA = charDays[index];
    const itemB = charDays[targetIndex];

    const updated = costumeDays.map((d) => {
      if (d.id === itemA.id) return { ...d, sortOrder: itemB.sortOrder };
      if (d.id === itemB.id) return { ...d, sortOrder: itemA.sortOrder };
      return d;
    });

    setCostumeDays(updated);
    saveAll(updated);
  };

  // 5. 日替わり項目の更新
  const handleUpdateDay = (dayId: string, fields: Partial<CostumeDay>) => {
    const nextDays = costumeDays.map((d) =>
      d.id === dayId ? { ...d, ...fields } : d
    );
    setCostumeDays(nextDays);
  };

  // 6. 写真アップロード (Vercel Blob / ローカル)
  const handlePhotoUpload = async (lookId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "characters");

    try {
      const res = await fetch("/costume/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        // LOOKの写真に登録
        const nextLooks = costumeLooks.map((l) => {
          if (l.id === lookId) {
            const photos = l.photos ? [...l.photos, data.url] : [data.url];
            return {
              ...l,
              mainPhotoUrl: l.mainPhotoUrl || data.url,
              photos,
            };
          }
          return l;
        });
        setCostumeLooks(nextLooks);
        saveAll(costumeDays, nextLooks);
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      alert("写真のアップロードに失敗しました。");
    }
  };

  // 7. 新規LOOK作成
  const handleAddLook = () => {
    if (!selectedCharId) return;
    const nextNum = charLooks.length + 1;
    const newLook: CostumeLook = {
      id: `${selectedCharId}_LOOK_${Date.now()}`,
      characterId: selectedCharId,
      lookCode: `LOOK ${String(nextNum).padStart(2, "0")}`,
      title: "新規衣装LOOK",
      description: "",
      mainPhotoUrl: null,
      photos: [],
      sortOrder: nextNum,
    };
    const nextLooks = [...costumeLooks, newLook];
    setCostumeLooks(nextLooks);
    saveAll(costumeDays, nextLooks);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400 font-mono text-sm">
        データを読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 画面トップバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            CHARACTER（人物別・衣装香盤）
          </h1>
          {saving && (
            <span className="text-xs text-amber-400 animate-pulse font-mono">
              [保存中...]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="人物名検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded text-xs pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-44"
            />
          </div>
        </div>
      </div>

      {/* メインレイアウト: 左側キャラクター選択リスト / 右側衣装編集 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* 左: 人物一覧 */}
        <aside className="bg-zinc-900 border border-zinc-800 rounded-md p-2 space-y-1 md:sticky md:top-16">
          <p className="text-[11px] font-mono text-zinc-400 px-2 py-1 uppercase tracking-wider">
            登場人物一覧 ({filteredChars.length})
          </p>
          <div className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredChars.map((char) => {
              const isSelected = char.id === selectedCharId;
              const dayCount = costumeDays.filter(
                (d) => d.characterId === char.id
              ).length;

              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-amber-400 text-black font-bold shadow-sm"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <span className="truncate">{char.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-black/20 text-black"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {dayCount}着
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 右: 日替わり & LOOK 管理エリア */}
        <div className="md:col-span-3 space-y-4">
          {selectedChar ? (
            <>
              {/* 人物ヘッダー */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-wide text-zinc-100">
                      {selectedChar.name}
                    </h2>
                    {selectedChar.actorName && (
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                        役: {selectedChar.actorName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    全 {charDays.length} 日替わり / {charLooks.length} LOOK
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("days")}
                    className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors ${
                      activeTab === "days"
                        ? "bg-zinc-100 text-black font-bold"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    日替わり一覧 ({charDays.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("looks")}
                    className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors ${
                      activeTab === "looks"
                        ? "bg-zinc-100 text-black font-bold"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    衣装LOOK一覧 ({charLooks.length})
                  </button>
                </div>
              </div>

              {/* タブ1: 日替わり一覧 */}
              {activeTab === "days" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono text-zinc-400">
                      日替わりごとに使用シーン・LOOK・小道具・持道具を管理できます。
                    </p>
                    <button
                      onClick={handleAddDay}
                      className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3 py-1.5 rounded transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>日替わりを追加</span>
                    </button>
                  </div>

                  {charDays.length === 0 ? (
                    <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500 text-xs">
                      日替わり情報がまだ登録されていません。「日替わりを追加」またはExcel取込からインポートしてください。
                    </div>
                  ) : (
                    charDays.map((day, index) => {
                      const matchedLook = costumeLooks.find(
                        (l) => l.id === day.costumeLookId
                      );

                      return (
                        <div
                          key={day.id}
                          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md p-4 transition-all space-y-3"
                        >
                          {/* カードヘッダー */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              {/* 表示用日替わりラベル（自由編集） */}
                              <input
                                type="text"
                                value={day.displayLabel}
                                onChange={(e) =>
                                  handleUpdateDay(day.id, {
                                    displayLabel: e.target.value,
                                  })
                                }
                                onBlur={() => saveAll()}
                                className="bg-zinc-950 border border-zinc-700 rounded px-2 py-0.5 text-xs font-bold text-amber-400 w-28 focus:outline-none focus:border-amber-400"
                              />

                              {/* 劇中日 */}
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-zinc-500">
                                  劇中日:
                                </span>
                                <input
                                  type="text"
                                  placeholder="例: D1, 2021-03-19"
                                  value={day.storyDate || ""}
                                  onChange={(e) =>
                                    handleUpdateDay(day.id, {
                                      storyDate: e.target.value,
                                    })
                                  }
                                  onBlur={() => saveAll()}
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-300 w-32 focus:outline-none focus:border-amber-400"
                                />
                              </div>
                            </div>

                            {/* 操作アクション (並び替え / 複製 / 削除) */}
                            <div className="flex items-center gap-1">
                              <button
                                disabled={index === 0}
                                onClick={() => handleMoveDay(index, "up")}
                                title="上に移動"
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:hover:bg-zinc-800 text-xs"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === charDays.length - 1}
                                onClick={() => handleMoveDay(index, "down")}
                                title="下に移動"
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:hover:bg-zinc-800 text-xs"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateDay(day)}
                                title="日替わりを複製"
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDay(day.id)}
                                title="削除"
                                className="p-1 rounded bg-red-950/40 hover:bg-red-900 text-red-300 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* カード本文 (2カラム: 左=衣装写真(2:3) / 右=LOOK・小道具・備考・使用シーン) */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {/* 左: 衣装写真サムネイル (2:3比率, object-fit: contain で全身表示) */}
                            <div className="sm:col-span-1 space-y-2">
                              <div className="costume-thumb-container border border-zinc-800 group relative">
                                {matchedLook?.mainPhotoUrl ? (
                                  <>
                                    <Image
                                      src={matchedLook.mainPhotoUrl}
                                      alt={day.displayLabel}
                                      fill
                                      className="costume-thumb-img"
                                    />
                                    <button
                                      onClick={() =>
                                        setLightboxUrl(
                                          matchedLook.mainPhotoUrl!
                                        )
                                      }
                                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black rounded text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="拡大表示"
                                    >
                                      <Maximize2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-zinc-600 gap-1 select-none">
                                    <Shirt className="w-6 h-6 stroke-1 text-zinc-700" />
                                    <span className="text-[10px] font-mono">
                                      NO PHOTO
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* 写真アップロードボタン */}
                              {matchedLook && (
                                <label className="block text-center cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] py-1 rounded transition-colors">
                                  <span className="flex items-center justify-center gap-1">
                                    <Camera className="w-3 h-3" /> 写真登録
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        handlePhotoUpload(
                                          matchedLook.id,
                                          e.target.files[0]
                                        );
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>

                            {/* 右: 詳細情報フォーム */}
                            <div className="sm:col-span-3 space-y-2.5 text-xs">
                              {/* LOOK 紐付け選択 */}
                              <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                                <span className="font-mono text-zinc-400 font-bold">
                                  LOOK:
                                </span>
                                <select
                                  value={day.costumeLookId || ""}
                                  onChange={(e) => {
                                    handleUpdateDay(day.id, {
                                      costumeLookId: e.target.value || null,
                                    });
                                    saveAll();
                                  }}
                                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                                >
                                  <option value="">(未設定 - LOOKを選択)</option>
                                  {charLooks.map((look) => (
                                    <option key={look.id} value={look.id}>
                                      {look.lookCode} : {look.title || "名称未定"}
                                    </option>
                                  ))}
                                </select>

                                {/* 差分メモ */}
                                <input
                                  type="text"
                                  placeholder="この日替わりだけの差分 (例: エプロン着用, 上着脱ぎ)"
                                  value={day.lookDiff || ""}
                                  onChange={(e) =>
                                    handleUpdateDay(day.id, {
                                      lookDiff: e.target.value,
                                    })
                                  }
                                  onBlur={() => saveAll()}
                                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-amber-400 min-w-[180px]"
                                />
                              </div>

                              {/* 使用シーン一覧 */}
                              <div className="flex items-start gap-2">
                                <span className="text-zinc-500 font-mono w-16 flex-shrink-0 pt-0.5">
                                  使用シーン:
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                                  {day.scenes && day.scenes.length > 0 ? (
                                    day.scenes.map((s) => (
                                      <span
                                        key={s}
                                        className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono font-bold text-[11px] border border-zinc-700"
                                      >
                                        S{s.replace(/^S/i, "")}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-zinc-600 text-[11px]">
                                      (SCENE画面またはExcel取込で紐付け可能)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* 小道具・持道具 */}
                              <div className="flex items-start gap-2">
                                <span className="text-zinc-500 font-mono w-16 flex-shrink-0 pt-1">
                                  小道具/持具:
                                </span>
                                <input
                                  type="text"
                                  placeholder="例: 重箱、買い物袋、マスク（白）"
                                  value={day.propsText || ""}
                                  onChange={(e) =>
                                    handleUpdateDay(day.id, {
                                      propsText: e.target.value,
                                    })
                                  }
                                  onBlur={() => saveAll()}
                                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700"
                                />
                              </div>

                              {/* 備考欄 */}
                              <div className="flex items-start gap-2">
                                <span className="text-zinc-500 font-mono w-16 flex-shrink-0 pt-1">
                                  備考:
                                </span>
                                <textarea
                                  rows={2}
                                  placeholder="現場連絡事項、ヘアメイク、状態変化など"
                                  value={day.remarks || ""}
                                  onChange={(e) =>
                                    handleUpdateDay(day.id, {
                                      remarks: e.target.value,
                                    })
                                  }
                                  onBlur={() => saveAll()}
                                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700 leading-relaxed"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* タブ2: LOOK一覧 (衣装そのものの管理) */}
              {activeTab === "looks" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono text-zinc-400">
                      衣装そのものを独立して管理します。同一LOOKを複数の日替わりで再利用できます。
                    </p>
                    <button
                      onClick={handleAddLook}
                      className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3 py-1.5 rounded transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>LOOKを追加</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {charLooks.map((look) => (
                      <div
                        key={look.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-md p-3 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-amber-400 font-bold text-sm">
                            {look.lookCode}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            使用中の日替わり:{" "}
                            {
                              costumeDays.filter(
                                (d) => d.costumeLookId === look.id
                              ).length
                            }
                            件
                          </span>
                        </div>

                        {/* 写真サムネイル (2:3) */}
                        <div className="costume-thumb-container border border-zinc-800 relative group">
                          {look.mainPhotoUrl ? (
                            <>
                              <Image
                                src={look.mainPhotoUrl}
                                alt={look.lookCode}
                                fill
                                className="costume-thumb-img"
                              />
                              <button
                                onClick={() =>
                                  setLightboxUrl(look.mainPhotoUrl!)
                                }
                                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black rounded text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-1">
                              <Shirt className="w-6 h-6 stroke-1 text-zinc-700" />
                              <span className="text-[10px] font-mono">
                                NO PHOTO
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 写真追加 */}
                        <label className="block text-center cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] py-1 rounded transition-colors">
                          <span className="flex items-center justify-center gap-1">
                            <Camera className="w-3 h-3" /> 写真を変更・追加
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePhotoUpload(look.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {/* LOOKタイトル */}
                        <input
                          type="text"
                          placeholder="衣装タイトル (例: スナック勤務着)"
                          value={look.title || ""}
                          onChange={(e) => {
                            const next = costumeLooks.map((l) =>
                              l.id === look.id
                                ? { ...l, title: e.target.value }
                                : l
                            );
                            setCostumeLooks(next);
                          }}
                          onBlur={() => saveAll()}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                        />

                        {/* LOOK説明 */}
                        <textarea
                          rows={2}
                          placeholder="構成アイテム、色、靴、特徴など"
                          value={look.description || ""}
                          onChange={(e) => {
                            const next = costumeLooks.map((l) =>
                              l.id === look.id
                                ? { ...l, description: e.target.value }
                                : l
                            );
                            setCostumeLooks(next);
                          }}
                          onBlur={() => saveAll()}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-sm bg-zinc-900 border border-zinc-800 rounded-md">
              左側から人物を選択してください。
            </div>
          )}
        </div>
      </div>

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
