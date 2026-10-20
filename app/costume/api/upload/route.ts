import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "looks";

    if (!file) {
      return NextResponse.json({ error: "ファイルが送信されていません" }, { status: 400 });
    }

    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const contentType = file.type || "image/jpeg";

    // 1. Vercel Blob（BLOB_READ_WRITE_TOKEN 設定時）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`costume/${category}/${filename}`, file, {
        access: "public",
        contentType,
      });
      return NextResponse.json({
        url: blob.url,
        fileName: file.name,
        contentType,
        size: file.size,
      });
    }

    // 2. ローカルフォールバック保存 (public/costume-uploads/)
    const uploadDir = path.join(process.cwd(), "public", "costume-uploads", category);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/costume-uploads/${category}/${filename}`;
    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      contentType,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Direct photo upload error:", error);
    return NextResponse.json(
      { error: "アップロードに失敗しました: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
