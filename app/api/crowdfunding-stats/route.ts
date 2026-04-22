import { NextResponse } from 'next/server';

export const revalidate = 600; // Cache for 10 minutes (stale-while-revalidate)

export async function GET() {
    try {
        const response = await fetch("https://motion-gallery.net/projects/eikyo-to-pipedream", {
            next: { revalidate: 600 }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch from MotionGallery: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Extract the percentage from `<div class="current" style="width: XX%;"></div>`
        const percentMatch = html.match(/<div class="current" style="width:\s*([0-9.]+)%;"/i);
        let percent = "0";
        
        if (percentMatch && percentMatch[1]) {
            percent = percentMatch[1];
        }

        return NextResponse.json({
            success: true,
            percent: parseFloat(percent)
        });
        
    } catch (error) {
        console.error("Error fetching crowdfunding stats:", error);
        return NextResponse.json({
            success: false,
            percent: 0,
            error: "Failed to fetch stats"
        }, { status: 500 });
    }
}
