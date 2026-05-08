import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
    title: "Operator Notes — Made Plain",
    description:
        "A weekly Sunday email connecting current business events to the kit's concepts.",
};

export default function BlogPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Operator Notes</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
                        One short essay. Every Sunday
                        <DotMark size="md" />
                    </h1>

                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[52ch]">
                        ~600 words. Connects something happening this week — a launch, a
                        margin call, a quiet acquisition — to a concept from the kit. No
                        hot takes. No hype.
                    </p>

                    <ul className="mt-12 space-y-6">
                        <ArchiveStub
                            date="Coming Sunday"
                            title="Why your CAC went up the week your retention went down"
                        />
                        <ArchiveStub
                            date="Sunday after"
                            title="The price you pick is a positioning statement"
                        />
                        <ArchiveStub
                            date="Then"
                            title="Three businesses that survived their first contraction. One didn't."
                        />
                    </ul>

                    <div className="mt-14 rounded-md border border-dashed border-[var(--color-line)] bg-[var(--color-sand)] p-8 space-y-4">
                        <p className="eyebrow text-[var(--color-mute)]">Free, forever</p>
                        <NewsletterForm cta="Send me the weekly note" />
                        <p className="font-serif italic text-[12px] text-[var(--color-mute)]">
                            Unsubscribe in one click. Your email is never sold.
                        </p>
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}

function ArchiveStub({ date, title }: { date: string; title: string }) {
    return (
        <li className="flex items-baseline gap-6 border-b border-[var(--color-line)] pb-5">
            <span className="font-mono text-[12px] text-[var(--color-mute)] tabular-nums shrink-0 w-32">
                {date}
            </span>
            <span className="font-display text-[length:var(--text-h3)] text-[var(--color-ink)]/60">
                {title}
            </span>
        </li>
    );
}
