"use client";

import { useEffect, useState, useRef } from "react";
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
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

interface UploadingQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "uploading" | "done" | "error";
  progressText: string;
  uploadedUrl?: string;
  // 設定
  action: "create_new_look" | "add_to_existing_look";
  characterId: string;
  characterTag: string;
  lookTitle: string;
  targetLookId: string;
  makeMain: boolean;
  category: "full_body" | "upper_body" | "shoes" | "accessory" | "prop" | "makeup" | "unclassified";
}

export default function LooksLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [looks, setLooks] = useState<CostumeLook[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [costumeDays, setCostumeDays] = useState<CostumeDay[]>([]);
  const [assignments, setAssignments] = useState<SceneAppearance[]>([]);

  // フィルタ・検索
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // アップロードモーダル状態
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadingQueueItem[]>([]);
  const [bulkCharId, setBulkCharId] = useState<string>("KEEP");
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [uploadOverallProgress, setUploadOverallProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拡大写真モーダル (左右スワイプ対応)
  const [lightboxState, setLightboxState] = useState<{
    photos: string[];
    index: number;
    title?: string;
  } | null>(null);

  // LOOK詳細・編集モーダル
  const [editingLook, setEditingLook] = useState<CostumeLook | null>(null);

  // 日替わりへの割り当てモーダル
  const [assignDayModal, setAssignDayModal] = useState<{
    look: CostumeLook;
    selectedDayIds: string[];
  } | null>(null);

  // LOOK削除の警告モーダル
  const [deleteLookModal, setDeleteLookModal] = useState<{
    look: CostumeLook;
    usedDays: CostumeDay[];
    usedAssignments: SceneAppearance[];
  } | null>(null);

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

  const saveAll = async (
    updatedLooks = looks,
    updatedDays = costumeDays,
    updatedAssignments = assignments
  ) => {
    setSaving(true);
    try {
      await fetch("/costume/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costumeLooks: updatedLooks,
          costumeDays: updatedDays,
          assignments: updatedAssignments,
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

    if (selectedTag !== "ALL" && tagName !== selectedTag) return false;

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

  // ==========================================
  // 【A】ブラウザ直接アップロード処理
  // ==========================================
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadingQueueItem[] = [];
    let hasHeic = false;

    // 現在選択中のタグがあればそれを初期キャラクターに設定
    const defaultCharId =
      selectedTag !== "ALL" && selectedTag !== "未分類"
        ? (characters.find((c) => c.name === selectedTag)?.id || "UNCLASSIFIED")
        : "UNCLASSIFIED";
    const defaultChar = characters.find((c) => c.id === defaultCharId);
    const defaultTag = defaultChar ? defaultChar.name : "未分類";

    Array.from(files).forEach((file) => {
      // HEIC判定
      if (/\.(heic|heif)$/i.test(file.name) || file.type.includes("heic")) {
        hasHeic = true;
        return;
      }

      // 対応拡張子: jpg, jpeg, png, webp, gif
      if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(file.name) && !file.type.startsWith("image/")) {
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `QUEUE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl,
        status: "idle",
        progressText: "待機中",
        action: "create_new_look",
        characterId: defaultCharId,
        characterTag: defaultTag,
        lookTitle: "",
        targetLookId: "",
        makeMain: true,
        category: "full_body",
      });
    });

    if (hasHeic) {
      alert("⚠️ HEIC形式の画像が含まれています。iPhoneの「設定 > カメラ > フォーマット」で互換性優先（JPEG）にするか、JPEGに変換して選択してください。");
    }

    if (newItems.length > 0) {
      setUploadQueue((prev) => [...prev, ...newItems]);
      setUploadModalOpen(true);
    }
  };

  // 一括キャラクタータグ設定
  const handleApplyBulkCharacter = (targetCharId: string) => {
    setBulkCharId(targetCharId);
    if (targetCharId === "KEEP") return;

    const char = characters.find((c) => c.id === targetCharId);
    const tagName = char ? char.name : "未分類";

    setUploadQueue((prev) =>
      prev.map((item) => ({
        ...item,
        characterId: targetCharId,
        characterTag: tagName,
      }))
    );
  };

  // アップロード実行（1画像ずつ直接APIアップロードし、進捗表示）
  const handleStartUploadQueue = async () => {
    if (uploadQueue.length === 0 || isUploadingBatch) return;
    setIsUploadingBatch(true);

    const total = uploadQueue.length;
    let completedCount = 0;
    let errorCount = 0;

    const uploadedResults: any[] = [];

    for (let i = 0; i < total; i++) {
      const item = uploadQueue[i];
      if (item.status === "done" && item.uploadedUrl) {
        uploadedResults.push({
          photoUrl: item.uploadedUrl,
          action: item.action,
          characterId: item.characterId,
          characterTag: item.characterTag,
          lookTitle: item.lookTitle,
          targetLookId: item.targetLookId,
          makeMain: item.makeMain,
          category: item.category,
          fileName: item.file.name,
          fileSize: item.file.size,
          mimeType: item.file.type,
        });
        completedCount++;
        continue;
      }

      setUploadOverallProgress(`アップロード中 ${i + 1} / ${total}`);
      setUploadQueue((prev) =>
        prev.map((q, idx) =>
          idx === i ? { ...q, status: "uploading", progressText: "送信中..." } : q
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("category", "looks");

        const uploadRes = await fetch("/costume/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        const photoUrl = uploadData.url;

        setUploadQueue((prev) =>
          prev.map((q, idx) =>
            idx === i
              ? {
                  ...q,
                  status: "done",
                  progressText: "完了",
                  uploadedUrl: photoUrl,
                }
              : q
          )
        );

        uploadedResults.push({
          photoUrl,
          action: item.action,
          characterId: item.characterId,
          characterTag: item.characterTag,
          lookTitle: item.lookTitle,
          targetLookId: item.targetLookId,
          makeMain: item.makeMain,
          category: item.category,
          fileName: item.file.name,
          fileSize: item.file.size,
          mimeType: item.file.type,
        });
        completedCount++;
      } catch (err) {
        console.error("Item upload error:", err);
        errorCount++;
        setUploadQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: "error", progressText: "失敗" } : q
          )
        );
      }
    }

    // 成功した画像を共通LOOK登録APIへ一括送信
    if (uploadedResults.length > 0) {
      setUploadOverallProgress("LOOKをデータベースへ登録中...");
      try {
        const regRes = await fetch("/costume/api/looks/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: uploadedResults }),
        });
        const regData = await regRes.json();
        if (regData.success) {
          loadData();
          if (errorCount === 0) {
            setUploadModalOpen(false);
            setUploadQueue([]);
          }
        }
      } catch (e) {
        console.error("Failed to register looks:", e);
      }
    }

    setUploadOverallProgress(
      errorCount === 0
        ? `✅ 全 ${completedCount} 件の登録が完了しました！`
        : `⚠️ ${completedCount}件成功 / ${errorCount}件失敗（失敗した項目は再試行可能）`
    );
    setIsUploadingBatch(false);
  };

  // ==========================================
  // 【B】LOOK管理機能 (複製、並び替え、タグ変更、削除、日替わり割当)
  // ==========================================

  // 1. LOOK複製
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

  // 2. LOOK並び替え (↑ / ↓)
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

  // 3. キャラクタータグの変更
  const requestChangeTag = (lookId: string, newCharId: string) => {
    const look = looks.find((l) => l.id === lookId);
    if (!look) return;

    const newChar = characters.find((c) => c.id === newCharId);
    const newCharName = newChar ? newChar.name : "未分類";

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

  // 4. LOOK削除（使用中チェック）
  const requestDeleteLook = (look: CostumeLook) => {
    const usedDays = costumeDays.filter((d) => d.costumeLookId === look.id);
    const usedAssignments = assignments.filter((a) => a.costumeLookId === look.id);

    if (usedDays.length > 0 || usedAssignments.length > 0) {
      setDeleteLookModal({
        look,
        usedDays,
        usedAssignments,
      });
    } else {
      if (confirm(`衣装「${look.lookCode} : ${look.title || "名称未定"}」を削除してもよろしいですか？`)) {
        executeDeleteLook(look.id);
      }
    }
  };

  const executeDeleteLook = (lookId: string) => {
    const nextLooks = looks.filter((l) => l.id !== lookId);
    const nextDays = costumeDays.map((d) =>
      d.costumeLookId === lookId ? { ...d, costumeLookId: null } : d
    );
    const nextAsgs = assignments.map((a) =>
      a.costumeLookId === lookId ? { ...a, costumeLookId: null } : a
    );

    setLooks(nextLooks);
    setCostumeDays(nextDays);
    setAssignments(nextAsgs);
    saveAll(nextLooks, nextDays, nextAsgs);
    setDeleteLookModal(null);
    if (editingLook?.id === lookId) setEditingLook(null);
  };

  // 5. 日替わりへの割り当て実行
  const handleExecuteAssignDay = (lookId: string, selectedDayIds: string[]) => {
    // 既存の日替わりでこのLOOKを持っていたものを解除、または新しく付与
    const nextDays = costumeDays.map((d) => {
      const isSelected = selectedDayIds.includes(d.id);
      if (isSelected) {
        return { ...d, costumeLookId: lookId };
      } else if (d.costumeLookId === lookId) {
        return { ...d, costumeLookId: null };
      }
      return d;
    });

    // シーン側も連動更新
    const nextAsgs = assignments.map((a) => {
      const matchedDay = nextDays.find((d) => d.id === a.costumeDayId);
      if (matchedDay) {
        return { ...a, costumeLookId: matchedDay.costumeLookId };
      }
      return a;
    });

    setCostumeDays(nextDays);
    setAssignments(nextAsgs);
    saveAll(looks, nextDays, nextAsgs);
    setAssignDayModal(null);
  };

  // 6. LOOK統合
  const executeMergeLooks = async (sourceId: string, targetId: string) => {
    const source = looks.find((l) => l.id === sourceId);
    const target = looks.find((l) => l.id === targetId);
    if (!source || !target) return;

    const mergedPhotos = Array.from(
      new Set([...(target.photos || []), ...(source.photos || [])])
    );
    const mainPhotoUrl = target.mainPhotoUrl || source.mainPhotoUrl;

    const updatedTarget: CostumeLook = {
      ...target,
      mainPhotoUrl,
      photos: mergedPhotos,
    };

    const updatedDays = costumeDays.map((d) =>
      d.costumeLookId === sourceId ? { ...d, costumeLookId: targetId } : d
    );
    const updatedAsgs = assignments.map((a) =>
      a.costumeLookId === sourceId ? { ...a, costumeLookId: targetId } : a
    );

    const remainingLooks = looks
      .filter((l) => l.id !== sourceId)
      .map((l) => (l.id === targetId ? updatedTarget : l));

    setLooks(remainingLooks);
    setCostumeDays(updatedDays);
    setAssignments(updatedAsgs);

    await saveAll(remainingLooks, updatedDays, updatedAsgs);
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
      {/* 隠しファイルインプット */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

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
              className="bg-zinc-950 border border-zinc-700 rounded text-xs pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-44 sm:w-52"
            />
          </div>

          {/* ★【要件1】画像追加ボタン（基本入口） */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3.5 py-1.5 rounded transition-all active:scale-95 shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>＋ 画像を追加</span>
          </button>
        </div>
      </div>

      {/* ドラッグ＆ドロップ受け付けエリア（コンパクト表示） */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-zinc-800 hover:border-amber-400/60 bg-zinc-950/60 p-4 rounded-md text-center cursor-pointer transition-colors"
      >
        <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>
            ここに衣装写真をドラッグ＆ドロップ、またはタップして複数選択（.jpg, .png, .webp対応）
          </span>
        </p>
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
          <div className="p-12 text-center text-zinc-500 font-mono text-xs bg-zinc-900 border border-zinc-800 rounded-md space-y-2">
            <Shirt className="w-8 h-8 text-zinc-600 mx-auto stroke-1" />
            <p>衣装LOOKがまだ登録されていません。</p>
            <p className="text-[11px] text-zinc-600">
              上部の「＋ 画像を追加」から写真をアップロードすると、自動でLOOKが登録されます。
            </p>
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
                                className="costume-thumb-img cursor-pointer"
                                onClick={() =>
                                  setLightboxState({
                                    photos: look.photos && look.photos.length > 0 ? look.photos : [look.mainPhotoUrl!],
                                    index: 0,
                                    title: `${look.lookCode} : ${look.title || "衣装"}`,
                                  })
                                }
                              />
                              <button
                                onClick={() =>
                                  setLightboxState({
                                    photos: look.photos && look.photos.length > 0 ? look.photos : [look.mainPhotoUrl!],
                                    index: 0,
                                    title: `${look.lookCode} : ${look.title || "衣装"}`,
                                  })
                                }
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
                              <button
                                onClick={() => requestDeleteLook(look)}
                                title="LOOKを削除"
                                className="p-0.5 rounded bg-red-950/40 hover:bg-red-900 text-red-300 text-[10px]"
                              >
                                <Trash2 className="w-3 h-3" />
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

                          {/* 日替わりへの割り当てボタン */}
                          <div className="pt-1">
                            <button
                              onClick={() => {
                                const matchedDayIds = costumeDays
                                  .filter((d) => d.costumeLookId === look.id)
                                  .map((d) => d.id);
                                setAssignDayModal({
                                  look,
                                  selectedDayIds: matchedDayIds,
                                });
                              }}
                              className="w-full py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                            >
                              <Calendar className="w-3 h-3 text-amber-400" />
                              <span>日替わりへ割当 ({usedDays.length})</span>
                            </button>
                          </div>

                          {/* 使用状況 & 統合リンク */}
                          <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1 border-t border-zinc-800/80">
                            <span>シーン: {usedAsgs.length}件</span>
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
                              <span>統合</span>
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

      {/* ======================================================== */}
      {/* ［アップロード・プレビュー・登録モーダル］ */}
      {/* ======================================================== */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-md max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl my-auto max-h-[92vh] flex flex-col justify-between">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base text-zinc-100">
                  画像アップロードプレビュー（全 {uploadQueue.length} 枚）
                </h3>
              </div>
              <button
                disabled={isUploadingBatch}
                onClick={() => {
                  setUploadModalOpen(false);
                  setUploadQueue([]);
                }}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 一括操作バー */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-400 font-bold">
                  選択画像をすべて一括設定:
                </span>
                <select
                  value={bulkCharId}
                  onChange={(e) => handleApplyBulkCharacter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-amber-400 font-bold text-xs"
                >
                  <option value="KEEP">(個別設定を維持)</option>
                  <option value="UNCLASSIFIED">未分類</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                >
                  ＋ さらに画像を追加
                </button>
              </div>
            </div>

            {/* プレビューグリッド一覧 */}
            <div className="overflow-y-auto max-h-[50vh] pr-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {uploadQueue.map((item, idx) => {
                  const charLooks = looks.filter(
                    (l) => l.characterId === item.characterId
                  );

                  return (
                    <div
                      key={item.id}
                      className="bg-zinc-950 border border-zinc-800 rounded p-2.5 flex gap-2.5 items-start text-xs relative"
                    >
                      {/* サムネイル */}
                      <div className="w-20 flex-shrink-0">
                        <div className="costume-thumb-container border border-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="costume-thumb-img"
                          />
                        </div>
                        <span
                          className={`text-[9px] block text-center font-mono mt-1 px-1 py-0.5 rounded ${
                            item.status === "done"
                              ? "bg-emerald-950 text-emerald-400"
                              : item.status === "error"
                              ? "bg-red-950 text-red-400"
                              : item.status === "uploading"
                              ? "bg-amber-950 text-amber-400 animate-pulse"
                              : "bg-zinc-900 text-zinc-500"
                          }`}
                        >
                          {item.progressText}
                        </span>
                      </div>

                      {/* 設定フォーム */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[11px] text-zinc-400 truncate max-w-[140px]">
                            {item.file.name}
                          </p>
                          <button
                            disabled={isUploadingBatch}
                            onClick={() =>
                              setUploadQueue((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-zinc-600 hover:text-red-400 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* キャラクター選択 */}
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-zinc-500 font-mono block">
                            キャラクター:
                          </label>
                          <select
                            value={item.characterId}
                            onChange={(e) => {
                              const newCharId = e.target.value;
                              const char = characters.find((c) => c.id === newCharId);
                              setUploadQueue((prev) =>
                                prev.map((q, i) =>
                                  i === idx
                                    ? {
                                        ...q,
                                        characterId: newCharId,
                                        characterTag: char ? char.name : "未分類",
                                        targetLookId: "",
                                      }
                                    : q
                                )
                              );
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                          >
                            <option value="UNCLASSIFIED">未分類</option>
                            {characters.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 登録方法（新規LOOK / 既存LOOKに追加） */}
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-zinc-500 font-mono block">
                            登録方法:
                          </label>
                          <select
                            value={item.action}
                            onChange={(e) =>
                              setUploadQueue((prev) =>
                                prev.map((q, i) =>
                                  i === idx
                                    ? { ...q, action: e.target.value as any }
                                    : q
                                )
                              )
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-[11px] text-zinc-200"
                          >
                            <option value="create_new_look">★ 新規LOOKとして登録</option>
                            <option value="add_to_existing_look">既存LOOKへ追加写真登録</option>
                          </select>
                        </div>

                        {/* 新規LOOK名称 or 既存LOOK選択 */}
                        {item.action === "create_new_look" ? (
                          <input
                            type="text"
                            placeholder="LOOK名 (任意)..."
                            value={item.lookTitle}
                            onChange={(e) =>
                              setUploadQueue((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, lookTitle: e.target.value } : q
                                )
                              )
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[11px] text-zinc-300"
                          />
                        ) : (
                          <select
                            value={item.targetLookId}
                            onChange={(e) =>
                              setUploadQueue((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, targetLookId: e.target.value } : q
                                )
                              )
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-[11px] text-amber-400 font-mono"
                          >
                            <option value="">(追加先LOOKを選択)</option>
                            {charLooks.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.lookCode} : {l.title || "名称未定"}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* モーダルフッター（確定ボタン & 進捗） */}
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-mono text-zinc-400">
                {uploadOverallProgress || `準備完了: 全 ${uploadQueue.length} 枚`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={isUploadingBatch}
                  onClick={() => {
                    setUploadModalOpen(false);
                    setUploadQueue([]);
                  }}
                  className="px-3 py-2 rounded text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  キャンセル
                </button>

                <button
                  disabled={isUploadingBatch || uploadQueue.length === 0}
                  onClick={handleStartUploadQueue}
                  className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2 rounded shadow-lg transition-all active:scale-95 disabled:opacity-40"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {isUploadingBatch
                      ? "アップロード中..."
                      : `全 ${uploadQueue.length} 枚をまとめて登録`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ［日替わりへの割り当てモーダル］ */}
      {/* ======================================================== */}
      {assignDayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-md max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Calendar className="w-5 h-5" />
              <h3 className="font-bold text-sm">
                日替わりへの衣装LOOK割り当て
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              「
              <span className="font-bold text-amber-400">
                {assignDayModal.look.lookCode} : {assignDayModal.look.title || "衣装"}
              </span>
              」を割り当てる日替わりを選択してください。同じLOOKを複数の日替わりで使用できます。
            </p>

            {/* 対象キャラクターの日替わりチェックボックス一覧 */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 max-h-60 overflow-y-auto space-y-2 text-xs">
              {costumeDays
                .filter((d) =>
                  assignDayModal.look.characterId === "UNCLASSIFIED"
                    ? true
                    : d.characterId === assignDayModal.look.characterId
                )
                .map((day) => {
                  const isChecked = assignDayModal.selectedDayIds.includes(day.id);
                  const char = characters.find((c) => c.id === day.characterId);

                  return (
                    <label
                      key={day.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer border transition-colors ${
                        isChecked
                          ? "bg-amber-400/10 border-amber-400/40 text-amber-200"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const nextIds = e.target.checked
                              ? [...assignDayModal.selectedDayIds, day.id]
                              : assignDayModal.selectedDayIds.filter((id) => id !== day.id);
                            setAssignDayModal({
                              ...assignDayModal,
                              selectedDayIds: nextIds,
                            });
                          }}
                          className="rounded text-amber-400"
                        />
                        <span className="font-bold">
                          [{char?.name || "未分類"}] {day.displayLabel}
                        </span>
                        {day.storyDate && (
                          <span className="text-[11px] font-mono text-zinc-500">
                            ({day.storyDate})
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-zinc-500">
                        {day.scenes?.length ? `S: ${day.scenes.join(",")}` : "シーン未設定"}
                      </div>
                    </label>
                  );
                })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAssignDayModal(null)}
                className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                キャンセル
              </button>
              <button
                onClick={() =>
                  handleExecuteAssignDay(
                    assignDayModal.look.id,
                    assignDayModal.selectedDayIds
                  )
                }
                className="px-4 py-1.5 rounded text-xs bg-amber-400 hover:bg-amber-300 text-black font-bold"
              >
                割り当てを確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ［LOOK削除の警告モーダル］ */}
      {/* ======================================================== */}
      {deleteLookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-700/60 rounded-md max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">
                衣装LOOK削除の警告（使用中）
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              「
              <span className="font-bold text-red-400">
                {deleteLookModal.look.lookCode} : {deleteLookModal.look.title || "衣装"}
              </span>
              」は現在、以下の日替わりまたはシーンで使用されています。削除すると、該当箇所からこのLOOKの割り当てが解除されます。
            </p>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs space-y-1 font-mono text-zinc-400 max-h-36 overflow-y-auto">
              <p className="font-bold text-zinc-300">使用中の日替わり:</p>
              {deleteLookModal.usedDays.map((d) => (
                <p key={d.id} className="pl-2">
                  • {d.displayLabel} (劇中日: {d.storyDate || "未定"})
                </p>
              ))}
              <p className="font-bold text-zinc-300 pt-1">使用中のシーン:</p>
              <div className="flex flex-wrap gap-1 pl-2">
                {deleteLookModal.usedAssignments.map((a) => (
                  <span
                    key={a.id}
                    className="bg-zinc-900 border border-zinc-700 px-1 rounded text-[10px]"
                  >
                    S{a.sceneId.replace(/^S/i, "")}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteLookModal(null)}
                className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                キャンセル
              </button>
              <button
                onClick={() => executeDeleteLook(deleteLookModal.look.id)}
                className="px-3 py-1.5 rounded text-xs bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                解除して削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ［タグ変更警告モーダル］ */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* ［LOOK統合モーダル］ */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* ［拡大写真モーダル (左右送り対応)］ */}
      {/* ======================================================== */}
      {lightboxState && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-4 select-none"
          onClick={() => setLightboxState(null)}
        >
          <div
            className="relative max-w-3xl max-h-[92vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上部バー */}
            <div className="w-full flex items-center justify-between text-zinc-300 text-xs pb-2">
              <span className="font-mono font-bold text-amber-400">
                {lightboxState.title}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-500">
                  {lightboxState.index + 1} / {lightboxState.photos.length}
                </span>
                <button
                  onClick={() => setLightboxState(null)}
                  className="p-1 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 写真本体 */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxState.photos[lightboxState.index]}
                alt="拡大写真"
                className="max-w-full max-h-[82vh] object-contain rounded shadow-2xl"
              />

              {/* 前へ */}
              {lightboxState.photos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxState((prev) =>
                      prev
                        ? {
                            ...prev,
                            index:
                              (prev.index - 1 + prev.photos.length) %
                              prev.photos.length,
                          }
                        : null
                    );
                  }}
                  className="absolute left-2 p-2 rounded-full bg-black/60 hover:bg-black text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* 次へ */}
              {lightboxState.photos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxState((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index + 1) % prev.photos.length,
                          }
                        : null
                    );
                  }}
                  className="absolute right-2 p-2 rounded-full bg-black/60 hover:bg-black text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
