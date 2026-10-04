import { TwitterApi } from "twitter-api-v2";

/**
 * X (Twitter) API v2 クライアントの取得
 * OAuth 1.0a User Context 認証 (Free / Basic / Pro ティア対応)
 */
export function getTwitterClient(): TwitterApi | null {
  const appKey = process.env.X_API_KEY;
  const appSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return null;
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
}

/**
 * Xの280重み（全角140字 / 半角280字）ルールおよびURL短縮（t.co = 23字換算）を考慮して
 * 本文テキストを安全な長さに切り詰める
 * 
 * @param text 元の本文 (socialText または title)
 * @param url 添付するNEWS詳細URL (t.co換算で23文字消費)
 * @param hashtag 付与するハッシュタグ (例: "#盈虚とパイプドリーム")
 * @returns 投稿用フォーマット済みテキスト
 */
export function buildXPostText(
  text: string,
  url: string,
  hashtag: string = "#盈虚とパイプドリーム"
): string {
  const cleanText = text.trim();
  const hashtagPart = hashtag ? `\n\n${hashtag}` : "";
  
  // Xの重み計算:
  // URLはt.coで一律23字(半角23相当 = 重み23)。改行2文字分を含めて約25。
  // X APIの制限: 合計280重み（全角1文字=2重み、半角1文字=1重み）。
  // ハッシュタグ: 全角10文字 = 重み20 + 改行2 = 22。
  // 本文に使用できる重みの安全枠: 280 - 25 (URL) - 25 (ハッシュタグ) = 230重み (全角約110文字)。
  
  const calculateWeight = (str: string): number => {
    let weight = 0;
    for (const char of str) {
      const code = char.charCodeAt(0);
      // ASCII印字可能文字・半角文字は1、それ以外（日本語全角・絵文字等）は2
      if (code >= 0x00 && code <= 0x7f) {
        weight += 1;
      } else {
        weight += 2;
      }
    }
    return weight;
  };

  const maxBodyWeight = 210; // 全角約105文字（余裕を持たせる）
  let bodyText = cleanText;

  if (calculateWeight(bodyText) > maxBodyWeight) {
    // 句点「。」で区切れる箇所を探して自然に短縮
    const sentences = bodyText.split(/(?<=。)/);
    let truncated = "";
    for (const sentence of sentences) {
      if (calculateWeight(truncated + sentence) <= maxBodyWeight - 6) {
        truncated += sentence;
      } else {
        break;
      }
    }

    if (truncated.length > 0) {
      bodyText = truncated + "…";
    } else {
      // 句点区切りが長すぎる場合は文字単位で切り詰め
      let sliceLen = 0;
      let curWeight = 0;
      for (const char of bodyText) {
        const charWeight = char.charCodeAt(0) <= 0x7f ? 1 : 2;
        if (curWeight + charWeight > maxBodyWeight - 4) break;
        curWeight += charWeight;
        sliceLen++;
      }
      bodyText = bodyText.slice(0, sliceLen) + "…";
    }
  }

  // ハッシュタグを含めて組み立て
  let result = `${bodyText}${hashtagPart}\n\n${url}`;

  // 万一全体で280重みを超える場合はハッシュタグを除去
  const totalWeight = calculateWeight(bodyText) + 25 + (hashtagPart ? calculateWeight(hashtagPart) : 0);
  if (totalWeight > 275) {
    result = `${bodyText}\n\n${url}`;
  }

  return result;
}

/**
 * Xへツイートを投稿
 */
export async function postTweetToX(content: string): Promise<{
  success: boolean;
  tweetId?: string;
  error?: string;
}> {
  const client = getTwitterClient();
  if (!client) {
    return {
      success: false,
      error: "X API credentials are not configured in environment variables",
    };
  }

  try {
    const rwClient = client.readWrite;
    const tweet = await rwClient.v2.tweet(content);
    return {
      success: true,
      tweetId: tweet.data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
