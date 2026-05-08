import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") ?? "";
    if (!token) {
        return NextResponse.redirect(new URL("/login?error=missing", url));
    }
    const consumed = await db.magicTokens.consume(token);
    if (!consumed) {
        return NextResponse.redirect(new URL("/login?error=expired", url));
    }
    const user = await db.users.upsert(consumed.email);
    await setSession(user.id, user.email);
    return NextResponse.redirect(new URL("/library", url));
}
