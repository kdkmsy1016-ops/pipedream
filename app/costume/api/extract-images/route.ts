import { NextResponse } from "next/server";
import { loadCostumeDatabase } from "../../lib/store";
import { extractImagesFromXlsx } from "../../lib/excel-image-extractor";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "Only .xlsx files are currently supported for image extraction" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const db = loadCostumeDatabase();

    const extracted = await extractImagesFromXlsx(Buffer.from(buffer), file.name, {
      characters: db.characters,
      costumeDays: db.costumeDays,
      costumeLooks: db.costumeLooks,
      photos: db.photos || [],
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      totalImages: extracted.length,
      images: extracted,
    });
  } catch (error: any) {
    console.error("Image extraction API error:", error);
    return NextResponse.json(
      { error: "Failed to extract images from Excel: " + error.message },
      { status: 500 }
    );
  }
}
