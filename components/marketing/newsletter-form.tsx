"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

export function NewsletterForm({
  cta = "Send me the weekly note",
  variant = "inline",
}: {
  cta?: string;
  variant?: "inline" | "stacked";
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Try again");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try again");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p className="font-serif italic text-[var(--color-accent)]">
        Subscribed. Check your inbox on Sunday.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "inline"
          ? "flex flex-col sm:flex-row gap-3 items-stretch"
          : "space-y-3"
      }
    >
      <Input
        type="email"
        required
        placeholder="you@inbox.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 sm:flex-1"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center h-11 px-5 text-[14px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 disabled:opacity-60"
      >
        {pending ? "…" : cta}
      </button>
      {error && (
        <p className="font-serif text-[13px] text-[var(--color-neg)]">
          {error}
        </p>
      )}
    </form>
  );
}
