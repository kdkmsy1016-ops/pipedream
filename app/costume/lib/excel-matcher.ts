import { Character, CostumeDay, CostumeLook, Scene } from "../types";

// シーン番号の正規化 (比較用: 全角半角統一、大文字小文字統一、前後のSや#や空白の除去)
export function normalizeSceneNumber(raw: string | number | undefined | null): string {
  if (raw === undefined || raw === null) return "";
  let s = String(raw).trim();
  // 全角英数字を半角に変換
  s = s.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
  // シーン、S#、S、s、# を除去
  s = s.replace(/^(シーン|SCENE|S#|S|s|#)\s*/i, "");
  return s.trim();
}

// キャラクター名の正規化 & 既存キャラクターとの類似度・候補照合
export function matchCharacter(
  rawName: string,
  existingCharacters: Character[]
): {
  matchedChar: Character | null;
  candidates: Character[];
  isExact: boolean;
} {
  const clean = rawName.trim().replace(/\s+/g, "");
  if (!clean) return { matchedChar: null, candidates: [], isExact: false };

  // 1. 完全一致
  const exact = existingCharacters.find(
    (c) =>
      c.name.trim().replace(/\s+/g, "") === clean ||
      (c.displayName && c.displayName.trim().replace(/\s+/g, "") === clean) ||
      c.characterCode.toLowerCase() === clean.toLowerCase()
  );
  if (exact) {
    return { matchedChar: exact, candidates: [exact], isExact: true };
  }

  // 2. 部分一致・前方後方一致 (例: "佐々木綾子" と "綾子", "如月桃華" と "桃華")
  const partials = existingCharacters.filter((c) => {
    const cName = c.name.trim().replace(/\s+/g, "");
    return clean.includes(cName) || cName.includes(clean);
  });

  if (partials.length > 0) {
    return {
      matchedChar: partials[0],
      candidates: partials,
      isExact: false,
    };
  }

  return { matchedChar: null, candidates: [], isExact: false };
}

// LOOK候補の照合
export function matchLook(
  rawLookText: string,
  characterLooks: CostumeLook[]
): {
  matchedLook: CostumeLook | null;
  candidates: CostumeLook[];
} {
  const clean = rawLookText.trim().replace(/\s+/g, "");
  if (!clean) return { matchedLook: null, candidates: [] };

  // LOOK 01などのコード一致
  const exactCode = characterLooks.find(
    (l) => l.lookCode.replace(/\s+/g, "").toLowerCase() === clean.toLowerCase()
  );
  if (exactCode) return { matchedLook: exactCode, candidates: [exactCode] };

  // タイトルや説明の部分一致
  const candidateList = characterLooks.filter((l) => {
    const t = (l.title || "").replace(/\s+/g, "");
    const d = (l.description || "").replace(/\s+/g, "");
    return (
      (t && (clean.includes(t) || t.includes(clean))) ||
      (d && (clean.includes(d) || d.includes(clean)))
    );
  });

  return {
    matchedLook: candidateList[0] || null,
    candidates: candidateList,
  };
}
