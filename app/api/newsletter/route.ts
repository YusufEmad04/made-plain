import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    let body: { email?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const email = (body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await db.newsletter.subscribe(email);
    return NextResponse.json({ ok: true });
}
