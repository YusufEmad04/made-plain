"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm({ price }: { price: number }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong");
      }
      router.push(data.redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try again");
      setPending(false);
    }
  }

  return (
    <Section tone="paper" pad="loose" width="narrow">
      <Eyebrow prefix="§">Checkout</Eyebrow>
      <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[18ch] text-balance">
        One kit. Yours forever.
        <DotMark size="md" />
      </h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="eyebrow text-[var(--color-mute)]">
              Your name
            </Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="h-11"
              autoComplete="name"
            />
          </div>
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
            <p className="font-serif italic text-[13px] text-[var(--color-mute)]">
              We send your kit, receipt, and library access here.
            </p>
          </div>

          {error && (
            <p className="font-serif text-[14px] text-[var(--color-neg)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center h-12 px-6 text-[15px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "One moment…" : `Continue to payment — $${price}`}
          </button>

          <p className="font-serif italic text-[12px] text-[var(--color-mute)] text-center">
            30-day, no-questions-asked refund. Secure mock checkout.
          </p>
        </form>

        <aside className="bg-[var(--color-card-brand)] border border-[var(--color-line)] rounded-md p-6 self-start">
          <div className="eyebrow text-[var(--color-mute)]">Order summary</div>
          <ul className="mt-4 space-y-2 font-serif text-[14px]">
            <li className="flex items-baseline justify-between">
              <span>The Builder&apos;s Business Kit · v1</span>
              <span className="font-mono tabular-nums">${price}</span>
            </li>
            <li className="flex items-baseline justify-between text-[var(--color-mute)]">
              <span>Lifetime updates</span>
              <span className="font-mono tabular-nums">free</span>
            </li>
            <li className="flex items-baseline justify-between text-[var(--color-mute)]">
              <span>Operator Notes weekly</span>
              <span className="font-mono tabular-nums">free</span>
            </li>
            <li className="flex items-baseline justify-between text-[var(--color-mute)]">
              <span>Web Library access</span>
              <span className="font-mono tabular-nums">free</span>
            </li>
          </ul>
          <div className="mt-5 pt-5 border-t border-[var(--color-line)] flex items-baseline justify-between">
            <span className="eyebrow text-[var(--color-mute)]">Total</span>
            <span className="font-mega text-[40px] text-[var(--color-accent)] leading-none">
              ${price}
              <DotMark size="sm" className="ml-1" />
            </span>
          </div>
        </aside>
      </div>
    </Section>
  );
}
