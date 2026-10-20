"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Character,
  CostumeLook,
  CostumeDay,
  Scene,
  SceneAppearance,
} from "../types";
import {
  Shirt,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Maximize2,
  Camera,
  Layers,
  Merge,
  AlertTriangle,
  Check,
  Tag,
  Filter,
} from "lucide-react";

export default function LooksLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [looks, setLooks] = useState<CostumeLook[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [costumeDays, setCostumeDays] = useState<CostumeDay[]>([]);
  const [assignments, setAssignments] = useState<SceneAppearance[]>([]);

  // フィルタ・検索
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 編集・詳細モーダル
  const [selectedLook, setSelectedLook] = useState<CostumeLook | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // タグ変更時の警告モーダル
  const [tagChangePending, setTagChangePending] = useState<{
    lookId: string;
    newCharId: string;
    newCharName: string;
    usedDays: CostumeDay[];
    usedAssignments: SceneAppearance[];
  } | null>(null);

  // LOOK統合モーダル
  const [mergeModal, setMergeModal] = useState<{
    sourceLook: CostumeLook;
    targetLookId: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  // データロード
  const loadData = () => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((data) => {
        setLooks(data.costumeLooks || []);
        setCharacters(data.characters || []);
        setCostumeDays(data.costumeDays || []);
        setAssignments(data.assignments || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveAll = async (updatedLooks = looks) => {
    setSaving(true);
    try {
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costumeLooks: updatedLooks,
        }),
      });
    } catch (e) {
      console.error("Save looks error:", e);
    } finally {
      setSaving(false);
    }
  };

  // キャラクタータグ一覧
  const availableTags = [
    "ALL",
    ...characters.map((c) => c.name),
    "未分類",
  ];

  // フィルタリングと検索
  const filteredLooks = looks.filter((look) => {
    const char = characters.find((c) => c.id === look.characterId);
    const tagName = look.characterTag || (char ? char.name : "未分類");

    // タグ絞り込み
    if (selectedTag !== "ALL" && tagName !== selectedTag) return false;

    // 検索語
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = look.lookCode.toLowerCase().includes(q);
      const matchTitle = (look.title || "").toLowerCase().includes(q);
      const matchTag = tagName.toLowerCase().includes(q);
      const matchDesc = (look.description || "").toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchTag && !matchDesc) return false;
    }
    return true;
  });

  // キャラクターごとのグルーピング
  const groupedLooks: { [tag: string]: CostumeLook[] } = {};
  filteredLooks.forEach((look) => {
    const char = characters.find((c) => c.id === look.characterId);
    const tagName = look.characterTag || (char ? char.name : "未分類");
    if (!groupedLooks[tagName]) groupedLooks[tagName] = [];
    groupedLooks[tagName].push(look);
  });

  // 1. 新規LOOK作成
  const handleAddNewLook = () => {
    const charId = selectedTag !== "ALL" && selectedTag !== "未分類"
      ? (characters.find((c) => c.name === selectedTag)?.id || "UNCLASSIFIED")
      : "UNCLASSIFIED";
    const char = characters.find((c) => c.id === charId);
    const charTag = char ? char.name : "未分類";

    const charLooks = looks.filter((l) => l.characterId === charId);
    const nextNum = charLooks.length + 1;

    const newLook: CostumeLook = {
      id: `LOOK_${charId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      characterId: charId,
      characterTag: charTag,
      lookNumber: nextNum,
      lookCode: `LOOK ${String(nextNum).padStart(2, "0")}`,
      title: "新規衣装LOOK",
      description: "",
      mainPhotoUrl: null,
      photos: [],
      sortOrder: nextNum,
      createdAt: new Date().toISOString(),
    };

    const nextLooks = [...looks, newLook];
    setLooks(nextLooks);
    saveAll(nextLooks);
  };

  // 2. LOOK複製
  const handleDuplicateLook = (source: CostumeLook) => {
    const charLooks = looks.filter((l) => l.characterId === source.characterId);
    const nextNum = charLooks.length + 1;

    const duplicated: CostumeLook = {
      ...source,
      id: `LOOK_${source.characterId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lookNumber: nextNum,
      lookCode: `LOOK ${String(nextNum).padStart(2, "0")}`,
      title: `${source.title || "衣装"} (複製)`,
      sortOrder: nextNum,
      createdAt: new Date().toISOString(),
    };

    const nextLooks = [...looks, duplicated];
    setLooks(nextLooks);
    saveAll(nextLooks);
  };

  // 3. LOOK並び替え (↑ / ↓)
  const handleMoveLook = (look: CostumeLook, direction: "up" | "down") => {
    const charLooks = looks
      .filter((l) => l.characterId === look.characterId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const curIndex = charLooks.findIndex((l) => l.id === look.id);
    const targetIndex = direction === "up" ? curIndex - 1 : curIndex + 1;
    if (targetIndex < 0 || targetIndex >= charLooks.length) return;

    const other = charLooks[targetIndex];
    const updated = looks.map((l) => {
      if (l.id === look.id) return { ...l, sortOrder: other.sortOrder };
      if (l.id === other.id) return { ...l, sortOrder: look.sortOrder };
      return l;
    });

    setLooks(updated);
    saveAll(updated);
  };

  // 4. キャラクタータグの変更（使用中なら警告）
  const requestChangeTag = (lookId: string, newCharId: string) => {
    const look = looks.find((l) => l.id === lookId);
    if (!look) return;

    const newChar = characters.find((c) => c.id === newCharId);
    const newCharName = newChar ? newChar.name : "未分類";

    // 使用中チェック
    const usedDays = costumeDays.filter((d) => d.costumeLookId === lookId);
    const usedAssignments = assignments.filter((a) => a.costumeLookId === lookId);

    if (usedDays.length > 0 || usedAssignments.length > 0) {
      setTagChangePending({
        lookId,
        newCharId,
        newCharName,
        usedDays,
        usedAssignments,
      });
    } else {
      executeChangeTag(lookId, newCharId, newCharName);
    }
  };

  const executeChangeTag = (lookId: string, newCharId: string, newCharName: string) => {
    const targetLooks = looks.filter((l) => l.characterId === newCharId);
    const nextNum = targetLooks.length + 1;

    const updated = looks.map((l) => {
      if (l.id === lookId) {
        return {
          ...l,
          characterId: newCharId,
          characterTag: newCharName,
          lookNumber: nextNum,
          lookCode: `LOOK ${String(nextNum).padStart(2, "0")}`,
          sortOrder: nextNum,
        };
      }
      return l;
    });
    setLooks(updated);
    saveAll(updated);
    setTagChangePending(null);
  };

  // 5. LOOK統合の実行
  const executeMergeLooks = async (sourceId: string, targetId: string) => {
    const source = looks.find((l) => l.id === sourceId);
    const target = looks.find((l) => l.id === targetId);
    if (!source || !target) return;

    // 写真の統合
    const mergedPhotos = Array.from(
      new Set([...(target.photos || []), ...(source.photos || [])])
    );
    const mainPhotoUrl = target.mainPhotoUrl || source.mainPhotoUrl;

    const updatedTarget: CostumeLook = {
      ...target,
      mainPhotoUrl,
      photos: mergedPhotos,
    };

    // 日替わり・アサインメントの付け替え
    const updatedDays = costumeDays.map((d) =>
      d.costumeLookId === sourceId ? { ...d, costumeLookId: targetId } : d
    );
    const updatedAsgs = assignments.map((a) =>
      a.costumeLookId === sourceId ? { ...a, costumeLookId: targetId } : a
    );

    // ソースLOOKの削除
    const remainingLooks = looks
      .filter((l) => l.id !== sourceId)
      .map((l) => (l.id === targetId ? updatedTarget : l));

    setLooks(remainingLooks);
    setCostumeDays(updatedDays);
    setAssignments(updatedAsgs);

    await fetch("/costume/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        costumeLooks: remainingLooks,
        costumeDays: updatedDays,
        assignments: updatedAsgs,
      }),
    });

    setMergeModal(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400 font-mono text-sm">
        衣装LOOKライブラリを読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 画面トップバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <Shirt className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            LOOK（衣装LOOKライブラリ）
          </h1>
          <span className="text-xs font-mono text-zinc-500">
            (全 {looks.length} LOOK)
          </span>
          {saving && (
            <span className="text-xs text-amber-400 animate-pulse font-mono">
              [保存中...]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 検索入力 */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="LOOK番号 / 名称 / タグ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded text-xs pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-48"
            />
          </div>

          <button
            onClick={handleAddNewLook}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3 py-1.5 rounded transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新規LOOK作成</span>
          </button>
        </div>
      </div>

      {/* キャラクタータグフィルターバー */}
      <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-md flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          タグ:
        </span>
        {availableTags.map((tag) => {
          const isSelected = selectedTag === tag;
          const count =
            tag === "ALL"
              ? looks.length
              : looks.filter((l) => {
                  const char = characters.find((c) => c.id === l.characterId);
                  const name = l.characterTag || (char ? char.name : "未分類");
                  return name === tag;
                }).length;

          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-amber-400 text-black font-bold shadow-sm"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <span>{tag === "ALL" ? "すべて" : tag}</span>
              <span
                className={`text-[10px] px-1 rounded ${
                  isSelected ? "bg-black/20 text-black" : "bg-zinc-900 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LOOKカード一覧（キャラクタータグ別グルーピング） */}
      <div className="space-y-6">
        {Object.keys(groupedLooks).length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs bg-zinc-900 border border-zinc-800 rounded-md">
            該当する衣装LOOKが見つかりません。
          </div>
        ) : (
          Object.entries(groupedLooks).map(([groupTag, groupLooks]) => (
            <div key={groupTag} className="space-y-3">
              {/* グループ見出し */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-zinc-200">
                  {groupTag}
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  ({groupLooks.length} 着)
                </span>
              </div>

              {/* グリッドカード */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {groupLooks
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((look, idx) => {
                    const usedDays = costumeDays.filter(
                      (d) => d.costumeLookId === look.id
                    );
                    const usedAsgs = assignments.filter(
                      (a) => a.costumeLookId === look.id
                    );

                    return (
                      <div
                        key={look.id}
                        className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md p-2.5 flex flex-col justify-between space-y-2 group transition-all"
                      >
                        {/* 2:3 縦長サムネイル (object-fit: contain で全身表示) */}
                        <div className="costume-thumb-container border border-zinc-800 relative">
                          {look.mainPhotoUrl ? (
                            <>
                              <Image
                                src={look.mainPhotoUrl}
                                alt={look.lookCode}
                                fill
                                className="costume-thumb-img"
                              />
                              <button
                                onClick={() => setLightboxUrl(look.mainPhotoUrl!)}
                                className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black rounded text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="拡大表示"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-1">
                              <Shirt className="w-6 h-6 stroke-1 text-zinc-700" />
                              <span className="text-[9px] font-mono">NO PHOTO</span>
                            </div>
                          )}

                          {/* 写真枚数バッジ */}
                          {look.photos && look.photos.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-zinc-300 font-mono px-1 rounded border border-zinc-700">
                              +{look.photos.length - 1}枚
                            </span>
                          )}
                        </div>

                        {/* カード情報 */}
                        <div className="space-y-1.5 text-xs">
                          {/* LOOK番号 & 操作ボタン */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {look.lookCode}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveLook(look, "up")}
                                title="順番を上げる"
                                className="p-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-20 text-[10px]"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={idx === groupLooks.length - 1}
                                onClick={() => handleMoveLook(look, "down")}
                                title="順番を下げる"
                                className="p-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-20 text-[10px]"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDuplicateLook(look)}
                                title="LOOKを複製"
                                className="p-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px]"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* LOOK名称 */}
                          <input
                            type="text"
                            placeholder="衣装名称..."
                            value={look.title || ""}
                            onChange={(e) => {
                              const next = looks.map((l) =>
                                l.id === look.id ? { ...l, title: e.target.value } : l
                              );
                              setLooks(next);
                            }}
                            onBlur={() => saveAll()}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 truncate"
                          />

                          {/* キャラクタータグ選択 */}
                          <div className="space-y-0.5">
                            <label className="text-[10px] text-zinc-500 font-mono block">
                              人物タグ:
                            </label>
                            <select
                              value={look.characterId}
                              onChange={(e) =>
                                requestChangeTag(look.id, e.target.value)
                              }
                              className="w-full bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-amber-400"
                            >
                              <option value="UNCLASSIFIED">未分類</option>
                              {characters.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 使用状況カウンター */}
                          <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1 border-t border-zinc-800/80">
                            <span>日替わり: {usedDays.length}件</span>
                            <span>シーン: {usedAsgs.length}件</span>
                          </div>

                          {/* 統合アクションリンク */}
                          <div className="pt-0.5 flex justify-end">
                            <button
                              onClick={() =>
                                setMergeModal({
                                  sourceLook: look,
                                  targetLookId: "",
                                })
                              }
                              className="text-[10px] text-zinc-500 hover:text-amber-400 flex items-center gap-0.5"
                            >
                              <Merge className="w-2.5 h-2.5" />
                              <span>別LOOKと統合</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* タグ変更警告モーダル */}
      {tagChangePending && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-md max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">
                キャラクタータグ変更の警告
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              このLOOKは現在、以下の日替わりおよびシーンで使用されています。
              キャラクタータグを「
              <span className="font-bold text-amber-400">
                {tagChangePending.newCharName}
              </span>
              」へ変更すると、紐づくシーンでの表示人物も影響を受けます。
            </p>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs space-y-1 font-mono text-zinc-400 max-h-36 overflow-y-auto">
              <p className="font-bold text-zinc-300">使用中の日替わり:</p>
              {tagChangePending.usedDays.map((d) => (
                <p key={d.id} className="pl-2">
                  • {d.displayLabel} (劇中日: {d.storyDate || "未定"})
                </p>
              ))}
              <p className="font-bold text-zinc-300 pt-1">使用中のシーン:</p>
              <div className="flex flex-wrap gap-1 pl-2">
                {tagChangePending.usedAssignments.map((a) => (
                  <span
                    key={a.id}
                    className="bg-zinc-900 border border-zinc-700 px-1 rounded text-[10px]"
                  >
                    S{a.sceneId.replace(/^S/i, "")}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTagChangePending(null)}
                className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  const look = looks.find((l) => l.id === tagChangePending.lookId);
                  if (look) handleDuplicateLook(look);
                  setTagChangePending(null);
                }}
                className="px-3 py-1.5 rounded text-xs bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                別LOOKとして複製
              </button>
              <button
                onClick={() =>
                  executeChangeTag(
                    tagChangePending.lookId,
                    tagChangePending.newCharId,
                    tagChangePending.newCharName
                  )
                }
                className="px-3 py-1.5 rounded text-xs bg-amber-400 hover:bg-amber-300 text-black font-bold"
              >
                変更を実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOOK統合モーダル */}
      {mergeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-md max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Merge className="w-5 h-5" />
              <h3 className="font-bold text-sm">衣装LOOKの統合</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              「
              <span className="font-bold text-amber-400">
                {mergeModal.sourceLook.lookCode} :{" "}
                {mergeModal.sourceLook.title || "衣装"}
              </span>
              」のすべての写真・使用日替わり・シーン割当を、別の統合先LOOKへ集約し、このLOOKを削除します。
            </p>

            <div className="space-y-1 text-xs">
              <label className="text-zinc-400 font-mono block">
                統合先（残すLOOK）を選択:
              </label>
              <select
                value={mergeModal.targetLookId}
                onChange={(e) =>
                  setMergeModal({ ...mergeModal, targetLookId: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-amber-400 font-bold"
              >
                <option value="">(統合先LOOKを選択)</option>
                {looks
                  .filter((l) => l.id !== mergeModal.sourceLook.id)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      [{l.characterTag || "未分類"}] {l.lookCode} :{" "}
                      {l.title || "名称未定"}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMergeModal(null)}
                className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                キャンセル
              </button>
              <button
                disabled={!mergeModal.targetLookId}
                onClick={() =>
                  executeMergeLooks(
                    mergeModal.sourceLook.id,
                    mergeModal.targetLookId
                  )
                }
                className="px-3 py-1.5 rounded text-xs bg-amber-400 hover:bg-amber-300 text-black font-bold disabled:opacity-40"
              >
                統合を実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拡大写真モーダル */}
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
