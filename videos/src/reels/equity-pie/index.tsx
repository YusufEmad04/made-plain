import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    interpolate,
    useCurrentFrame,
    Easing,
    spring,
    useVideoConfig,
} from "remotion";
import {
    PaperBackground,
    Eyebrow,
    InkWipeLine,
    Hairline,
    MarkerHighlight,
    DotMark,
    ScenePad,
    useSceneFade,
} from "../../brand/motion";
import { Pie, DollarTag, MoneyBill, FlowArrow, type PieSlice } from "../../brand/svg";
import { colors, space, ease } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

const manifest = manifestJson as Manifest;

/* ───────────────────────────────────────────────────────────────────
   Equity Pie — Funding, Valuation, Equity, Rounds. Made plain.
   Voice: Liam (energetic). Durations from voiceover/manifest.json.
   ─────────────────────────────────────────────────────────────────── */

type Word = {
    word: string;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
};
type SceneManifest = {
    id: string;
    audio: string;
    text: string;
    durationFrames: number;
    startFrame: number;
    words: Word[];
};
type Manifest = {
    fps: number;
    totalFrames: number;
    scenes: SceneManifest[];
};

export const EQUITY_PIE_DURATION = manifest.totalFrames;

function wordCue(words: Word[], needle: string, fallback = 0): number {
    const n = needle.toLowerCase();
    for (const w of words) {
        if (w.word.toLowerCase().includes(n)) return w.startFrame;
    }
    return fallback;
}

const easeQ = (t: number) => Easing.bezier(...ease.quart)(t);

/* ─── Scene 01 — Title hook ──────────────────────────────────────── */
const TitleScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const moneyCue = wordCue(words, "money", 6);
    const investorsCue = wordCue(words, "investor", moneyCue + 30);
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Spring-in pie icon decoration
    const iconSpring = spring({
        frame: frame - investorsCue - 14,
        fps,
        config: { damping: 12, stiffness: 140, mass: 0.6 },
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad>
                <Eyebrow delay={2} color={colors.accent}>EQUITY · FUNDING · MADE PLAIN</Eyebrow>
                <Hairline delay={16} color={colors.line} />
                <div style={{ marginTop: space.s7 }}>
                    <InkWipeLine
                        text="Where does startup"
                        delay={moneyCue}
                        size={88}
                        stagger={1.6}
                    />
                    <InkWipeLine
                        text="money come from?"
                        delay={moneyCue + 16}
                        size={108}
                        color={colors.accent}
                        stagger={2.0}
                    />
                    <div style={{ marginTop: space.s5 }}>
                        <InkWipeLine
                            text="And what do investors"
                            delay={investorsCue}
                            size={64}
                            color={colors.mute}
                            stagger={1.4}
                        />
                        <InkWipeLine
                            text="actually buy?"
                            delay={investorsCue + 18}
                            size={80}
                            stagger={1.6}
                        />
                    </div>
                </div>
            </ScenePad>

            {/* Decorative pie icon bottom right */}
            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <g
                    transform={`translate(880 1700) scale(${iconSpring})`}
                    opacity={iconSpring}
                >
                    <Pie
                        cx={0}
                        cy={0}
                        r={90}
                        slices={[
                            { value: 70, color: colors.ink, percentLabel: false },
                            { value: 30, color: colors.accent, percentLabel: false },
                        ]}
                        drawDuration={1}
                    />
                </g>
            </svg>
        </AbsoluteFill>
    );
};

/* ─── Scene 02 — Pizza intro (founder owns 100%) ─────────────────── */
const PizzaScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const pizzaCue = wordCue(words, "pizza", 6);
    const founderCue = wordCue(words, "founder", pizzaCue + 30);

    const counterT = interpolate(frame - founderCue, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const pct = Math.round(100 * counterT);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>STEP ONE · YOUR COMPANY</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <div style={{ marginTop: space.s4 }}>
                    <span
                        style={{
                            fontFamily: fonts.display,
                            fontWeight: 900,
                            fontSize: 76,
                            color: colors.ink,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.0,
                        }}
                    >
                        is a pizza.
                    </span>
                </div>
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Pie
                    cx={540}
                    cy={1100}
                    r={300}
                    growFrom={20}
                    growAt={pizzaCue}
                    growDuration={26}
                    slices={[
                        {
                            value: 100,
                            color: colors.accent,
                            label: "Founder",
                            appearAt: pizzaCue,
                            percentLabel: false,
                        },
                    ]}
                    drawDuration={28}
                />
            </svg>

            {/* Big 100% counter */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1500,
                    textAlign: "center",
                    opacity: counterT,
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.18em",
                    }}
                >
                    FOUNDER OWNERSHIP
                </span>
                <div
                    style={{
                        marginTop: 4,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 180,
                        color: colors.accent,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {pct}
                    <span style={{ fontSize: 80 }}>%</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 03 — Valuation = price tag on the pizza ──────────────── */
const ValuationScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const valuationCue = wordCue(words, "valuation", 8);
    const millionCue = wordCue(words, "million", valuationCue + 24);
    const tenCue = wordCue(words, "ten", millionCue + 24);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>VALUATION</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <div style={{ marginTop: space.s4 }}>
                    <span
                        style={{
                            fontFamily: fonts.bodyItalic,
                            fontStyle: "italic",
                            fontSize: 44,
                            color: colors.mute,
                            lineHeight: 1.2,
                        }}
                    >
                        How much is the pizza worth?
                    </span>
                </div>
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Pie
                    cx={420}
                    cy={1100}
                    r={260}
                    slices={[
                        {
                            value: 100,
                            color: colors.ink,
                            label: "Founder",
                            appearAt: 0,
                            percentLabel: false,
                        },
                    ]}
                    drawDuration={1}
                />

                {/* $1M tag flies in on millionCue */}
                <g opacity={interpolate(useCurrentFrame() - tenCue, [-10, 0], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                })}>
                    <DollarTag
                        x={860}
                        y={950}
                        value="$1M"
                        delay={millionCue}
                        fontSize={120}
                        bgColor={colors.ink}
                        color={colors.paper}
                        label="VALUATION"
                    />
                </g>

                {/* $10M tag swaps in on tenCue */}
                <DollarTag
                    x={860}
                    y={1100}
                    value="$10M"
                    delay={tenCue}
                    fontSize={150}
                    bgColor={colors.accent}
                    color={colors.paper}
                    label="OR EVEN MORE"
                />
            </svg>
        </AbsoluteFill>
    );
};

/* ─── Scene 04 — Investor pays cash, takes a slice ──────────────── */
const InvestorsScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const cashCue = wordCue(words, "cash", 8);
    const sliceCue = wordCue(words, "slice", cashCue + 24);

    const slices: PieSlice[] = [
        {
            value: 80,
            color: colors.ink,
            label: "Founder",
            appearAt: 0,
            percentLabel: true,
            textColor: colors.paper,
        },
        {
            value: 20,
            color: colors.accent,
            label: "Investor",
            appearAt: 0,
            percentLabel: true,
            textColor: colors.paper,
            detachAt: sliceCue,
            detachDistance: 220,
        },
    ];

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.pos}>THE DEAL</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <div style={{ marginTop: space.s4 }}>
                    <span
                        style={{
                            fontFamily: fonts.display,
                            fontWeight: 900,
                            fontSize: 56,
                            color: colors.ink,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.05,
                        }}
                    >
                        Cash in.{" "}
                        <span style={{ color: colors.accent }}>Slice out.</span>
                    </span>
                </div>
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Pie
                    cx={540}
                    cy={1100}
                    r={280}
                    slices={slices}
                    drawDuration={1}
                />

                {/* Money bill flies in toward pie */}
                <MoneyBill
                    fromX={-100}
                    fromY={1100}
                    toX={420}
                    toY={1100}
                    startFrame={cashCue}
                    endFrame={cashCue + 28}
                    arcHeight={-150}
                    width={180}
                    height={90}
                    label="$200K"
                />
            </svg>

            {/* Numbers below */}
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    bottom: 200,
                    textAlign: "center",
                    opacity: interpolate(useCurrentFrame() - sliceCue - 20, [0, 20], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <div
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 38,
                        color: colors.mute,
                        letterSpacing: "0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    <span style={{ color: colors.pos, fontWeight: 700 }}>$200K</span>{" "}
                    for{" "}
                    <span style={{ color: colors.accent, fontWeight: 700 }}>20%</span>{" "}
                    of a{" "}
                    <span style={{ color: colors.ink, fontWeight: 700 }}>$1M</span> pizza.
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 05 — Three rounds, three pizzas ──────────────────────── */
const RoundsScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const preseedCue = wordCue(words, "pre-seed", wordCue(words, "preseed", wordCue(words, "seed", 8)));
    // First "seed" might match "pre-seed"; advance to find a *standalone* seed
    const seedCue = (() => {
        const psWord = words.find((w) => w.word.toLowerCase().includes("pre"));
        const psFrame = psWord?.endFrame ?? 0;
        for (const w of words) {
            const lw = w.word.toLowerCase().replace(/[^a-z]/g, "");
            if (lw === "seed" && w.startFrame > psFrame + 4) return w.startFrame;
        }
        return preseedCue + 30;
    })();
    const seriesCue = wordCue(words, "series", seedCue + 30);

    const Round: React.FC<{
        cx: number;
        cy: number;
        r: number;
        appearAt: number;
        label: string;
        valuation: string;
        investorPct: number;
        investorColor: string;
    }> = ({ cx, cy, r, appearAt, label, valuation, investorPct, investorColor }) => (
        <g>
            <Pie
                cx={cx}
                cy={cy}
                r={r}
                growFrom={r * 0.2}
                growAt={appearAt}
                growDuration={20}
                slices={[
                    {
                        value: 100 - investorPct,
                        color: colors.ink,
                        appearAt,
                        percentLabel: false,
                        textColor: colors.paper,
                    },
                    {
                        value: investorPct,
                        color: investorColor,
                        appearAt,
                        percentLabel: false,
                        textColor: colors.paper,
                    },
                ]}
                drawDuration={20}
            />
            <text
                x={cx}
                y={cy + r + 50}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={22}
                fill={colors.mute}
                letterSpacing="0.14em"
                fontWeight={700}
                opacity={interpolate(useCurrentFrame() - appearAt, [10, 24], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                })}
            >
                {label.toUpperCase()}
            </text>
            <text
                x={cx}
                y={cy + r + 86}
                textAnchor="middle"
                fontFamily={fonts.display}
                fontWeight={900}
                fontSize={42}
                fill={colors.ink}
                letterSpacing="-0.02em"
                opacity={interpolate(useCurrentFrame() - appearAt, [14, 28], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                })}
            >
                {valuation}
            </text>
        </g>
    );

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>FUNDING ROUNDS</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <div style={{ marginTop: space.s4 }}>
                    <span
                        style={{
                            fontFamily: fonts.display,
                            fontWeight: 900,
                            fontSize: 56,
                            color: colors.ink,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.0,
                        }}
                    >
                        Bigger pizza.{" "}
                        <span style={{ color: colors.accent }}>Higher price.</span>
                    </span>
                </div>
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Round
                    cx={200}
                    cy={1100}
                    r={120}
                    appearAt={preseedCue}
                    label="Pre-Seed"
                    valuation="$1M"
                    investorPct={10}
                    investorColor={colors.warn}
                />
                <FlowArrow
                    x={340}
                    y={1100}
                    length={120}
                    delay={seedCue - 4}
                    duration={16}
                    thickness={5}
                />
                <Round
                    cx={540}
                    cy={1100}
                    r={170}
                    appearAt={seedCue}
                    label="Seed"
                    valuation="$5M"
                    investorPct={20}
                    investorColor={colors.accent}
                />
                <FlowArrow
                    x={730}
                    y={1100}
                    length={120}
                    delay={seriesCue - 4}
                    duration={16}
                    thickness={5}
                />
                <Round
                    cx={900}
                    cy={1100}
                    r={220}
                    appearAt={seriesCue}
                    label="Series A"
                    valuation="$25M"
                    investorPct={25}
                    investorColor={colors.pos}
                />
            </svg>
        </AbsoluteFill>
    );
};

/* ─── Scene 06 — Dilution upside ─────────────────────────────────── */
const DilutionScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const smallerCue = wordCue(words, "smaller", 6);
    const biggerCue = wordCue(words, "bigger", smallerCue + 24);
    const worthCue = wordCue(words, "worth", biggerCue + 24);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>THE PUNCHLINE</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                {/* LEFT: Day 1, 100% of $1M */}
                <Pie
                    cx={280}
                    cy={950}
                    r={140}
                    slices={[
                        {
                            value: 100,
                            color: colors.ink,
                            appearAt: 0,
                            percentLabel: false,
                        },
                    ]}
                    drawDuration={1}
                />
                <text
                    x={280}
                    y={1140}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={20}
                    fill={colors.mute}
                    letterSpacing="0.14em"
                    fontWeight={700}
                >
                    DAY ONE
                </text>
                <text
                    x={280}
                    y={1180}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={48}
                    fill={colors.ink}
                >
                    100% × $1M
                </text>
                <text
                    x={280}
                    y={1230}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={28}
                    fill={colors.mute}
                    fontVariantNumeric="tabular-nums"
                >
                    = $1M
                </text>

                {/* ARROW */}
                <FlowArrow
                    x={460}
                    y={950}
                    length={140}
                    delay={biggerCue - 4}
                    duration={20}
                    thickness={6}
                    color={colors.accent}
                />

                {/* RIGHT: Series A, 60% of $25M, growing pie */}
                <Pie
                    cx={800}
                    cy={950}
                    r={240}
                    growFrom={140}
                    growAt={biggerCue}
                    growDuration={26}
                    slices={[
                        {
                            value: 60,
                            color: colors.accent,
                            appearAt: smallerCue,
                            percentLabel: false,
                        },
                        {
                            value: 40,
                            color: colors.ink,
                            appearAt: smallerCue,
                            percentLabel: false,
                        },
                    ]}
                    drawDuration={1}
                />
                <text
                    x={800}
                    y={1240}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={20}
                    fill={colors.mute}
                    letterSpacing="0.14em"
                    fontWeight={700}
                    opacity={interpolate(frame - biggerCue, [0, 18], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    })}
                >
                    AFTER SERIES A
                </text>
                <text
                    x={800}
                    y={1280}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={48}
                    fill={colors.ink}
                    opacity={interpolate(frame - biggerCue, [4, 22], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    })}
                >
                    60% × $25M
                </text>
            </svg>

            {/* Big punchline number */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1450,
                    textAlign: "center",
                    opacity: interpolate(frame - worthCue, [0, 18], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 24,
                        color: colors.mute,
                        letterSpacing: "0.18em",
                    }}
                >
                    YOUR SLICE IS NOW WORTH
                </span>
                <div
                    style={{
                        marginTop: 10,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 220,
                        color: colors.pos,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    $15M
                </div>
                <div
                    style={{
                        marginTop: 8,
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 36,
                        color: colors.ink,
                    }}
                >
                    A smaller slice of a{" "}
                    <MarkerHighlight delay={worthCue + 24} duration={20} behind>
                        much bigger pie.
                    </MarkerHighlight>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 07 — Outro ───────────────────────────────────────────── */
const OutroScene: React.FC<{ total: number }> = ({ total }) => {
    const opacity = useSceneFade(6, 8, total);
    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="center">
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: space.s5,
                    }}
                >
                    <Hairline delay={2} color={colors.line} />
                    <div style={{ display: "flex", alignItems: "center", gap: space.s4 }}>
                        <DotMark size={36} delay={4} />
                        <span
                            style={{
                                fontFamily: fonts.display,
                                fontWeight: 900,
                                fontSize: 88,
                                color: colors.ink,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            made plain
                        </span>
                    </div>
                    <div
                        style={{
                            marginTop: space.s5,
                            fontFamily: fonts.bodyItalic,
                            fontStyle: "italic",
                            fontSize: 44,
                            color: colors.ink,
                            lineHeight: 1.2,
                        }}
                    >
                        Smaller slice.
                        <br />
                        Bigger pie.{" "}
                        <span style={{ color: colors.accent }}>Bigger life.</span>
                    </div>
                </div>
            </ScenePad>
        </AbsoluteFill>
    );
};

const SceneRouter: React.FC<{ scene: SceneManifest }> = ({ scene }) => {
    const total = scene.durationFrames;
    const props = { words: scene.words, total };
    switch (scene.id) {
        case "01-title":
            return <TitleScene {...props} />;
        case "02-pizza":
            return <PizzaScene {...props} />;
        case "03-valuation":
            return <ValuationScene {...props} />;
        case "04-investors":
            return <InvestorsScene {...props} />;
        case "05-rounds":
            return <RoundsScene {...props} />;
        case "06-dilution":
            return <DilutionScene {...props} />;
        case "07-outro":
            return <OutroScene total={total} />;
        default:
            return null;
    }
};

export const EquityPie: React.FC = () => {
    return (
        <AbsoluteFill>
            <PaperBackground />
            {manifest.scenes.map((scene) => (
                <Sequence
                    key={scene.id}
                    from={scene.startFrame}
                    durationInFrames={scene.durationFrames}
                    name={scene.id}
                >
                    <Audio src={staticFile(`equity-pie/voiceover/${scene.audio}`)} />
                    <SceneRouter scene={scene as SceneManifest} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
