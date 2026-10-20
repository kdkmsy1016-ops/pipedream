import { NextResponse } from "next/server";
import { loadCostumeDatabase, saveCostumeDatabase } from "../../lib/store";

export async function GET() {
  try {
    const data = loadCostumeDatabase();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load database" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    saveCostumeDatabase(body);
    return NextResponse.json({ success: true, message: "Saved successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save database" },
      { status: 500 }
    );
  }
}
