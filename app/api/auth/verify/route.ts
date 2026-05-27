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
    normalized = normalized.replace(/\D/g, "");
    return normalized;
}

function getAllowedPhones(): Record<string, number> {
    try {
        const envVal = process.env.ALLOWED_PHONES_JSON || process.env.ALLOWED_EMAILS_JSON;
        
        // Debug info from user request: Output first 3 chars
        const debugStart = envVal ? envVal.substring(0, 3) : "N/A";
        console.log(`[DEBUG] ALLOWED_PHONES_JSON loaded starts with: ${debugStart}`);

        if (!envVal) return {};
        
        const parsed = JSON.parse(envVal);
        const result: Record<string, number> = {};
        
        // Normalize keys for robust matching
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'number') {
                const normalizedKey = normalizePhoneNumber(key);
                if (normalizedKey) {
                    result[normalizedKey] = value;
                }
            }
        }
        return result;
    } catch (e) {
        console.error("Failed to parse allowed phones JSON:", e);
        return {};
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const rawPhone = body.phone || body.email;
        const password = body.password;

        if (!rawPhone || typeof rawPhone !== 'string') {
            return NextResponse.json(
                { success: false, message: "電話番号を正しく入力してください" },
                { status: 400 }
            );
        }

        const normalizedPhone = normalizePhoneNumber(rawPhone);
        
        // Check if they input the admin key from env to allow developers/admin bypass
        const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY?.trim();
        if (adminKey && (rawPhone.trim() === adminKey || normalizedPhone === normalizePhoneNumber(adminKey))) {
            console.log("Admin Logged In via API");
            return NextResponse.json({ success: true, tier: 5 });
        }

        // Verify password
        const commonPassword = process.env.COMMON_SUPPORTER_PASSWORD;
        if (!commonPassword || password !== commonPassword) {
            return NextResponse.json(
                { success: false, message: "認証情報が正しくありません。" },
                { status: 401 }
            );
        }

        const allowedPhones = getAllowedPhones();
        const tier = allowedPhones[normalizedPhone];

        if (tier !== undefined) {
            return NextResponse.json({ success: true, tier });
        } else {
            return NextResponse.json(
                { success: false, message: "認証情報が正しくありません。" },
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
