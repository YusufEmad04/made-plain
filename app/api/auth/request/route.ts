import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

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

    // Create the user record if missing — magic-link is also the
    // signup flow.
    await db.users.upsert(email);

    const tok = await db.magicTokens.create(email);
    const url = `${origin(req)}/api/auth/verify?token=${tok.token}`;

    await sendEmail({
        to: email,
        subject: "Your Made Plain sign-in link",
        text: [
            "Click to sign in (valid for 15 minutes):",
            "",
            `  ${url}`,
            "",
            "If you didn't request this, you can ignore the email.",
        ].join("\n"),
    });

    return NextResponse.json({ ok: true });
}

function origin(req: Request): string {
    try {
        return new URL(req.url).origin;
    } catch {
        return "";
    }
}
