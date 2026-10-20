"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Scene,
  SceneAppearance,
  Character,
  CostumeDay,
  CostumeLook,
} from "../../types";
import {
  Clapperboard,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Shirt,
  UserPlus,
} from "lucide-react";

export default function ScenesPage() {
  const [loading, setLoading] = useState(true);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [assignments, setAssignments] = useState<SceneAppearance[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [costumeDays, setCostumeDays] = useState<CostumeDay[]>([]);
  const [costumeLooks, setCostumeLooks] = useState<CostumeLook[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((data) => {
        setScenes(data.scenes || []);
        setAssignments(data.assignments || []);
        setCharacters(data.characters || []);
        setCostumeDays(data.costumeDays || []);
        setCostumeLooks(data.costumeLooks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load scenes data:", err);
        setLoading(false);
      });
  }, []);

  const saveAll = async (
    updatedScenes = scenes,
    updatedAssignments = assignments
  ) => {
    setSaving(true);
    try {
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenes: updatedScenes,
          assignments: updatedAssignments,
          characters,
          costumeDays,
          costumeLooks,
        }),
      });
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  // シーン番号ソート
  const sortedScenes = [...scenes].sort((a, b) => a.sortOrder - b.sortOrder);

  // フィルタリング（シーン番号または場所または登場人物）
  const filteredScenes = sortedScenes.filter((scene) => {
    const q = searchQuery.toLowerCase();
    const matchNum = `s${scene.sceneNumber}`.toLowerCase().includes(q);
    const matchLoc = (scene.location || "").toLowerCase().includes(q);
    const sceneChars = assignments
      .filter((a) => a.sceneId === scene.id)
      .map((a) => a.characterName)
      .join(" ");
    const matchChar = sceneChars.toLowerCase().includes(q);
    return matchNum || matchLoc || matchChar;
  });

  // シーンへの登場人物追加
  const handleAddCharacterToScene = (sceneId: string, charId: string) => {
    const char = characters.find((c) => c.id === charId);
    if (!char) return;

    // 既に登場しているか確認
    const existing = assignments.find(
      (a) => a.sceneId === sceneId && a.characterId === charId
    );
    if (existing) {
      alert(`${char.name} はすでにこのシーンに登場しています。`);
      return;
    }

    // デフォルト日替わり（最初の1つ）
    const firstDay = costumeDays.find((d) => d.characterId === charId);

    const newAssignment: SceneAppearance = {
      id: `ASG_${sceneId}_${charId}_${Date.now()}`,
      sceneId,
      characterId: charId,
      characterName: char.name,
      costumeDayId: firstDay?.id || null,
      costumeLookId: firstDay?.costumeLookId || null,
      dayNumber: firstDay?.dayNumber || 1,
      displayLabel: firstDay?.displayLabel || "日替わり1",
      appearanceType: "実登場",
      variation: "",
      propsText: "",
      notes: "",
      sortOrder: assignments.filter((a) => a.sceneId === sceneId).length + 1,
    };

    const nextAssignments = [...assignments, newAssignment];
    setAssignments(nextAssignments);
    saveAll(scenes, nextAssignments);
  };

  // シーンからの登場人物割当解除（※人物自体は消去しない）
  const handleRemoveAssignment = (assignmentId: string) => {
    if (!confirm("このシーンから登場人物の割当を解除してもよろしいですか？（人物本体は削除されません）")) return;
    const nextAssignments = assignments.filter((a) => a.id !== assignmentId);
    setAssignments(nextAssignments);
    saveAll(scenes, nextAssignments);
  };

  // 割当の日替わり変更
  const handleChangeAssignmentDay = (
    assignmentId: string,
    costumeDayId: string
  ) => {
    const matchedDay = costumeDays.find((d) => d.id === costumeDayId);
    const nextAssignments = assignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          costumeDayId,
          costumeLookId: matchedDay?.costumeLookId || null,
          dayNumber: matchedDay?.dayNumber || null,
          displayLabel: matchedDay?.displayLabel || null,
        };
      }
      return a;
    });
    setAssignments(nextAssignments);
    saveAll(scenes, nextAssignments);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400 font-mono text-sm">
        シーンデータを読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 画面トップバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            SCENE（シーン別・衣装香盤）
          </h1>
          <span className="text-xs text-zinc-500 font-mono">
            (全 {scenes.length} シーン)
          </span>
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
              placeholder="シーン番号 / 場所 / 人物名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded text-xs pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-52"
            />
          </div>
        </div>
      </div>

      {/* シーン一覧 */}
      <div className="space-y-3">
        {filteredScenes.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-sm bg-zinc-900 border border-zinc-800 rounded-md">
            該当するシーンが見つかりません。
          </div>
        ) : (
          filteredScenes.map((scene) => {
            const isExpanded = expandedSceneId === scene.id;
            const sceneAssignments = assignments.filter(
              (a) => a.sceneId === scene.id
            );

            return (
              <div
                key={scene.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md transition-all overflow-hidden"
              >
                {/* シーンヘッダーバー */}
                <div
                  onClick={() =>
                    setExpandedSceneId(isExpanded ? null : scene.id)
                  }
                  className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-zinc-800/40 select-none"
                >
                  <div className="flex items-center gap-3">
                    {/* シーン番号バッジ */}
                    <div className="bg-amber-400 text-black font-mono font-black text-sm px-2.5 py-1 rounded tracking-wider flex items-center gap-1">
                      <span>S{scene.sceneNumber}</span>
                      {scene.dayNight && (
                        <span className="text-[10px] bg-black/20 px-1 py-0.2 rounded font-sans">
                          {scene.dayNight}
                        </span>
                      )}
                    </div>

                    {/* 場所 & 劇中日 */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{scene.location || "場所未定"}</span>
                      </div>
                      {scene.storyDate && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{scene.storyDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 登場人物バッジ一覧 */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 justify-end max-w-xl">
                    {sceneAssignments.map((asg) => (
                      <span
                        key={asg.id}
                        className="bg-zinc-950 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1"
                      >
                        <span className="font-bold text-zinc-100">
                          {asg.characterName}
                        </span>
                        <span className="text-amber-400 font-bold">
                          {asg.displayLabel || "未定"}
                        </span>
                      </span>
                    ))}
                    {sceneAssignments.length === 0 && (
                      <span className="text-zinc-600 text-xs italic">
                        登場人物未設定
                      </span>
                    )}

                    <div className="text-zinc-400 pl-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* シーン詳細展開エリア */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 p-4 bg-zinc-950/60 space-y-4">
                    {/* シーン内容・柱概要 */}
                    {scene.summary && (
                      <div className="text-xs text-zinc-300 bg-zinc-900/90 p-2.5 rounded border border-zinc-800 leading-relaxed">
                        <span className="font-mono text-zinc-500 font-bold mr-2">
                          場面内容:
                        </span>
                        {scene.summary}
                      </div>
                    )}

                    {/* 登場人物ごとの衣装カード */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                          このシーンの登場人物と衣装割当 ({sceneAssignments.length}名)
                        </p>

                        {/* 人物追加ドロップダウン */}
                        <div className="flex items-center gap-1.5">
                          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddCharacterToScene(
                                  scene.id,
                                  e.target.value
                                );
                                e.target.value = "";
                              }
                            }}
                            defaultValue=""
                            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                          >
                            <option value="" disabled>
                              + 人物をシーンに追加
                            </option>
                            {characters.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sceneAssignments.map((asg) => {
                          const charDays = costumeDays.filter(
                            (d) => d.characterId === asg.characterId
                          );
                          const matchedDay = costumeDays.find(
                            (d) => d.id === asg.costumeDayId
                          );
                          const matchedLook = costumeLooks.find(
                            (l) => l.id === matchedDay?.costumeLookId
                          );

                          return (
                            <div
                              key={asg.id}
                              className="bg-zinc-900 border border-zinc-800 rounded p-3 flex gap-3 items-start"
                            >
                              {/* 縦長衣装写真サムネイル (2:3) */}
                              <div className="w-16 flex-shrink-0">
                                <div className="costume-thumb-container border border-zinc-800">
                                  {matchedLook?.mainPhotoUrl ? (
                                    <Image
                                      src={matchedLook.mainPhotoUrl}
                                      alt={asg.characterName}
                                      fill
                                      className="costume-thumb-img"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                                      <Shirt className="w-4 h-4 stroke-1" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 右側: 人物情報 & 日替わり選択 */}
                              <div className="flex-1 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                                  <span className="font-bold text-zinc-100 text-sm">
                                    {asg.characterName}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleRemoveAssignment(asg.id)
                                    }
                                    title="このシーンから解除"
                                    className="text-zinc-500 hover:text-red-400 p-0.5 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* 日替わり変更セレクト */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-zinc-500 font-mono text-[11px]">
                                    日替わり:
                                  </span>
                                  <select
                                    value={asg.costumeDayId || ""}
                                    onChange={(e) =>
                                      handleChangeAssignmentDay(
                                        asg.id,
                                        e.target.value
                                      )
                                    }
                                    className="bg-zinc-950 border border-zinc-700 rounded px-2 py-0.5 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                                  >
                                    <option value="">(未設定)</option>
                                    {charDays.map((d) => (
                                      <option key={d.id} value={d.id}>
                                        {d.displayLabel}{" "}
                                        {d.storyDate ? `(${d.storyDate})` : ""}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* 紐づくLOOK情報 */}
                                <div className="text-[11px] text-zinc-400">
                                  <span className="text-zinc-500">LOOK: </span>
                                  <span className="font-mono text-zinc-300">
                                    {matchedLook?.lookCode || "未設定"}
                                  </span>
                                  {matchedLook?.title && (
                                    <span className="ml-1 text-zinc-400">
                                      ({matchedLook.title})
                                    </span>
                                  )}
                                </div>

                                {/* 日替わりの差分・持道具メモ */}
                                {matchedDay?.lookDiff && (
                                  <div className="text-[11px] text-amber-300/80 bg-amber-400/5 px-1.5 py-0.5 rounded border border-amber-400/20">
                                    差分: {matchedDay.lookDiff}
                                  </div>
                                )}
                                {matchedDay?.propsText && (
                                  <div className="text-[11px] text-zinc-400">
                                    持道具: {matchedDay.propsText}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
