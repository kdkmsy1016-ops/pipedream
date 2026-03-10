import { NextResponse } from 'next/server';

// Temporary mock database of allowed emails and their tiers.
// In a real application, this should be a DB call or read from a secured file/CMS.
const ALLOWED_EMAILS: Record<string, number> = {
    "example1@mail.com": 1,
    "example2@mail.com": 3,
    "director@mail.com": 5,
};

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

        const tier = ALLOWED_EMAILS[normalizedEmail];

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
