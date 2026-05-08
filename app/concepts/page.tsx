import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
    title: "Concepts — Made Plain",
    description:
        "Free, evergreen explanations of business fundamentals — pricing, CAC, retention, runway, positioning, and the rest.",
};

export default function ConceptsPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Concepts</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
                        Free essays on the parts of business that matter
                        <DotMark size="md" />
                    </h1>

                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[52ch]">
                        Evergreen, plain-language explanations. Pricing. CAC. Retention.
                        Runway. Positioning. Each one stands alone — and links to its
                        neighbours on the Connection Map.
                    </p>

                    <div className="mt-12 rounded-md border border-dashed border-[var(--color-line)] bg-[var(--color-sand)] p-8 space-y-4">
                        <p className="eyebrow text-[var(--color-mute)]">Soon</p>
                        <p className="font-serif text-[length:var(--text-body)]">
                            The first ten essays publish at launch. Drop your email and
                            you&apos;ll get them as they go up.
                        </p>
                        <NewsletterForm cta="Notify me" />
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}
