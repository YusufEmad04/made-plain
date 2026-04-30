"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MockPayPanel({
  orderId,
  amount,
  email,
  name,
}: {
  orderId: string;
  amount: number;
  email: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/mock-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Payment failed");
      }
      router.push(`/checkout/success?order=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try again");
      setPending(false);
    }
  }

  return (
    <Section tone="paper" pad="loose" width="narrow">
      <div className="rounded-md border border-dashed border-[var(--color-accent)] bg-[var(--color-sand)] p-4 mb-8 text-[13px] font-serif italic text-[var(--color-mute)]">
        Mock payment. No card is charged. The real provider plugs in
        behind the same interface — this page goes away when it does.
      </div>

      <Eyebrow prefix="§">Payment</Eyebrow>
      <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[18ch] text-balance">
        Confirm your purchase.
        <DotMark size="md" />
      </h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="eyebrow text-[var(--color-mute)]">Name on card</Label>
            <Input
              defaultValue={name}
              readOnly
              className="h-11 bg-[var(--color-card-brand)]"
            />
          </div>
          <div className="space-y-2">
            <Label className="eyebrow text-[var(--color-mute)]">Card number</Label>
            <Input
              defaultValue="4242 4242 4242 4242"
              readOnly
              className="h-11 font-mono tabular-nums"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="eyebrow text-[var(--color-mute)]">Expiry</Label>
              <Input defaultValue="12 / 30" readOnly className="h-11 font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="eyebrow text-[var(--color-mute)]">CVC</Label>
              <Input defaultValue="123" readOnly className="h-11 font-mono" />
            </div>
          </div>

          {error && (
            <p className="font-serif text-[14px] text-[var(--color-neg)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center h-12 px-6 text-[15px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-60"
          >
            {pending ? "Processing…" : `Pay $${amount} (mock)`}
          </button>
        </form>

        <aside className="bg-[var(--color-card-brand)] border border-[var(--color-line)] rounded-md p-6 self-start space-y-4">
          <div className="eyebrow text-[var(--color-mute)]">Charging</div>
          <p className="font-mega text-[48px] text-[var(--color-accent)] leading-none">
            ${amount}
            <DotMark size="sm" className="ml-1" />
          </p>
          <div className="space-y-1 text-[14px] font-serif">
            <p className="text-[var(--color-mute)]">Receipt to</p>
            <p>{email}</p>
          </div>
          <div className="text-[12px] font-mono tabular-nums text-[var(--color-mute)] pt-3 border-t border-[var(--color-line)]">
            order · {orderId.slice(0, 8)}
          </div>
        </aside>
      </div>
    </Section>
  );
}
