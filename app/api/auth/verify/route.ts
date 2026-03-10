import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getAllowedEmails(): Record<string, number> {
    try {
        const envVal = process.env.ALLOWED_EMAILS_JSON;
        if (!envVal) return {};
        
        const parsed = JSON.parse(envVal);
        const result: Record<string, number> = {};
        
        // Normalize keys to lowercase for robust matching
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'number') {
                result[key.trim().toLowerCase()] = value;
            }
        }
        return result;
    } catch (e) {
        console.error("Failed to parse ALLOWED_EMAILS_JSON:", e);
        return {};
    }
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        
        // Also check if they input the admin key from env to allow developers/admin bypass
        const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY?.trim().toLowerCase();
        if (adminKey && normalizedEmail === adminKey) {
            console.log("Admin Logged In via API");
            return NextResponse.json({ success: true, tier: 5 });
        }

        const allowedEmails = getAllowedEmails();
        const tier = allowedEmails[normalizedEmail];

        if (tier !== undefined) {
            return NextResponse.json({ success: true, tier });
        } else {
            return NextResponse.json(
                { success: false, message: "このメールアドレスは登録されていません。支援時と同じアドレスかご確認ください" },
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
