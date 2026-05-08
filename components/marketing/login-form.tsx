"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error ?? "Try again");
            }
            setSent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Try again");
        } finally {
            setPending(false);
        }
    }

    if (sent) {
        return (
            <div className="space-y-4">
                <p className="font-serif text-[length:var(--text-body)] leading-[1.6]">
                    Check <strong>{email}</strong> for a sign-in link. It&apos;s good for
                    15 minutes.
                </p>
                <p className="font-serif italic text-[13px] text-[var(--color-mute)]">
                    Dev tip — the link is also printed in your server console.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email" className="eyebrow text-[var(--color-mute)]">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@example.com"
                    className="h-11"
                    autoComplete="email"
                />
            </div>

            {error && (
                <p className="font-serif text-[14px] text-[var(--color-neg)]">{error}</p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center h-12 px-6 text-[15px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 disabled:opacity-60"
            >
                {pending ? "Sending…" : "Send me a sign-in link"}
            </button>
        </form>
    );
}
