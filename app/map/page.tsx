import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
    title: "The Connection Map — Made Plain",
    description:
        "An interactive map showing how every concept in business connects to every other.",
};

export default function MapPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="default">
                    <Eyebrow prefix="§">The Connection Map</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
                        Every concept. Every connection
                        <DotMark size="md" />
                    </h1>

                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[52ch]">
                        Pricing affects channel. Channel affects retention. Retention sets
                        the ceiling. The Map shows the wiring at a glance — printable, and
                        interactive on the web.
                    </p>

                    <div className="mt-12 aspect-video rounded-md bg-[var(--color-sand)] border border-[var(--color-line)] p-8 relative overflow-hidden">
                        <MapPreview />
                        <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/40 to-transparent">
                            <div className="space-y-3">
                                <p className="eyebrow text-[var(--color-accent)]">Soon</p>
                                <p className="font-display text-[length:var(--text-h3)] max-w-[28ch]">
                                    Interactive Map ships at launch. Buyers get full access,
                                    free, forever.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 max-w-[480px]">
                        <p className="eyebrow text-[var(--color-mute)] mb-3">
                            Be first to use it
                        </p>
                        <NewsletterForm cta="Notify me" />
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}

function MapPreview() {
    const nodes = Array.from({ length: 24 }, (_, i) => ({
        x: 60 + ((i * 71) % 580),
        y: 40 + Math.floor(i / 6) * 70 + ((i * 17) % 30),
    }));
    return (
        <svg viewBox="0 0 700 360" className="w-full h-full">
            {nodes.map((a, i) =>
                nodes
                    .slice(i + 1, i + 4)
                    .map((b, j) => (
                        <line
                            key={`${i}-${j}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke="var(--color-line)"
                            strokeWidth="1"
                        />
                    ))
            )}
            {nodes.map((n, i) => (
                <circle
                    key={i}
                    cx={n.x}
                    cy={n.y}
                    r={i % 5 === 0 ? 6 : 3.5}
                    fill={
                        i % 5 === 0 ? "var(--color-accent)" : "var(--color-ink)"
                    }
                />
            ))}
        </svg>
    );
}
