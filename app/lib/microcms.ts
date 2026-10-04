import { createClient } from "microcms-js-sdk";

export interface MicroCMSImage {
  url: string;
  height?: number;
  width?: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category?: NewsCategory | null;
  eyecatch?: MicroCMSImage | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
}

export interface NewsResponse {
  contents: NewsArticle[];
  totalCount: number;
  offset: number;
  limit: number;
}

// microCMSクライアントの初期化（環境変数チェック付き）
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || "eikyo";
const apiKey = process.env.MICROCMS_API_KEY || "";

export const microcmsClient = apiKey
  ? createClient({
      serviceDomain,
      apiKey,
    })
  : null;

/**
 * HTMLタグを除去し、指定文字数に切り詰めるヘルパー関数
 */
export function extractExcerpt(html: string = "", maxLength: number = 80): string {
  if (!html) return "";
  // タグ除去
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * ISO日付文字列を YYYY.MM.DD 形式にフォーマット
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 制作NEWS一覧を取得
 */
export async function getNewsList(limit: number = 10, offset: number = 0): Promise<NewsResponse | null> {
  if (!microcmsClient) {
    return null;
  }
  try {
    const data = await microcmsClient.getList<NewsArticle>({
      endpoint: "news",
      queries: {
        limit,
        offset,
        orders: "-publishedAt",
      },
      customRequestInit: {
        next: { revalidate: 60 }, // ISR: 60秒キャッシュ
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch news from microCMS:", error);
    return null;
  }
}

/**
 * 制作NEWS詳細を取得
 */
export async function getNewsDetail(contentId: string): Promise<NewsArticle | null> {
  if (!microcmsClient) {
    return null;
  }
  try {
    const data = await microcmsClient.getListDetail<NewsArticle>({
      endpoint: "news",
      contentId,
      customRequestInit: {
        next: { revalidate: 60 }, // ISR: 60秒キャッシュ
      },
    });
    return data;
  } catch (error) {
    console.error(`Failed to fetch news detail (${contentId}) from microCMS:`, error);
    return null;
  }
}
