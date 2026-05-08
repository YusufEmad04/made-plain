import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { KIT_ARTIFACTS } from "@/lib/content/kit";

export const runtime = "nodejs";

/**
 * Mock signed-URL endpoint. In production S3 issues the URL directly
 * and the client downloads from the bucket. For the skeleton we serve
 * a short text placeholder so the buyer flow is end-to-end verifiable.
 */
export async function GET(req: Request) {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") ?? "";
    const exp = Number(url.searchParams.get("exp") ?? "0");

    if (!key || Number.isNaN(exp) || exp < Date.now()) {
        return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.users.findByEmail(session.email);
    if (!user || !user.ownsKit) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const artifact = KIT_ARTIFACTS.find((a) => a.storageKey === key);
    if (!artifact) {
        return NextResponse.json({ error: "Unknown artifact" }, { status: 404 });
    }

    const body = [
        `Made Plain — placeholder for ${artifact.name}`,
        `Storage key: ${artifact.storageKey}`,
        "",
        "This file is a stand-in. Real artifact bytes ship from S3 once",
        "AWS credentials are configured. The flow you just exercised —",
        "purchase → email → library → signed URL → download — is the",
        "exact path the production kit uses.",
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${artifact.slug}.txt"`,
        },
    });
}
