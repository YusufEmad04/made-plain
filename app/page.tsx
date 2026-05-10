import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Compass,
    ListChecks,
    MapTrifold,
    PenNib,
    Rows,
    ShieldCheck,
    Stack,
} from "@phosphor-icons/react/dist/ssr";

import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { StickyCtaBar } from "@/components/site/sticky-cta-bar";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { EditorialDivider } from "@/components/brand/editorial-divider";
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

/* ──────────────────────────────────────────────────────────────────
   Made Plain — Landing page
   Spec: design-system/landing-page.md
   ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
    return (
        <>
            <SiteNav />
            <main className="flex flex-col">
                <Hero />
                <RealityCheck />
                <ThePromise />
                <WhatsInTheKit />
                <PeekInside />
                <ChoosePath />
                <Bonuses />
                <ForNotFor />
                <AboutEditor />
                <BuyersSay />
                <Pricing />
                <Guarantee />
                <FAQ />
                <FinalCTA />
            </main>
            <SiteFooter />
            <StickyCtaBar />
        </>
    );
}

/* ─── 01 · Hero ──────────────────────────────────────────────────── */

function Hero() {
    return (
        <Section tone="paper" pad="loose" className="texture-grain">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-x-20 items-center">
                <div className="lg:col-span-7 space-y-8">
                    <Eyebrow prefix="§">The Builder&apos;s Business Kit · v1</Eyebrow>

                    <h1 className="font-mega text-[length:var(--text-mega)] text-balance lg:max-w-[11ch]">
                        Everything in business.
                        <br />
                        <span className="text-[var(--color-accent)]">In one weekend</span>
                        <DotMark size="lg" className="ml-1" />
                    </h1>

                    <p className="font-serif text-[length:var(--text-lead)] leading-[1.45] text-[var(--color-ink)]/85 max-w-[60ch] text-pretty">
                        Stop stitching it together from podcasts, Twitter threads, and three
                        Investopedia tabs. One kit. Seven pieces. A working mental model of
                        business by Sunday night.
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                        <Link
                            href="/#pricing"
                            className="inline-flex items-center justify-center h-14 px-7 text-[16px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 shadow-md transition-colors"
                        >
                            Get the kit — 999 EGP
                            <ArrowRight weight="bold" className="ml-2 size-4" />
                        </Link>
                        <p className="font-serif italic text-[13px] text-[var(--color-mute)]">
                            One kit. Pay once. 30-day refund.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-[var(--color-line)]">
                        <p className="eyebrow text-[var(--color-mute-2)]">
                            Built by the operator behind Simplx &amp; Sahelli
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <KitMockup />
                </div>
            </div>
        </Section>
    );
}

function KitMockup() {
    return (
        <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto">
            <div className="absolute inset-0 opacity-[0.06] text-[var(--color-ink)]">
                <svg viewBox="0 0 400 500" className="w-full h-full">
                    {Array.from({ length: 14 }).map((_, i) => {
                        const cx = 40 + (i % 5) * 80;
                        const cy = 60 + Math.floor(i / 5) * 130 + (i % 2) * 30;
                        return (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="6" fill="currentColor" />
                                {i > 0 && (
                                    <line
                                        x1={40 + ((i - 1) % 5) * 80}
                                        y1={60 + Math.floor((i - 1) / 5) * 130 + ((i - 1) % 2) * 30}
                                        x2={cx}
                                        y2={cy}
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[80%] aspect-[3/4]">
                    <div className="absolute -right-6 top-2 bottom-6 left-10 rounded-md bg-[var(--color-sand)] shadow-lg rotate-[6deg] border border-[var(--color-line)] flex flex-col p-5">
                        <div className="eyebrow text-[var(--color-accent)]">The Connection Map</div>
                        <div className="mt-2 grid grid-cols-3 gap-3 flex-1">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-sm border border-[var(--color-line)] bg-[var(--color-paper)]/40"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute -left-4 top-6 bottom-2 right-12 rounded-md bg-[var(--color-card-brand)] shadow-lg -rotate-[4deg] border border-[var(--color-line)] flex flex-col p-5">
                        <div className="eyebrow text-[var(--color-mute)]">Worksheet</div>
                        <div className="mt-2 space-y-2">
                            <div className="h-2 rounded-sm bg-[var(--color-line)] w-3/4" />
                            <div className="h-2 rounded-sm bg-[var(--color-line)] w-1/2" />
                            <div className="h-2 rounded-sm bg-[var(--color-line)] w-2/3" />
                        </div>
                        <div className="mt-auto h-12 rounded-sm border-2 border-dashed border-[var(--color-line)]" />
                    </div>

                    <div className="absolute inset-0 rounded-md bg-[var(--color-ink)] text-[var(--color-paper)] shadow-lg flex flex-col p-6 border border-[var(--color-line)]">
                        <div className="eyebrow text-[var(--color-accent)]">The Handbook</div>
                        <div className="mt-auto space-y-2">
                            <p className="font-serif italic text-[13px] opacity-70">
                                A working mental model of business —
                            </p>
                            <p className="font-mega text-[clamp(28px,5vw,52px)] leading-[0.9]">
                                Made
                                <br />
                                <span className="text-[var(--color-accent)]">Plain.</span>
                            </p>
                            <p className="eyebrow text-[var(--color-mute-2)] pt-3">
                                ~150 pages · v1
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── 02 · Reality check ─────────────────────────────────────────── */

function RealityCheck() {
    const stack = [
        "Read Lean Startup, Zero to One, half of Hooked",
        "Bookmarked 47 Twitter threads",
        "Listened to 200 hours of My First Million",
        "Started 3 Notion docs called \u201CBusiness 101\u201D",
        "Watched courses you never finished",
        "Asked ChatGPT the same question 12 different ways",
    ];

    return (
        <Section tone="ink" pad="loose">
            <Eyebrow tone="accent" prefix="§ 02">
                The Problem
            </Eyebrow>

            <h2 className="font-display text-[length:var(--text-display)] text-balance mt-6 max-w-[18ch]">
                You don&apos;t have a knowledge problem.
                <br />
                <span className="text-[var(--color-accent)]">
                    You have a connection problem.
                </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <ul className="space-y-3 font-serif text-[length:var(--text-body)]">
                    {stack.map((item) => (
                        <li key={item} className="flex gap-3 items-start">
                            <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-[var(--color-mute)] shrink-0" />
                            <span className="text-[var(--color-paper)]/85">{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="font-serif italic text-[length:var(--text-lead)] leading-[1.5] text-[var(--color-paper)]/90 max-w-[42ch]">
                    And yet — when someone asks why you priced the way you did, you can&apos;t
                    explain it in one sentence. When your CAC creeps up, you&apos;re not
                    sure if it&apos;s a channel problem or a positioning problem. When
                    your runway shrinks, you&apos;re guessing what to cut.
                    <span className="block mt-4 text-[var(--color-paper)]">
                        The pieces are in your head. But they don&apos;t connect.
                    </span>
                </div>
            </div>

            <div className="mt-20 text-center">
                <p className="font-serif italic text-[length:var(--text-h2)] text-[var(--color-accent)]">
                    That&apos;s what this kit fixes
                    <DotMark size="md" className="ml-1" />
                </p>
            </div>
        </Section>
    );
}

/* ─── 03 · The promise ───────────────────────────────────────────── */

function ThePromise() {
    return (
        <Section tone="sand" pad="loose">
            <div className="text-center space-y-10">
                <Eyebrow prefix="§ 03">The Promise</Eyebrow>

                <h2 className="font-mega text-[length:var(--text-mega)] text-balance max-w-[14ch] mx-auto">
                    A working mental model of business.
                    <br />
                    By Sunday night.
                    <br />
                    <span className="text-[var(--color-accent)]">Or your money back</span>
                    <DotMark size="lg" />
                </h2>

                <div className="pt-4">
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center justify-center h-14 px-7 text-[16px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 shadow-md transition-colors"
                    >
                        Get the kit — 999 EGP
                        <ArrowRight weight="bold" className="ml-2 size-4" />
                    </Link>
                </div>
            </div>
        </Section>
    );
}

/* ─── 04 · What's in the kit ─────────────────────────────────────── */

const KIT = [
    {
        icon: BookOpen,
        name: "The Handbook",
        desc: "A 150-page operator's book covering every domain of business.",
        spec: "PDF + EPUB",
    },
    {
        icon: MapTrifold,
        name: "The Connection Map",
        desc: "A printable poster showing how every concept connects to every other.",
        spec: "A1 + interactive web",
    },
    {
        icon: Stack,
        name: "30 Books, Distilled",
        desc: "The most important business books — one paragraph + 5–8 lessons each.",
        spec: "~50-page PDF",
    },
    {
        icon: Rows,
        name: "The Glossary",
        desc: "200 essential terms, formulas, and acronyms.",
        spec: "25-page PDF + 1-pager",
    },
    {
        icon: ListChecks,
        name: "The Worksheet Pack",
        desc: "12 fillable templates. Positioning, pricing, CAC/LTV, runway.",
        spec: "PDF + Notion + Sheets",
    },
    {
        icon: PenNib,
        name: "The Exercise Booklet",
        desc: "25 short exercises that force application to your business.",
        spec: "40-page PDF",
    },
    {
        icon: Compass,
        name: "Quick Start Paths",
        desc: "Four pre-sequenced paths through the kit for your situation.",
        spec: "15-page PDF",
    },
];

function WhatsInTheKit() {
    return (
        <Section id="kit" tone="paper" pad="loose">
            <Eyebrow prefix="§ 04">What&apos;s in the kit</Eyebrow>

            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[18ch] text-balance">
                Seven pieces. One weekend.
                <br />
                <span className="text-[var(--color-accent)]">Yours forever</span>
                <DotMark size="md" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
                {KIT.slice(0, 4).map((item) => (
                    <KitCard key={item.name} {...item} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 lg:max-w-[78%] lg:mx-auto">
                {KIT.slice(4).map((item) => (
                    <KitCard key={item.name} {...item} />
                ))}
            </div>

            <div className="mt-20 max-w-[640px] mx-auto bg-[var(--color-card-brand)] border border-[var(--color-line)] rounded-lg p-8 sm:p-10 shadow-sm">
                <Eyebrow tone="mute">The whole stack</Eyebrow>
                <ul className="mt-6 divide-y divide-[var(--color-line)]">
                    {KIT.map((item) => (
                        <li
                            key={item.name}
                            className="flex items-baseline justify-between gap-6 py-3"
                        >
                            <span className="font-serif text-[length:var(--text-body)] flex items-baseline gap-3">
                                <span className="text-[var(--color-accent)]">✓</span>
                                {item.name}
                            </span>
                            <span className="font-mono text-[13px] text-[var(--color-mute)] tabular-nums text-right">
                                {item.spec}
                            </span>
                        </li>
                    ))}
                    <li className="flex items-baseline justify-between gap-6 py-3 italic text-[var(--color-mute)]">
                        <span className="font-serif text-[length:var(--text-body)] flex items-baseline gap-3">
                            <span>+</span>Lifetime updates
                        </span>
                        <span className="font-mono text-[13px] tabular-nums">forever</span>
                    </li>
                    <li className="flex items-baseline justify-between gap-6 py-3 italic text-[var(--color-mute)]">
                        <span className="font-serif text-[length:var(--text-body)] flex items-baseline gap-3">
                            <span>+</span>Operator Notes weekly newsletter
                        </span>
                        <span className="font-mono text-[13px] tabular-nums">forever</span>
                    </li>
                    <li className="flex items-baseline justify-between gap-6 py-3 italic text-[var(--color-mute)]">
                        <span className="font-serif text-[length:var(--text-body)] flex items-baseline gap-3">
                            <span>+</span>Web Library access
                        </span>
                        <span className="font-mono text-[13px] tabular-nums">forever</span>
                    </li>
                </ul>

                <div className="mt-8 pt-6 border-t-2 border-[var(--color-ink)] flex items-baseline justify-between">
                    <span className="eyebrow text-[var(--color-mute)]">Yours today</span>
                    <span className="font-mega text-[clamp(48px,8vw,88px)] text-[var(--color-accent)] leading-none">
                        999 EGP
                        <DotMark size="md" className="ml-1" />
                    </span>
                </div>

                <Link
                    href="/#pricing"
                    className="inline-flex items-center justify-center w-full mt-6 h-12 text-[15px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-colors"
                >
                    Get the kit — 999 EGP
                </Link>
            </div>
        </Section>
    );
}

function KitCard({
    icon: Icon,
    name,
    desc,
    spec,
}: {
    icon: typeof BookOpen;
    name: string;
    desc: string;
    spec: string;
}) {
    return (
        <Card className="group relative overflow-hidden border-[var(--color-line)] bg-[var(--color-card-brand)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className="absolute left-0 top-0 h-full w-[3px] bg-[var(--color-accent)] scale-y-0 origin-top transition-transform duration-200 group-hover:scale-y-100" />
            <Icon
                weight="regular"
                className="size-8 text-[var(--color-accent)] mb-4"
            />
            <h3 className="font-display text-[length:var(--text-h3)] mb-2">{name}</h3>
            <p className="font-serif text-[15px] leading-[1.55] text-[var(--color-ink)]/85">
                {desc}
            </p>
            <p className="font-mono text-[12px] text-[var(--color-mute)] mt-4 tabular-nums">
                {spec}
            </p>
        </Card>
    );
}

/* ─── 05 · Peek inside ───────────────────────────────────────────── */

function PeekInside() {
    return (
        <Section tone="sand" pad="loose" width="wide">
            <Eyebrow prefix="§ 05">A peek inside</Eyebrow>

            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[18ch] text-balance">
                Real spreads. Real numbers.
                <br />
                <span className="text-[var(--color-accent)]">Plain language</span>
                <DotMark size="md" />
            </h2>

            <p className="font-serif italic text-[var(--color-mute)] mt-4">
                No mockups. These are pages from the actual kit.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpreadFrame label="Handbook · ch. 4" page={47}>
                    <div className="space-y-2">
                        <p className="font-mono text-[10px] text-[var(--color-mute)]">
                            § 4.2 · PRICING
                        </p>
                        <p className="font-display text-[20px] leading-[1.1]">
                            The first ten customers should not see your real prices.
                        </p>
                        <p className="font-serif text-[12px] leading-[1.55] mt-3 text-[var(--color-ink)]/85">
                            Sahelli charges clinics{" "}
                            <span className="font-mono">$80/mo</span> today. The first ten
                            clinics paid <span className="font-mono">$30/mo</span> — a
                            deliberate discount, traded for testimonials, feedback, and the
                            right to learn in public…
                        </p>
                    </div>
                </SpreadFrame>

                <SpreadFrame label="Connection Map · detail" page={2}>
                    <ConnectionGraph />
                </SpreadFrame>

                <SpreadFrame label="Worksheet · CAC payback" page={11}>
                    <WorksheetPreview />
                </SpreadFrame>
            </div>
        </Section>
    );
}

function SpreadFrame({
    label,
    page,
    children,
}: {
    label: string;
    page: number;
    children: React.ReactNode;
}) {
    return (
        <div className="aspect-[3/4] rounded-md bg-[var(--color-paper)] border border-[var(--color-line)] shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-mute)] tabular-nums">
                <span>{label}</span>
                <span>p. {page}</span>
            </div>
            <div className="border-t border-[var(--color-line)] mt-2 pt-4 flex-1">
                {children}
            </div>
        </div>
    );
}

function ConnectionGraph() {
    const nodes = [
        { x: 50, y: 30, label: "Pricing" },
        { x: 130, y: 60, label: "Margin" },
        { x: 200, y: 30, label: "CAC" },
        { x: 60, y: 130, label: "Channel" },
        { x: 160, y: 150, label: "Hiring" },
        { x: 230, y: 110, label: "Runway" },
    ];
    const edges = [
        [0, 1],
        [1, 2],
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 4],
        [4, 5],
    ];
    return (
        <svg viewBox="0 0 280 200" className="w-full h-full">
            {edges.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="var(--color-line)"
                    strokeWidth="1"
                />
            ))}
            {nodes.map((n, i) => (
                <g key={i}>
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r={i === 0 ? 6 : 4}
                        fill={i === 0 ? "var(--color-accent)" : "var(--color-ink)"}
                    />
                    <text
                        x={n.x + 8}
                        y={n.y + 3}
                        className="font-mono"
                        fontSize="9"
                        fill="var(--color-ink)"
                    >
                        {n.label}
                    </text>
                </g>
            ))}
        </svg>
    );
}

function WorksheetPreview() {
    return (
        <div className="space-y-3 font-mono text-[11px] tabular-nums">
            <Row label="MRR" value="$80" />
            <Row label="CAC" value="$400" />
            <Row label="Gross margin" value="78%" />
            <Row label="CAC payback" value="6.4 mo" highlight />
            <div className="h-px bg-[var(--color-line)] my-3" />
            <p className="font-serif text-[12px] italic text-[var(--color-mute)]">
                Goal: under 12 months for SaaS, under 6 for consumer.
            </p>
        </div>
    );
}

function Row({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-baseline justify-between border-b border-dashed border-[var(--color-line)] pb-1.5">
            <span className="text-[var(--color-mute)]">{label}</span>
            <span
                className={highlight ? "text-[var(--color-accent)] font-semibold" : ""}
            >
                {value}
            </span>
        </div>
    );
}

/* ─── 06 · Choose your path ──────────────────────────────────────── */

const PATHS = [
    {
        name: "First-time founder",
        desc: "Pre-revenue, building your first thing.",
        time: "~6 hours · weekend pace",
    },
    {
        name: "Scaling past $10K MRR",
        desc: "Growth is real. Decisions are getting harder.",
        time: "~5 hours · focused",
    },
    {
        name: "Agency owner moving into product",
        desc: "Service business → SaaS.",
        time: "~7 hours · two evenings",
    },
    {
        name: "Pre-revenue learner",
        desc: "Not building yet. Want a working model first.",
        time: "~4 hours · light reading",
    },
];

function ChoosePath() {
    return (
        <Section tone="paper" pad="loose">
            <Eyebrow prefix="§ 06">Choose your path</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[14ch]">
                Where are you starting from?
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                {PATHS.map((p, i) => (
                    <Card
                        key={p.name}
                        className={`group p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-[var(--color-line)] ${i % 2 === 0
                                ? "bg-[var(--color-card-brand)]"
                                : "bg-[var(--color-sand)]"
                            }`}
                    >
                        <h3 className="font-display text-[24px] leading-tight">{p.name}</h3>
                        <p className="font-serif text-[length:var(--text-body)] mt-3 text-[var(--color-ink)]/85">
                            {p.desc}
                        </p>
                        <div className="flex items-center justify-between mt-6">
                            <p className="font-serif italic text-[13px] text-[var(--color-mute)]">
                                {p.time}
                            </p>
                            <ArrowRight
                                weight="bold"
                                className="size-4 text-[var(--color-accent)] transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
    );
}

/* ─── 07 · Bonuses ───────────────────────────────────────────────── */

function Bonuses() {
    return (
        <Section tone="paper" pad="loose">
            <EditorialDivider />

            <Eyebrow prefix="§ 07">Plus, free with your kit</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[20ch] text-balance">
                Three things that make this a habit, not a one-time read.
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                <BonusCard
                    name="The Web Library"
                    desc="Interactive companion. Calculators with saved state, the live Connection Map, search across the corpus, your dashboard."
                    tag="forever"
                />
                <BonusCard
                    name="Operator Notes"
                    desc="A weekly Sunday email connecting current business events to the kit's concepts. ~600 words."
                    tag="weekly · forever"
                />
                <BonusCard
                    name="Lifetime Updates"
                    desc="Every new chapter, worksheet, exercise, deep-dive case study. Free. Forever. No upsell."
                    tag="forever"
                />
            </div>
        </Section>
    );
}

function BonusCard({
    name,
    desc,
    tag,
}: {
    name: string;
    desc: string;
    tag: string;
}) {
    return (
        <Card className="border-[var(--color-line)] bg-[var(--color-card-brand)] p-7 flex flex-col">
            <div className="eyebrow text-[var(--color-accent)]">Bonus</div>
            <h3 className="font-display text-[length:var(--text-h3)] mt-3">{name}</h3>
            <p className="font-serif text-[length:var(--text-body)] mt-3 text-[var(--color-ink)]/85 flex-1">
                {desc}
            </p>
            <p className="font-mono text-[12px] text-[var(--color-mute)] tabular-nums mt-5 pt-5 border-t border-[var(--color-line)]">
                {tag}
            </p>
        </Card>
    );
}

/* ─── 08 · For / not for ─────────────────────────────────────────── */

function ForNotFor() {
    return (
        <Section tone="sand" pad="loose">
            <Eyebrow prefix="§ 08">Who this is for</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[16ch]">
                Honest fit check.
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-accent)] mb-6">
                        For you, if…
                    </p>
                    <ul className="space-y-4 font-serif text-[length:var(--text-body)]">
                        {[
                            "You're an early-stage founder, indie hacker, or operator",
                            "You learn fast and apply faster",
                            "You want a working model, not academic theory",
                            "You're sick of ten-tab learning",
                            "You'd rather finish a kit than start a course",
                        ].map((s) => (
                            <li key={s} className="flex gap-3 items-start">
                                <DotMark size="sm" className="mt-[10px] shrink-0" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mb-6">
                        Not for you, if…
                    </p>
                    <ul className="space-y-4 font-serif text-[length:var(--text-body)] text-[var(--color-mute)]">
                        {[
                            "You want certified credentials or citations",
                            "You prefer 40-hour video courses",
                            "You're looking for a get-rich-fast playbook",
                        ].map((s) => (
                            <li key={s} className="flex gap-3 items-start">
                                <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-[var(--color-mute-2)] shrink-0" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}

/* ─── 09 · About ─────────────────────────────────────────────────── */

function AboutEditor() {
    return (
        <Section tone="paper" pad="loose" width="narrow">
            <Eyebrow prefix="§ 09">About the editor</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[16ch] text-balance">
                Built by an operator, for operators.
            </h2>

            <div className="mt-10 space-y-5 font-serif text-[length:var(--text-body)] leading-[1.7] text-[var(--color-ink)]/85 max-w-[60ch]">
                <p>
                    I&apos;ve spent the last several years stitching this together myself,
                    while building <strong>Simplx</strong> and <strong>Sahelli</strong> —
                    two products that taught me, the expensive way, that pricing affects
                    channels, channels affect retention, and retention quietly sets the
                    ceiling on everything else.
                </p>
                <p>
                    I read the books. I bought the courses. I ran the spreadsheets. The
                    knowledge was out there — but nobody had connected it. So I made a
                    map.
                </p>
                <p>
                    This kit is what I wish someone had handed me on day one. It is the
                    working version. The honest version. The version that respects your
                    weekend.
                </p>
                <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-accent)] pt-4">
                    — The editor
                </p>
            </div>
        </Section>
    );
}

/* ─── 10 · Buyers say ────────────────────────────────────────────── */

function BuyersSay() {
    const items = [
        {
            quote:
                "I read the Handbook in two evenings. I\u2019ve already changed how I price.",
            name: "Beta reader · agency",
            metric: "$30k MRR",
        },
        {
            quote:
                "The Connection Map is the single most useful thing on my desk.",
            name: "Beta reader · SaaS",
            metric: "Pre-revenue",
        },
        {
            quote:
                "Worth ten times the price. The exercises forced clarity I\u2019d been avoiding.",
            name: "Beta reader · indie hacker",
            metric: "$8k MRR",
        },
    ];

    return (
        <Section tone="ink" pad="loose">
            <Eyebrow prefix="§ 10">Buyers say</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[16ch]">
                Beta readers, on the kit.
            </h2>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((t, i) => (
                    <figure key={i} className="space-y-5">
                        <blockquote className="font-serif italic text-[length:var(--text-lead)] leading-[1.45] text-[var(--color-paper)]">
                            &ldquo;{t.quote}&rdquo;
                        </blockquote>
                        <figcaption className="flex items-center gap-3 pt-3 border-t border-[var(--color-line)]">
                            <div className="size-9 rounded-full bg-[var(--color-sand)]" />
                            <div>
                                <p className="text-[14px] font-medium text-[var(--color-paper)]">
                                    {t.name}
                                </p>
                                <p className="font-mono text-[11px] text-[var(--color-mute)] tabular-nums">
                                    {t.metric}
                                </p>
                            </div>
                        </figcaption>
                    </figure>
                ))}
            </div>

            <p className="font-serif italic text-[14px] text-[var(--color-mute)] mt-12">
                Real names, real photos, real businesses — published in full at launch.
            </p>
        </Section>
    );
}

/* ─── 11 · Pricing ───────────────────────────────────────────────── */

function Pricing() {
    return (
        <Section id="pricing" tone="paper" pad="loose">
            <Eyebrow prefix="§ 11">Pricing</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6 max-w-[18ch] text-balance">
                One price. Pay once.
                <br />
                <span className="text-[var(--color-accent)]">Yours forever</span>
                <DotMark size="md" />
            </h2>

            <div className="mt-14 max-w-[460px] mx-auto">
                <Card className="relative p-8 sm:p-10 flex flex-col gap-6 border-2 border-[var(--color-accent)] bg-[var(--color-card-brand)] shadow-md">
                    <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-paper)]">
                        <span className="size-1.5 rounded-full bg-[var(--color-paper)]" />
                        Open now
                    </span>

                    <div className="eyebrow text-[var(--color-mute)]">The Kit · v1</div>

                    <div className="flex items-baseline gap-1 leading-none">
                        <span className="font-mono text-[26px] text-[var(--color-mute)] tabular-nums">
                            EGP
                        </span>
                        <span className="font-mega text-[clamp(64px,10vw,96px)] text-[var(--color-ink)]">
                            999
                        </span>
                        <span className="eyebrow text-[var(--color-mute)] ml-2">lifetime</span>
                    </div>

                    <ul className="space-y-2.5 font-serif text-[length:var(--text-body-sm)] text-[var(--color-ink)]/85">
                        <li className="flex items-baseline gap-3">
                            <span className="text-[var(--color-accent)]">✓</span>
                            All seven pieces of the kit
                        </li>
                        <li className="flex items-baseline gap-3">
                            <span className="text-[var(--color-accent)]">✓</span>
                            Lifetime updates — every new chapter, free
                        </li>
                        <li className="flex items-baseline gap-3">
                            <span className="text-[var(--color-accent)]">✓</span>
                            Operator Notes weekly newsletter
                        </li>
                        <li className="flex items-baseline gap-3">
                            <span className="text-[var(--color-accent)]">✓</span>
                            Web Library access
                        </li>
                        <li className="flex items-baseline gap-3">
                            <span className="text-[var(--color-accent)]">✓</span>
                            30-day, no-questions refund
                        </li>
                    </ul>

                    <Link
                        href="/checkout"
                        className="inline-flex items-center justify-center h-12 mt-2 rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-semibold transition-colors"
                    >
                        Get the kit — 999 EGP
                    </Link>
                </Card>
            </div>

            <p className="font-serif italic text-[var(--color-mute)] mt-10 text-center max-w-[52ch] mx-auto">
                One purchase covers your founding team. Don&apos;t share with the
                internet.
            </p>
        </Section>
    );
}

/* ─── 12 · Guarantee ─────────────────────────────────────────────── */

function Guarantee() {
    return (
        <Section tone="sand" pad="loose">
            <div className="text-center max-w-[640px] mx-auto space-y-8">
                <ShieldCheck
                    weight="duotone"
                    className="size-24 text-[var(--color-accent)] mx-auto"
                />
                <Eyebrow prefix="§ 12">The guarantee</Eyebrow>
                <h2 className="font-display text-[length:var(--text-display)] text-balance">
                    If it doesn&apos;t work,
                    <br />
                    <span className="text-[var(--color-accent)]">you don&apos;t pay</span>
                    <DotMark size="md" />
                </h2>
                <p className="font-serif italic text-[length:var(--text-lead)] leading-[1.5] text-[var(--color-ink)]/85">
                    30-day, no-questions-asked refund. If the kit doesn&apos;t give you a
                    working mental model of business by Monday, email me. I&apos;ll
                    refund you in full. Keep the files.
                </p>
                <p className="font-serif italic text-[var(--color-mute)] pt-4">
                    — The editor
                </p>
            </div>
        </Section>
    );
}

/* ─── 13 · FAQ ───────────────────────────────────────────────────── */

const FAQS = [
    {
        q: "What's the difference between this and a course?",
        a: "A course is hours of video you'll never finish. The kit is artifacts you finish in a weekend and reference forever.",
    },
    {
        q: "What if I'm pre-revenue?",
        a: "You're who this was built for. The Quick Start Paths include a pre-revenue path that gets you through the kit in ~4 hours of light reading.",
    },
    {
        q: "Will this still be useful in two years?",
        a: "Yes. The fundamentals don't change. And lifetime updates mean every new chapter, worksheet, and case study lands in your inbox — free, forever.",
    },
    {
        q: "Can I share with my co-founder?",
        a: "Yes. One purchase covers your founding team. Don't share with the internet.",
    },
    {
        q: "Why $19 instead of $499?",
        a: "Because the goal is reach, not margin. The kit gets better when more operators read it and send notes back. The price stays simple: one kit, $19, yours forever.",
    },
    {
        q: "What happens after I buy?",
        a: "You get an email with download links for all seven artifacts plus access to the Web Library. Magic-link auth for the gated library — no password.",
    },
    {
        q: "How do lifetime updates work?",
        a: "Every new chapter, worksheet, exercise, or deep-dive added to the kit shows up in your library, free, forever. We email you when something major drops.",
    },
    {
        q: "Is this for B2B or B2C founders?",
        a: "Both. The Handbook is structured around domains (pricing, acquisition, retention) that apply to either, with explicit B2B / B2C branches where they differ.",
    },
    {
        q: "What if I don't like it?",
        a: "Email within 30 days. Full refund. Keep the files. No friction. The brand respects buyers more than it fears losing money.",
    },
    {
        q: "Why is the accent color terracotta?",
        a: "Because it isn't tech-blue, isn't SaaS-purple, and feels like something you'd find in a New Yorker layout. The brand is editorial, not corporate.",
    },
];

function FAQ() {
    return (
        <Section id="faq" tone="paper" pad="loose" width="narrow">
            <Eyebrow prefix="§ 13">Frequently asked</Eyebrow>
            <h2 className="font-display text-[length:var(--text-display)] mt-6">
                Honest answers.
            </h2>

            <Accordion className="mt-12 w-full">
                {FAQS.map((f, i) => (
                    <AccordionItem
                        key={i}
                        value={`item-${i}`}
                        className="border-b border-[var(--color-line)] py-2"
                    >
                        <AccordionTrigger className="font-display text-[length:var(--text-h3)] text-left hover:no-underline py-5">
                            {f.q}
                        </AccordionTrigger>
                        <AccordionContent className="font-serif text-[length:var(--text-body)] leading-[1.65] text-[var(--color-ink)]/85 pb-5">
                            {f.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </Section>
    );
}

/* ─── 14 · Final CTA ─────────────────────────────────────────────── */

function FinalCTA() {
    return (
        <Section tone="ink" pad="loose">
            <div className="text-center max-w-[760px] mx-auto space-y-8 relative">
                <Eyebrow prefix="§ 14" tone="accent">
                    One last thing
                </Eyebrow>
                <h2 className="font-mega text-[length:var(--text-mega)] text-balance">
                    Stop stitching.
                    <br />
                    <span className="text-[var(--color-accent)]">Start building</span>
                    <DotMark size="lg" />
                </h2>

                <div className="pt-4">
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center justify-center h-14 px-8 text-[16px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 shadow-lg transition-colors"
                    >
                        Get the kit — 999 EGP
                        <ArrowRight weight="bold" className="ml-2 size-4" />
                    </Link>
                </div>

                <p className="font-serif italic text-[length:var(--text-body)] text-[var(--color-paper)]/70">
                    By Monday, you&apos;ll know how business actually works.
                </p>
            </div>
        </Section>
    );
}
