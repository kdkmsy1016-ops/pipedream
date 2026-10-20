import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "characters";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    // 1. Vercel Blob が利用可能な場合（BLOB_READ_WRITE_TOKEN が設定されている場合）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`costume/${category}/${filename}`, file, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url });
    }

    // 2. ローカル開発環境でのフォールバック (public/costume-uploads/)
    const uploadDir = path.join(process.cwd(), "public", "costume-uploads", category);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/costume-uploads/${category}/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
