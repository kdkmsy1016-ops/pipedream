import { NextResponse } from "next/server";
import { getNewsList } from "@/app/lib/microcms";

export const revalidate = 60; // 60秒キャッシュ

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const offsetParam = searchParams.get("offset");
  const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

  try {
    const data = await getNewsList(limit, offset);
    if (!data) {
      return NextResponse.json({ contents: [], totalCount: 0, limit, offset }, { status: 200 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("API /api/news error:", error);
    return NextResponse.json({ contents: [], totalCount: 0, limit, offset }, { status: 500 });
  }
}
