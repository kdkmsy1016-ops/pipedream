import { NextRequest, NextResponse } from "next/server";
import { getNewsDetail } from "@/app/lib/microcms";
import { buildXPostText, postTweetToX } from "@/app/lib/twitter";

export const runtime = "nodejs";

const SITE_ORIGIN = "https://www.eikyo-to-pipedream.com";

/**
 * 管理者用 手動再投稿・テストAPI
 * 
 * 使用方法:
 * POST /api/admin/repost-news
 * Headers:
 *   Authorization: Bearer <ADMIN_SECRET or MICROCMS_WEBHOOK_SECRET>
 *   Content-Type: application/json
 * Body:
 *   {
 *     "contentId": "s5o-ppo8let",
 *     "dryRun": false // true の場合はXへ投稿せず生成される投稿テキストと設定確認のみ実施
 *   }
 */
export async function POST(req: NextRequest) {
  const adminSecret =
    process.env.ADMIN_SECRET || process.env.MICROCMS_WEBHOOK_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET or MICROCMS_WEBHOOK_SECRET is not configured on server" },
      { status: 500 }
    );
  }

  // 認証チェック
  const authHeader = req.headers.get("authorization");
  const providedKey = authHeader?.replace(/^Bearer\s+/i, "") || req.headers.get("x-admin-key");

  if (!providedKey || providedKey !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { contentId?: string; dryRun?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { contentId, dryRun = false } = body;
  if (!contentId) {
    return NextResponse.json({ error: "contentId is required" }, { status: 400 });
  }

  // microCMSから記事取得
  const article = await getNewsDetail(contentId);
  if (!article) {
    return NextResponse.json(
      { error: `Article not found for contentId: ${contentId}` },
      { status: 404 }
    );
  }

  const canonicalUrl = `${SITE_ORIGIN}/news/${article.id}`;
  const baseText =
    article.socialText && article.socialText.trim().length > 0
      ? article.socialText.trim()
      : article.title;

  const tweetContent = buildXPostText(baseText, canonicalUrl, "#盈虚とパイプドリーム");

  // dryRun モードの場合は投稿せずにシミュレーション結果を返却
  if (dryRun) {
    return NextResponse.json({
      message: "Dry run completed successfully (no tweet posted)",
      contentId,
      tweetContent,
      articleTitle: article.title,
      socialText: article.socialText || null,
      canonicalUrl,
    });
  }

  // 実際のX投稿実行
  const result = await postTweetToX(tweetContent);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        contentId,
        tweetContent,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    tweetId: result.tweetId,
    contentId,
    tweetContent,
  });
}
