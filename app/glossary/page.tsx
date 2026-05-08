import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
    title: "Glossary — Made Plain",
    description:
        "Two hundred terms, formulas, and acronyms used in business — defined in one sentence each.",
};

const TEASER = [
    { term: "ARPU", def: "Average revenue per user, over a chosen window." },
    {
        term: "CAC",
        def: "Customer acquisition cost — what it costs to land one paying customer.",
    },
    {
        term: "Churn",
        def: "The share of customers who stop paying in a given window.",
    },
    {
        term: "Gross margin",
        def: "Revenue minus the variable cost of delivering one unit, as a percentage.",
    },
    {
        term: "LTV",
        def: "Lifetime value — the gross profit one customer generates before they leave.",
    },
    {
        term: "Runway",
        def: "How long the business survives at the current burn rate without new revenue or cash.",
    },
];

export default function GlossaryPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Glossary</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
                        Two hundred terms. One sentence each
                        <DotMark size="md" />
                    </h1>

                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[52ch]">
                        The whole vocabulary, defined plainly. Comes free with the kit
                        (PDF + 1-page print version). A taste:
                    </p>

                    <dl className="mt-10 divide-y divide-[var(--color-line)]">
                        {TEASER.map((t) => (
                            <div
                                key={t.term}
                                className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 py-5"
                            >
                                <dt className="font-mono text-[15px] text-[var(--color-accent)]">
                                    {t.term}
                                </dt>
                                <dd className="font-serif text-[length:var(--text-body)] text-[var(--color-ink)]/85">
                                    {t.def}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-12 rounded-md border border-dashed border-[var(--color-line)] bg-[var(--color-sand)] p-8 space-y-4">
                        <p className="eyebrow text-[var(--color-mute)]">The full 200</p>
                        <p className="font-serif text-[length:var(--text-body)]">
                            Comes inside the kit. Or get the free 1-pager when it ships:
                        </p>
                        <NewsletterForm cta="Send me the 1-pager" />
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}
