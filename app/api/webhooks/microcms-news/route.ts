import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getNewsDetail } from "@/app/lib/microcms";
import { buildXPostText, postTweetToX } from "@/app/lib/twitter";

export const runtime = "nodejs";

const SITE_ORIGIN = "https://www.eikyo-to-pipedream.com";

// 重複投稿防止用インメモリLRUキャッシュ (contentId + timestamp)
// 同一インスタンス内での短時間リトライ重複を防ぎます
const processedEvents = new Map<string, number>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24時間保持

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, timestamp] of processedEvents.entries()) {
    if (now - timestamp > CACHE_TTL_MS) {
      processedEvents.delete(key);
    }
  }
}

/**
 * microCMS Webhookのリクエスト検証
 * 1. 署名ヘッダー (X-MICROCMS-Signature) によるHMAC-SHA256検証
 * 2. または設定されたシークレットヘッダー (X-MICROCMS-SECRET / Authorization) による検証
 */
function verifyWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secretHeader: string | null,
  expectedSecret: string
): boolean {
  if (!expectedSecret) return false;

  // 方式A: 署名ヘッダーがある場合はHMAC-SHA256検証
  if (signatureHeader) {
    const expectedSignature = crypto
      .createHmac("sha256", expectedSecret)
      .update(rawBody)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature)
    );
  }

  // 方式B: シークレットがカスタムヘッダーとして渡された場合の一致検証
  if (secretHeader) {
    return secretHeader === expectedSecret;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.MICROCMS_WEBHOOK_SECRET;

  // 1. Webhook Secretの存在確認
  if (!expectedSecret) {
    console.error("[Webhook Error] MICROCMS_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Server webhook configuration error" },
      { status: 500 }
    );
  }

  // 2. リクエストボディの取得
  let rawBody: string;
  let payload: Record<string, unknown>;
  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("[Webhook Error] Failed to parse request JSON body:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 3. Webhook保護: Secret照合
  const signatureHeader = req.headers.get("x-microcms-signature");
  const secretHeader =
    req.headers.get("x-microcms-secret") || req.headers.get("x-webhook-secret");

  const isVerified = verifyWebhook(
    rawBody,
    signatureHeader,
    secretHeader,
    expectedSecret
  );

  if (!isVerified) {
    console.warn("[Webhook Warning] Unauthorized webhook request rejected.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. microCMSイベントとAPI識別
  // microCMS公式Webhook形式:
  // {
  //   service: "eikyo",
  //   api: "news",
  //   id: "contentId",
  //   type: "new" | "edit" | "delete",
  //   contents: { new: { ... }, old: { ... } }
  // }
  const api = payload.api as string | undefined;
  const contentId = payload.id as string | undefined;
  const eventType = payload.type as string | undefined;

  // news API以外はスキップ
  if (api && api !== "news") {
    return NextResponse.json({
      message: `Ignored webhook for non-news API: ${api}`,
    });
  }

  if (!contentId) {
    return NextResponse.json(
      { error: "contentId (id) is missing in payload" },
      { status: 400 }
    );
  }

  // 5. 新規公開イベントの厳格な判定
  // microCMS公式仕様:
  // - 新規作成・新規公開時: type === "new"
  // - 編集時: type === "edit"
  // - 削除時: type === "delete"
  if (eventType !== "new") {
    console.log(
      `[Webhook Info] Skipped: event type is "${eventType}" (not "new") for contentId=${contentId}`
    );
    return NextResponse.json({
      message: `Skipped: event is '${eventType}', not a new publish event.`,
      contentId,
    });
  }

  // 6. 二重投稿防止チェック (同一contentIdの重複受信防御)
  cleanExpiredCache();
  if (processedEvents.has(contentId)) {
    console.warn(
      `[Webhook Warning] Duplicate webhook ignored for already processed contentId=${contentId}`
    );
    return NextResponse.json({
      message: `Ignored duplicate webhook for contentId: ${contentId}`,
      contentId,
    });
  }

  // 7. microCMS APIから最新NEWSデータを取得
  const article = await getNewsDetail(contentId);
  if (!article) {
    console.error(
      `[Webhook Error] Failed to fetch article detail from microCMS for contentId=${contentId}`
    );
    return NextResponse.json(
      { error: `Article not found for contentId: ${contentId}` },
      { status: 404 }
    );
  }

  // 公開日時と作成日時の比較による追加の二重防止チェック:
  // もし何らかの理由でeditイベントがnewとして届いた場合でも、
  // 公開日時と作成日時が大幅（5分以上）に乖離し、かつ過去に更新履歴がある場合はスキップ
  const publishedTime = article.publishedAt ? new Date(article.publishedAt).getTime() : 0;
  const createdTime = article.createdAt ? new Date(article.createdAt).getTime() : 0;
  const updatedTime = article.updatedAt ? new Date(article.updatedAt).getTime() : 0;

  // 過去に作成された記事の遅延更新であるかの安全チェック（初回作成は createdTime ≒ publishedTime ≒ updatedTime）
  if (createdTime > 0 && updatedTime > 0 && (updatedTime - createdTime > 1000 * 60 * 10) && (publishedTime < updatedTime - 1000 * 60 * 5)) {
    console.warn(
      `[Webhook Warning] Skipped: article appears to be an existing updated article, not initial publish (contentId=${contentId})`
    );
    return NextResponse.json({
      message: "Skipped: detected article update, not new publication",
      contentId,
    });
  }

  // 8. 投稿文の組み立て
  // 本番URLは必ず正規ドメイン
  const canonicalUrl = `${SITE_ORIGIN}/news/${article.id}`;
  const baseText =
    article.socialText && article.socialText.trim().length > 0
      ? article.socialText.trim()
      : article.title;

  const tweetContent = buildXPostText(baseText, canonicalUrl, "#盈虚とパイプドリーム");

  // 9. X APIで自動投稿
  console.log(`[Webhook Info] Posting tweet for news contentId=${contentId}...`);
  const result = await postTweetToX(tweetContent);

  if (!result.success) {
    console.error(
      `[Webhook Error] Failed to post tweet to X for contentId=${contentId}. Reason: ${result.error}`
    );
    // X投稿に失敗してもmicroCMS側には200で応答し、Webhookの自動再試行ループによるスパムを防ぎつつ、エラー詳細を返す
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        contentId,
        message: "Article detected as new, but X API tweet failed. Please check Vercel environment variables or use manual repost API.",
      },
      { status: 200 }
    );
  }

  // 10. 成功時はキャッシュに記録
  processedEvents.set(contentId, Date.now());
  console.log(
    `[Webhook Success] Successfully tweeted for contentId=${contentId}, tweetId=${result.tweetId}`
  );

  return NextResponse.json({
    success: true,
    tweetId: result.tweetId,
    contentId,
    tweetContent,
  });
}
