"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShootingDay,
  ScheduleEntry,
  Scene,
  SceneAppearance,
  CostumeDay,
  CostumeLook,
  Character,
} from "../../types";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertTriangle,
  Shirt,
  Search,
} from "lucide-react";

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [shootingDays, setShootingDays] = useState<ShootingDay[]>([]);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [assignments, setAssignments] = useState<SceneAppearance[]>([]);
  const [costumeDays, setCostumeDays] = useState<CostumeDay[]>([]);
  const [costumeLooks, setCostumeLooks] = useState<CostumeLook[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);

  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((data) => {
        setShootingDays(data.shootingDays || []);
        setScheduleEntries(data.scheduleEntries || []);
        setScenes(data.scenes || []);
        setAssignments(data.assignments || []);
        setCostumeDays(data.costumeDays || []);
        setCostumeLooks(data.costumeLooks || []);
        setCharacters(data.characters || []);

        if (data.shootingDays?.length > 0) {
          setSelectedDayId(data.shootingDays[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load schedule data:", err);
        setLoading(false);
      });
  }, []);

  const saveAll = async (updatedEntries = scheduleEntries) => {
    setSaving(true);
    try {
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleEntries: updatedEntries,
          shootingDays,
          scenes,
          assignments,
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

  const selectedDay = shootingDays.find((d) => d.id === selectedDayId);

  // 選択撮影日の撮影順エントリ一覧
  const currentEntries = scheduleEntries
    .filter((e) => e.shootingDayId === selectedDayId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // 撮影順の並び替え (↑ / ↓)
  const handleMoveEntry = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentEntries.length) return;

    const itemA = currentEntries[index];
    const itemB = currentEntries[targetIndex];

    const updated = scheduleEntries.map((e) => {
      if (e.id === itemA.id) return { ...e, sortOrder: itemB.sortOrder };
      if (e.id === itemB.id) return { ...e, sortOrder: itemA.sortOrder };
      return e;
    });

    setScheduleEntries(updated);
    saveAll(updated);
  };

  // エントリ手動編集 (時刻、場所、備考)
  const handleUpdateEntry = (
    entryId: string,
    fields: Partial<ScheduleEntry>
  ) => {
    const updated = scheduleEntries.map((e) =>
      e.id === entryId ? { ...e, ...fields } : e
    );
    setScheduleEntries(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400 font-mono text-sm">
        撮影スケジュールを読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 画面トップバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-base tracking-wide">
            SCHEDULE（撮影日別・衣装香盤）
          </h1>
          {saving && (
            <span className="text-xs text-amber-400 animate-pulse font-mono">
              [保存中...]
            </span>
          )}
        </div>

        {/* 撮影日切り替えタブ */}
        <div className="flex flex-wrap items-center gap-1.5">
          {shootingDays.map((day) => {
            const isSelected = day.id === selectedDayId;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "bg-amber-400 text-black shadow-sm"
                    : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {day.dayCode}
                <span className="text-[10px] ml-1 opacity-80 hidden sm:inline">
                  ({day.shootDate.slice(5)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択撮影日の概要 */}
      {selectedDay && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-amber-400 font-mono">
                {selectedDay.dayCode}
              </span>
              <span>{selectedDay.dayLabel}</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              撮影日: {selectedDay.shootDate} / 予定: {currentEntries.length}{" "}
              シーン
            </span>
          </div>
          {selectedDay.locationNote && (
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{selectedDay.locationNote}</span>
            </p>
          )}
        </div>
      )}

      {/* 撮影順タイムライン一覧（衣装自動引き当て & 衣装替え自動ハイライト） */}
      <div className="space-y-3">
        {currentEntries.map((entry, index) => {
          // シーン番号から該当シーンを取得
          const matchedScene = scenes.find(
            (s) =>
              s.id === entry.sceneId ||
              s.sceneNumber === entry.sceneId.replace(/^S/i, "")
          );

          // シーンに登場するキャラクターと衣装割当を取得
          const sceneAssignments = matchedScene
            ? assignments.filter((a) => a.sceneId === matchedScene.id)
            : [];

          // 【衣装替え検知ロジック】
          // 直前の撮影シーンに登場していたキャラクターの中で、今回のシーンでLOOKまたは日替わりが異なる人物を特定
          let costumeChanges: string[] = [];
          if (index > 0) {
            const prevEntry = currentEntries[index - 1];
            const prevScene = scenes.find(
              (s) =>
                s.id === prevEntry.sceneId ||
                s.sceneNumber === prevEntry.sceneId.replace(/^S/i, "")
            );
            if (prevScene) {
              const prevAssignments = assignments.filter(
                (a) => a.sceneId === prevScene.id
              );

              sceneAssignments.forEach((currAsg) => {
                const prevAsg = prevAssignments.find(
                  (p) => p.characterId === currAsg.characterId
                );
                // 前シーンにも登場しており、日替わりIDまたはLOOKが異なれば衣装替え
                if (
                  prevAsg &&
                  (prevAsg.costumeDayId !== currAsg.costumeDayId ||
                    prevAsg.costumeLookId !== currAsg.costumeLookId)
                ) {
                  const currDay = costumeDays.find(
                    (d) => d.id === currAsg.costumeDayId
                  );
                  costumeChanges.push(
                    `${currAsg.characterName}（${currDay?.displayLabel || "新衣装"}へ）`
                  );
                }
              });
            }
          }

          return (
            <div key={entry.id} className="space-y-2">
              {/* 衣装替えアラートバッジ（シーン間） */}
              {costumeChanges.length > 0 && (
                <div className="bg-amber-400 text-black px-3 py-1.5 rounded font-mono font-bold text-xs flex items-center justify-between border-2 border-amber-300 shadow-md animate-fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 fill-black text-amber-400" />
                    <span>【⚠️ 衣装替えあり】</span>
                    <span>{costumeChanges.join("、")}</span>
                  </div>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded">
                    第 {index + 1} 順目
                  </span>
                </div>
              )}

              {/* シーン香盤カード */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 transition-all hover:border-zinc-700 space-y-3">
                {/* エントリヘッダー: 撮影順 / 時間 / シーン番号 / 操作 */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-3">
                    {/* 撮影順 */}
                    <span className="font-mono font-bold text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>

                    {/* シーン番号 */}
                    <div className="bg-amber-400 text-black font-mono font-black text-sm px-2.5 py-0.5 rounded tracking-wider flex items-center gap-1">
                      <span>S{matchedScene?.sceneNumber || entry.sceneId}</span>
                      {matchedScene?.dayNight && (
                        <span className="text-[10px] bg-black/20 px-1 rounded font-sans">
                          {matchedScene.dayNight}
                        </span>
                      )}
                    </div>

                    {/* 開始時刻 */}
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="例: 09:00"
                        value={entry.timeNote || ""}
                        onChange={(e) =>
                          handleUpdateEntry(entry.id, {
                            timeNote: e.target.value,
                          })
                        }
                        onBlur={() => saveAll()}
                        className="bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-300 w-20 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {/* 場所 */}
                    <div className="flex items-center gap-1 text-xs text-zinc-300 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{entry.location || matchedScene?.location || "場所未定"}</span>
                    </div>
                  </div>

                  {/* 撮影順並び替え (↑ / ↓) */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveEntry(index, "up")}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 text-xs"
                      title="撮影順を上げる"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === currentEntries.length - 1}
                      onClick={() => handleMoveEntry(index, "down")}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 text-xs"
                      title="撮影順を下げる"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 撮影内容 / ト書き */}
                {(entry.sceneAction || matchedScene?.summary) && (
                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-500 font-bold mr-1">内容:</span>
                    {entry.sceneAction || matchedScene?.summary}
                  </p>
                )}

                {/* 登場人物と衣装カード（横並びまたはグリッド） */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    登場人物の衣装 ({sceneAssignments.length}名)
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {sceneAssignments.map((asg) => {
                      const matchedDay = costumeDays.find(
                        (d) => d.id === asg.costumeDayId
                      );
                      const matchedLook = costumeLooks.find(
                        (l) => l.id === matchedDay?.costumeLookId
                      );

                      return (
                        <div
                          key={asg.id}
                          className="bg-zinc-950 border border-zinc-800 rounded p-2 flex flex-col justify-between space-y-1.5"
                        >
                          {/* 2:3 縦長写真サムネイル */}
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

                          <div className="space-y-0.5 text-center">
                            <p className="font-bold text-xs text-zinc-100 truncate">
                              {asg.characterName}
                            </p>
                            <p className="text-[11px] font-mono font-bold text-amber-400 truncate">
                              {matchedDay?.displayLabel || "未定"}
                            </p>
                            {matchedLook?.lookCode && (
                              <p className="text-[10px] font-mono text-zinc-400 truncate">
                                {matchedLook.lookCode}
                              </p>
                            )}
                            {matchedDay?.lookDiff && (
                              <p className="text-[9px] text-amber-200/90 truncate bg-amber-400/10 rounded px-1">
                                {matchedDay.lookDiff}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
