import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Double-ensure no cache

function normalizePhoneNumber(str: string): string {
    if (!str) return "";
    // 1. Convert full-width alphanumeric and punctuation characters to half-width
    let normalized = str.replace(/[！-～]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
    });
    // 2. Strip all hyphens, spaces, and other non-digit characters
    normalized = normalized.replace(/[-ー−\s\D]/g, "");
    return normalized;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const rawPhone = body.phone || body.email;
        const password = body.password;

        console.log("Input Phone:", rawPhone);

        // Admin Bypass Check (Tier 99)
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminPassword && password === adminPassword) {
            console.log("Admin Logged In via ADMIN_PASSWORD");
            console.log("Verified Tier:", 99);
            return NextResponse.json({ success: true, tier: 99 });
        }

        if (!rawPhone || typeof rawPhone !== 'string') {
            return NextResponse.json(
                { success: false, message: "電話番号を正しく入力してください" },
                { status: 400 }
            );
        }

        const normalizedPhone = normalizePhoneNumber(rawPhone);
        console.log("Normalized Phone:", normalizedPhone);

        // Verify common password
        const commonPassword = process.env.COMMON_SUPPORTER_PASSWORD;
        if (!commonPassword || password !== commonPassword) {
            console.log("Common password verification failed");
            return NextResponse.json(
                { success: false, message: "共通アクセスキーが正しくありません。" },
                { status: 401 }
            );
        }

        // Fetch ALLOWED_PHONE_JSON safely
        const { ALLOWED_PHONE_JSON } = process.env;
        const rawJson = ALLOWED_PHONE_JSON;
        if (!rawJson) {
            console.error("ALLOWED_PHONE_JSON is missing");
            return NextResponse.json(
                { success: false, message: "サーバー設定エラー" },
                { status: 500 }
            );
        }

        let parsed: Record<string, any>;
        try {
            parsed = JSON.parse(rawJson);
        } catch (err) {
            console.error("Failed to parse ALLOWED_PHONE_JSON:", err);
            return NextResponse.json(
                { success: false, message: "サーバー設定エラー" },
                { status: 500 }
            );
        }

        // Normalize keys for robust mapping
        const allowedMap: Record<string, any> = {};
        for (const [key, val] of Object.entries(parsed)) {
            const normKey = normalizePhoneNumber(key);
            if (normKey) {
                allowedMap[normKey] = val;
            }
        }

        const tierValue = allowedMap[normalizedPhone];
        console.log("Found Tier:", tierValue);

        if (tierValue !== undefined) {
            const tier = Number(tierValue);
            console.log("Verified Tier:", tier);
            return NextResponse.json({ success: true, tier });
        } else {
            console.log("Verified Tier: 0 (Phone number not registered)");
            return NextResponse.json(
                { success: false, message: "電話番号が登録されていません" },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error("Auth API Error:", error);
        return NextResponse.json(
            { success: false, message: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
