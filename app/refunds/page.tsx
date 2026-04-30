import Link from "next/link";

import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";

export const metadata = {
  title: "Refund policy — Made Plain",
  description: "30 days. No questions. No screenshots required.",
};

export default function RefundsPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Section tone="paper" pad="loose" width="narrow">
          <Eyebrow prefix="§">Refunds</Eyebrow>
          <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
            30 days. No questions
            <DotMark size="md" />
          </h1>

          <div className="prose-editorial mt-10 space-y-6 font-serif text-[length:var(--text-body)] leading-[1.65] text-[var(--color-ink)]/90">
            <p>
              If the kit isn&apos;t worth your money — for any reason, or no
              reason — reply to your receipt within 30 days of purchase and
              we&apos;ll refund you in full.
            </p>
            <p>
              We don&apos;t ask for screenshots, justifications, or feedback.
              We&apos;ll just refund you. We&apos;d rather lose the sale than
              hold money from someone who isn&apos;t getting value.
            </p>
            <p>
              After 30 days, sales are final. The kit is yours forever either
              way — including any updates we ship.
            </p>
            <p>
              Refunds process within 5 business days back to the original
              payment method.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-5 text-[14px] font-semibold rounded-md border border-[var(--color-line)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Request a refund →
            </Link>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
