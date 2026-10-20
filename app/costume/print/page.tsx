"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Character,
  CostumeDay,
  CostumeLook,
  Scene,
  SceneAppearance,
  ShootingDay,
  ScheduleEntry,
} from "../../types";
import { Printer, User, Clapperboard, CalendarDays, Shirt } from "lucide-react";

export default function PrintPage() {
  const [data, setData] = useState<{
    characters: Character[];
    costumeDays: CostumeDay[];
    costumeLooks: CostumeLook[];
    scenes: Scene[];
    assignments: SceneAppearance[];
    shootingDays: ShootingDay[];
    scheduleEntries: ScheduleEntry[];
  } | null>(null);

  const [mode, setMode] = useState<"character" | "scene" | "schedule">(
    "character"
  );
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");

  useEffect(() => {
    fetch("/costume/api/data")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData.characters?.length > 0) {
          setSelectedTargetId(resData.characters[0].id);
        }
      });
  }, []);

  if (!data) {
    return (
      <div className="p-12 text-center text-zinc-500 font-mono text-xs">
        読み込み中...
      </div>
    );
  }

  const {
    characters,
    costumeDays,
    costumeLooks,
    scenes,
    assignments,
    shootingDays,
    scheduleEntries,
  } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 印刷コントローラー（print:hidden） */}
      <div className="no-print bg-zinc-900 border border-zinc-800 p-4 rounded-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h1 className="font-bold text-base tracking-wide">
              A4 印刷・PDF保存
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded transition-all active:scale-95 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>ブラウザ印刷 / PDF保存</span>
          </button>
        </div>

        {/* 出力モード切り替え */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">出力種別:</span>
          <button
            onClick={() => {
              setMode("character");
              if (characters.length > 0) setSelectedTargetId(characters[0].id);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
              mode === "character"
                ? "bg-amber-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            キャラクター別衣装香盤
          </button>
          <button
            onClick={() => {
              setMode("scene");
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
              mode === "scene"
                ? "bg-amber-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            シーン別衣装香盤
          </button>
          <button
            onClick={() => {
              setMode("schedule");
              if (shootingDays.length > 0)
                setSelectedTargetId(shootingDays[0].id);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
              mode === "schedule"
                ? "bg-amber-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            撮影日別衣装香盤
          </button>

          {/* 対象選択 */}
          {mode === "character" && (
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-amber-400 font-bold ml-2"
            >
              <option value="ALL">全キャラクター一括</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {mode === "schedule" && (
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-amber-400 font-bold ml-2"
            >
              {shootingDays.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.dayCode} ({d.shootDate})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 印刷用プレビューキャンバス（用紙シミュレーション） */}
      <div className="bg-white text-zinc-900 p-6 sm:p-8 rounded-md shadow-2xl print:p-0 print:shadow-none min-h-[1100px]">
        {/* 1. キャラクター別 A4 印刷 */}
        {mode === "character" && (
          <div className="space-y-8">
            {(selectedTargetId === "ALL"
              ? characters
              : characters.filter((c) => c.id === selectedTargetId)
            ).map((char, cIdx) => {
              const charDays = costumeDays
                .filter((d) => d.characterId === char.id)
                .sort((a, b) => a.sortOrder - b.sortOrder);

              return (
                <div
                  key={char.id}
                  className={`space-y-4 ${
                    cIdx > 0 ? "print-page-break pt-6" : ""
                  }`}
                >
                  {/* ヘッダー */}
                  <div className="border-b-2 border-black pb-2 flex justify-between items-baseline">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase block">
                        COSTUME CONTINUITY / CHARACTER
                      </span>
                      <h2 className="text-2xl font-black tracking-wide">
                        {char.name}
                        {char.actorName && (
                          <span className="text-sm font-normal text-zinc-600 ml-3">
                            (キャスト: {char.actorName})
                          </span>
                        )}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      映画『盈虚とパイプドリーム』衣装香盤
                    </span>
                  </div>

                  {/* 日替わりグリッド */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {charDays.map((day) => {
                      const look = costumeLooks.find(
                        (l) => l.id === day.costumeLookId
                      );

                      return (
                        <div
                          key={day.id}
                          className="print-break-avoid border border-zinc-300 rounded p-2.5 space-y-2 bg-zinc-50"
                        >
                          {/* 2:3 縦長サムネイル */}
                          <div className="costume-thumb-container bg-zinc-200 border border-zinc-300">
                            {look?.mainPhotoUrl ? (
                              <Image
                                src={look.mainPhotoUrl}
                                alt={day.displayLabel}
                                fill
                                className="costume-thumb-img"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                                <Shirt className="w-6 h-6 stroke-1" />
                                <span className="text-[9px] font-mono">
                                  NO PHOTO
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                              <span className="font-black text-sm">
                                {day.displayLabel}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-600">
                                {day.storyDate || "劇中日未定"}
                              </span>
                            </div>

                            <div className="text-[11px]">
                              <span className="font-bold text-zinc-700">
                                LOOK:{" "}
                              </span>
                              <span className="font-mono font-bold">
                                {look?.lookCode || "未設定"}
                              </span>
                              {look?.title && <span> ({look.title})</span>}
                            </div>

                            {day.lookDiff && (
                              <div className="text-[10px] bg-amber-50 border border-amber-200 p-1 rounded font-bold text-amber-900">
                                差分: {day.lookDiff}
                              </div>
                            )}

                            <div className="text-[10px] text-zinc-600">
                              <span className="font-bold">シーン: </span>
                              {day.scenes?.join(", ") || "-"}
                            </div>

                            {day.propsText && (
                              <div className="text-[10px] text-zinc-600">
                                <span className="font-bold">小道具: </span>
                                {day.propsText}
                              </div>
                            )}

                            {day.remarks && (
                              <div className="text-[9px] text-zinc-500 italic">
                                {day.remarks}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. シーン別 A4 印刷 */}
        {mode === "scene" && (
          <div className="space-y-4">
            <div className="border-b-2 border-black pb-2 flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase block">
                  COSTUME CONTINUITY / SCENES
                </span>
                <h2 className="text-2xl font-black tracking-wide">
                  シーン別衣装香盤一覧
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                映画『盈虚とパイプドリーム』
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-800 text-zinc-700 font-mono">
                  <th className="p-1.5 w-14">シーン</th>
                  <th className="p-1.5 w-12">D/N</th>
                  <th className="p-1.5 w-32">場所</th>
                  <th className="p-1.5 w-24">劇中日</th>
                  <th className="p-1.5">登場人物と衣装</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {scenes
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((scene) => {
                    const sceneAsgs = assignments.filter(
                      (a) => a.sceneId === scene.id
                    );

                    return (
                      <tr key={scene.id} className="print-break-avoid">
                        <td className="p-1.5 font-mono font-black text-sm">
                          S{scene.sceneNumber}
                        </td>
                        <td className="p-1.5 font-mono">{scene.dayNight || "-"}</td>
                        <td className="p-1.5 font-bold">{scene.location || "-"}</td>
                        <td className="p-1.5 font-mono text-zinc-600">
                          {scene.storyDate || "-"}
                        </td>
                        <td className="p-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            {sceneAsgs.map((asg) => (
                              <span
                                key={asg.id}
                                className="border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px]"
                              >
                                <span className="font-bold">
                                  {asg.characterName}
                                </span>
                                :{" "}
                                <span className="font-mono text-zinc-700">
                                  {asg.displayLabel || "未定"}
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. 撮影日別 A4 印刷 */}
        {mode === "schedule" && (
          <div className="space-y-4">
            {shootingDays
              .filter((d) => d.id === selectedTargetId)
              .map((day) => {
                const dayEntries = scheduleEntries
                  .filter((e) => e.shootingDayId === day.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder);

                return (
                  <div key={day.id} className="space-y-4">
                    <div className="border-b-2 border-black pb-2 flex justify-between items-baseline">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase block">
                          DAILY SHOOTING SCHEDULE / COSTUME
                        </span>
                        <h2 className="text-2xl font-black tracking-wide">
                          {day.dayCode} {day.dayLabel}
                        </h2>
                        <span className="text-xs text-zinc-600">
                          撮影日: {day.shootDate} | 場所: {day.locationNote || "-"}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">
                        映画『盈虚とパイプドリーム』
                      </span>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-zinc-800 text-zinc-700 font-mono">
                          <th className="p-1.5 w-10">順</th>
                          <th className="p-1.5 w-14">時刻</th>
                          <th className="p-1.5 w-16">シーン</th>
                          <th className="p-1.5 w-28">場所</th>
                          <th className="p-1.5">衣装・登場キャスト</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {dayEntries.map((entry, idx) => {
                          const matchedScene = scenes.find(
                            (s) =>
                              s.id === entry.sceneId ||
                              s.sceneNumber === entry.sceneId.replace(/^S/i, "")
                          );
                          const sceneAsgs = matchedScene
                            ? assignments.filter(
                                (a) => a.sceneId === matchedScene.id
                              )
                            : [];

                          return (
                            <tr key={entry.id} className="print-break-avoid">
                              <td className="p-1.5 font-mono font-bold">
                                #{idx + 1}
                              </td>
                              <td className="p-1.5 font-mono">
                                {entry.timeNote || "-"}
                              </td>
                              <td className="p-1.5 font-mono font-black text-sm">
                                S{matchedScene?.sceneNumber || entry.sceneId}
                              </td>
                              <td className="p-1.5">
                                {entry.location || matchedScene?.location || "-"}
                              </td>
                              <td className="p-1.5">
                                <div className="flex flex-wrap gap-1.5">
                                  {sceneAsgs.map((asg) => {
                                    const cDay = costumeDays.find(
                                      (d) => d.id === asg.costumeDayId
                                    );
                                    return (
                                      <span
                                        key={asg.id}
                                        className="border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px]"
                                      >
                                        <span className="font-bold">
                                          {asg.characterName}
                                        </span>
                                        : {cDay?.displayLabel || "未定"}
                                        {cDay?.lookDiff
                                          ? ` (${cDay.lookDiff})`
                                          : ""}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
