"use server";

export async function verifyPassword(password: string): Promise<number> {
    // Check against Environment Variables
    // Returns the authorized tier level (1-5) or 0 if unauthorized.

    if (!password) return 0;

    if (password === process.env.SUPPORTER_TIER5_PWD) return 5;
    if (password === process.env.SUPPORTER_TIER4_PWD) return 4;
    if (password === process.env.SUPPORTER_TIER3_PWD) return 3;
    if (password === process.env.SUPPORTER_TIER2_PWD) return 2;
    if (password === process.env.SUPPORTER_TIER1_PWD) return 1;

    // Fallback default passwords if env vars are not yet set
    // (useful for Vercel preview environments before configuration)
    if (password === "tier5pass") return 5;
    if (password === "tier4pass") return 4;
    if (password === "tier3pass") return 3;
    if (password === "tier2pass") return 2;
    if (password === "tier1pass") return 1;

    return 0; // Invalid password
}
