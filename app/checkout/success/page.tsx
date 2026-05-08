import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { db } from "@/lib/db";

export const metadata = {
    title: "Welcome — Made Plain",
    robots: { index: false, follow: false },
};

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>;
}) {
    const { order: orderId } = await searchParams;
    const order = orderId ? await db.orders.get(orderId) : null;

    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <div className="text-center space-y-8">
                        <CheckCircle
                            weight="duotone"
                            className="size-20 text-[var(--color-accent)] mx-auto"
                        />
                        <Eyebrow prefix="§">You&apos;re in</Eyebrow>
                        <h1 className="font-display text-[length:var(--text-h1)] text-balance">
                            The kit is yours.
                            <br />
                            <span className="text-[var(--color-accent)]">Forever</span>
                            <DotMark size="md" />
                        </h1>
                        <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-ink)]/85 max-w-[44ch] mx-auto">
                            We&apos;ve sent a receipt and access link to{" "}
                            {order?.email ? (
                                <strong>{order.email}</strong>
                            ) : (
                                "your inbox"
                            )}
                            . You&apos;re also signed in here — open your library to start.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/library"
                                className="inline-flex items-center justify-center h-12 px-7 text-[15px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90"
                            >
                                Open my library →
                            </Link>
                        </div>

                        <p className="font-serif italic text-[13px] text-[var(--color-mute)] pt-4">
                            Need anything? Reply to your receipt — that&apos;s the editor.
                        </p>
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}
