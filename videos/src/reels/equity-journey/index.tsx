import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Easing,
    spring,
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
import {
    Pie,
    DilutionPie,
    InvestmentCheque,
    DollarTag,
    MoneyBill,
    FlowArrow,
    RoundBadge,
    InvestorChip,
    ValuationStack,
    CapTable,
    PriceTicker,
    StakeBar,
    type CapRow,
    type PieSlice,
    type DilutionSlice,
} from "../../brand/svg";
import { colors, ease, space, REEL } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

/* ───────────────────────────────────────────────────────────────────
   Equity Journey — From two founders to a $500M acquisition.
   Voice: Laura (energetic, social media, young female).
   Durations driven entirely by voiceover/manifest.json.
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

const manifest = manifestJson as Manifest;

export const EQUITY_JOURNEY_DURATION = manifest.totalFrames;

/** Find the start frame (scene-local) of the first word containing `needle`. */
function wordCue(words: Word[], needle: string, fallback = 0): number {
    const n = needle.toLowerCase();
    for (const w of words) {
        if (w.word.toLowerCase().includes(n)) return w.startFrame;
    }
    return fallback;
}

const easeQ = (t: number) => Easing.bezier(...ease.quart)(t);

/* Stakeholder palette — strictly inside the token system.
   Founders are the warm pair (accent / warn). Investors run from
   green (angels) through the warm-grey scale, with `neg` reserved
   for the latest round so the most recent dilution reads loudest. */
const HOLDER_COLORS = {
    maya: colors.accent, // terracotta — primary accent
    alex: colors.warn, // ochre
    angels: colors.pos, // green — "first money in, biggest multiple"
    seed: colors.mute2, // warm grey
    seriesA: colors.mute, // lighter warm grey
    seriesB: colors.neg, // deep red-brown — newest, biggest cheque
} as const;

/* ─── Reusable: full-canvas SVG wrapper ──────────────────────────── */
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg
        viewBox={`0 0 ${REEL.width} ${REEL.height}`}
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
    >
        {children}
    </svg>
);

/* ─── Scene 01 — Hook (rising arrow + title) ─────────────────────── */
const HookScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const twoCue = wordCue(words, "two", 6);
    const halfCue = wordCue(words, "half", twoCue + 24);
    const followCue = wordCue(words, "follow", halfCue + 18);

    // Arrow climbs from (140, 1700) to (940, 380) between twoCue and halfCue+10
    const arrowT = interpolate(frame - twoCue, [0, 56], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const ax = 140 + (940 - 140) * arrowT;
    const ay = 1700 + (380 - 1700) * arrowT;

    // $500M label snap
    const tagSpring = spring({
        frame: frame - halfCue,
        fps: REEL.fps,
        config: { damping: 12, stiffness: 160, mass: 0.6 },
    });

    // Faint floating numbers — anchored end, sitting up-left of the arrow line
    // so the line never crosses the text. Use textAnchor="end" so each label
    // ends just before the arrow rises into its column.
    const ghosts = [
        { x: 200, y: 1530, label: "$1M" },
        { x: 320, y: 1330, label: "$4M" },
        { x: 470, y: 1080, label: "$20M" },
        { x: 630, y: 810, label: "$50M" },
        { x: 790, y: 540, label: "$150M" },
    ];

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>EQUITY · A FULL JOURNEY</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <Stage>
                {/* Ghost milestones */}
                {ghosts.map((g, i) => {
                    const t = interpolate(
                        frame - (twoCue + i * 6),
                        [0, 18, 50, 70],
                        [0, 0.55, 0.55, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    return (
                        <text
                            key={g.label}
                            x={g.x}
                            y={g.y}
                            textAnchor="end"
                            fontFamily={fonts.mono}
                            fontSize={34}
                            fontWeight={700}
                            fill={colors.mute}
                            opacity={t}
                            letterSpacing="0.06em"
                        >
                            {g.label}
                        </text>
                    );
                })}

                {/* Arrow path */}
                <line
                    x1={140}
                    y1={1700}
                    x2={ax}
                    y2={ay}
                    stroke={colors.accent}
                    strokeWidth={8}
                    strokeLinecap="round"
                    opacity={arrowT > 0 ? 1 : 0}
                />
                {/* Arrowhead */}
                {arrowT > 0.05 && (
                    <g transform={`translate(${ax} ${ay}) rotate(${(Math.atan2(380 - 1700, 940 - 140) * 180) / Math.PI})`}>
                        <polygon
                            points="0,0 -28,-12 -28,12"
                            fill={colors.accent}
                        />
                    </g>
                )}

                {/* $0 origin label */}
                <text
                    x={140}
                    y={1740}
                    fontFamily={fonts.mono}
                    fontSize={34}
                    fontWeight={700}
                    fill={colors.mute}
                    letterSpacing="0.1em"
                >
                    $0
                </text>

                {/* $500,000,000 destination — anchored centre-top so it fits the 1080 canvas */}
                <g transform={`translate(540 340) scale(${tagSpring})`} opacity={tagSpring}>
                    <rect x={-440} y={-58} width={880} height={104} rx={10} fill={colors.accent} />
                    <text
                        x={0}
                        y={20}
                        textAnchor="middle"
                        fontFamily={fonts.display}
                        fontWeight={900}
                        fontSize={62}
                        fill={colors.paper}
                        letterSpacing="-0.02em"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        $500,000,000
                    </text>
                </g>
            </Stage>

            {/* Title strip */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 220,
                    padding: `0 ${space.s8}px`,
                }}
            >
                <InkWipeLine
                    text="Two founders."
                    delay={followCue}
                    size={84}
                    stagger={2.0}
                />
                <InkWipeLine
                    text="One company."
                    delay={followCue + 18}
                    size={84}
                    color={colors.accent}
                    stagger={2.0}
                />
                <InkWipeLine
                    text="Five rounds. One exit."
                    delay={followCue + 36}
                    size={56}
                    color={colors.mute}
                    stagger={1.4}
                />
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 02 — Day 0 founding ──────────────────────────────────── */
const FoundingScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const mayaCue = wordCue(words, "maya", 6);
    const alexCue = wordCue(words, "alex", mayaCue + 14);
    const splitCue = wordCue(words, "sixty", alexCue + 18);
    const sharesCue = wordCue(words, "ten", splitCue + 30);
    const nothingCue = wordCue(words, "nothing", sharesCue + 30);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>DAY ONE · FOUNDING</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <span
                    style={{
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 76,
                        color: colors.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.0,
                        marginTop: space.s4,
                    }}
                >
                    Two people. One pie.
                </span>
            </ScenePad>

            <Stage>
                {/* Avatars */}
                <InvestorChip x={300} y={620} label="Maya · CEO" color={HOLDER_COLORS.maya} delay={mayaCue} size={140} />
                <InvestorChip x={780} y={620} label="Alex · CTO" color={HOLDER_COLORS.alex} delay={alexCue} size={140} />

                {/* Pie 60/40 — moved up to leave clear space above cap table */}
                <g transform="translate(0 -40)">
                    <Pie
                        cx={540}
                        cy={1020}
                        r={220}
                        growFrom={20}
                        growAt={splitCue}
                        growDuration={26}
                        slices={[
                            { value: 60, color: HOLDER_COLORS.maya, label: "Maya", appearAt: splitCue, textColor: colors.paper },
                            { value: 40, color: HOLDER_COLORS.alex, label: "Alex", appearAt: splitCue + 6, textColor: colors.paper },
                        ]}
                        drawDuration={26}
                    />
                </g>

                {/* Cap table — pushed down to clear pie */}
                <g transform="translate(100 1380)">
                    <CapTable
                        x={0}
                        y={0}
                        width={880}
                        title="Cap table — Day 0"
                        rows={[
                            { holder: "Maya", shares: "6,000,000", pct: "60%", color: HOLDER_COLORS.maya, appearAt: sharesCue + 6, highlightUntil: sharesCue + 60 },
                            { holder: "Alex", shares: "4,000,000", pct: "40%", color: HOLDER_COLORS.alex, appearAt: sharesCue + 22, highlightUntil: sharesCue + 80 },
                        ]}
                    />
                </g>

                {/* Share price ticker — moved to bottom band, well below cap table */}
                <g transform="translate(540 1820)" opacity={interpolate(frame - nothingCue, [-6, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    <PriceTicker x={0} y={0} value={0} fontSize={68} caption="Share price" />
                </g>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 03 — Valuation primer ────────────────────────────────── */
const ValuationPrimerScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const preCue = wordCue(words, "pre-money", wordCue(words, "pre", 6));
    const cashCue = wordCue(words, "cash", preCue + 30);
    const postCue = wordCue(words, "post-money", wordCue(words, "post", cashCue + 30));
    const thatsCue = wordCue(words, "that", postCue + 24);

    // Diagram coords
    const baseX = 140;
    const rowY1 = 720;
    const rowY2 = 920;
    const rowY3 = 1120;
    const w1 = 540;
    const w2 = 220;
    const w3 = 760;
    const rowH = 80;

    const drawT = (cue: number) =>
        interpolate(frame - cue, [0, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeQ,
        });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>TWO WORDS</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <span
                    style={{
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 80,
                        color: colors.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.0,
                        marginTop: space.s4,
                    }}
                >
                    Pre-money.<br />
                    <span style={{ color: colors.accent }}>Post-money.</span>
                </span>
            </ScenePad>

            <Stage>
                {/* Pre-money bar */}
                <text x={baseX} y={rowY1 - 28} fontFamily={fonts.mono} fontSize={36} fontWeight={700} fill={colors.mute} letterSpacing="0.14em" opacity={drawT(preCue)}>PRE-MONEY · $3M</text>
                <rect x={baseX} y={rowY1} width={w1 * drawT(preCue)} height={rowH} fill={colors.mute2} rx={6} />

                {/* + Cash bar */}
                <text x={baseX} y={rowY2 - 28} fontFamily={fonts.mono} fontSize={36} fontWeight={700} fill={colors.pos} letterSpacing="0.14em" opacity={drawT(cashCue)}>+ CASH · $1M</text>
                <rect x={baseX} y={rowY2} width={w2 * drawT(cashCue)} height={rowH} fill={colors.pos} rx={6} />

                {/* = Post-money bar */}
                <text x={baseX} y={rowY3 - 28} fontFamily={fonts.mono} fontSize={36} fontWeight={700} fill={colors.accent} letterSpacing="0.14em" opacity={drawT(postCue)}>= POST-MONEY · $4M</text>
                <rect x={baseX} y={rowY3} width={w3 * drawT(postCue)} height={rowH} fill={colors.accent} rx={6} />

                {/* Formula */}
                <g transform="translate(540 1420)" opacity={drawT(thatsCue)}>
                    <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={40}
                        fill={colors.mute}
                        letterSpacing="0.06em"
                    >
                        share price = post-money ÷ total shares
                    </text>
                </g>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── RoundScene — generic template for funding rounds 04–07 ─────── */
type RoundParams = {
    eyebrow: string;
    title: string;
    titleAccent: string;
    /** Pre-money valuation in $M. */
    pre: number;
    /** Cash invested in $M. */
    cash: number;
    /** Post-money valuation in $M. */
    post: number;
    /** Display label for the cheque (e.g. "$1M"). */
    chequeAmount: string;
    /** Display label for the cheque payee (e.g. "Three Angels"). */
    chequePayee?: string;
    /** Animated slices: previous-round % → new-round %.
        New investor has valueFrom=0. Math: sum of valueTo = 100. */
    slices: DilutionSlice[];
    capRows: CapRow[];
    tickerFrom: number;
    tickerTo: number;
    asideCaption?: string;
    mayaStakeFrom?: number;
    mayaStakeTo?: number;
};

const RoundScene: React.FC<{
    words: Word[];
    total: number;
    params: RoundParams;
    /** Word that triggers the cheque fly-in (and dilution shortly after). */
    chequeCueWord: string;
    /** Word that triggers post-money valuation reveal + ticker roll. */
    postCueWord: string;
}> = ({ words, total, params, chequeCueWord, postCueWord }) => {
    const opacity = useSceneFade(8, 18, total);
    const frame = useCurrentFrame();

    const chequeCue = wordCue(words, chequeCueWord, 24);
    const dilutionCue = chequeCue + 28; // dilution starts ~1s after cheque lands
    const postCue = Math.max(wordCue(words, postCueWord, dilutionCue + 36), dilutionCue + 30);
    const tickerCue = postCue + 6;

    // Pre-money valuation reveal (fades in on scene start)
    const preT = interpolate(frame, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    // Post-money valuation reveal (fades in on postCue)
    const postT = interpolate(frame - postCue, [0, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });

    const stakeT =
        params.mayaStakeFrom !== undefined && params.mayaStakeTo !== undefined
            ? interpolate(frame - tickerCue, [0, 26], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeQ,
            })
            : 0;
    const mayaStake =
        params.mayaStakeFrom !== undefined && params.mayaStakeTo !== undefined
            ? params.mayaStakeFrom + (params.mayaStakeTo - params.mayaStakeFrom) * stakeT
            : 0;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>{params.eyebrow}</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <Stage>
                {/* Pre-money / Post-money side-by-side row — the "title" of the scene */}
                <g transform="translate(0 270)" opacity={preT}>
                    <text x={70} y={0} fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.mute} letterSpacing="0.22em">PRE-MONEY</text>
                    <text x={70} y={84} fontFamily={fonts.display} fontWeight={900} fontSize={88} fill={colors.ink} letterSpacing="-0.03em" style={{ fontVariantNumeric: "tabular-nums" }}>
                        ${params.pre}M
                    </text>
                </g>
                <g transform="translate(0 270)" opacity={postT}>
                    <text x={1010} y={0} textAnchor="end" fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.accent} letterSpacing="0.22em">POST-MONEY</text>
                    <text x={1010} y={84} textAnchor="end" fontFamily={fonts.display} fontWeight={900} fontSize={88} fill={colors.accent} letterSpacing="-0.03em" style={{ fontVariantNumeric: "tabular-nums" }}>
                        ${params.post}M
                    </text>
                </g>
                {/* Connector arrow between pre and post */}
                <g opacity={postT}>
                    <line x1={430} y1={340} x2={650} y2={340} stroke={colors.line} strokeWidth={2} strokeDasharray="6 8" />
                    <polygon points="650,332 670,340 650,348" fill={colors.line} />
                </g>

                {/* Pie — animates from previous-round state to current-round state */}
                <DilutionPie
                    cx={540}
                    cy={700}
                    r={250}
                    slices={params.slices}
                    startFrame={dilutionCue}
                    holdFrames={0}
                    tweenFrames={36}
                    labelSize={28}
                />

                {/* Investment cheque — flies in on chequeCue */}
                <InvestmentCheque
                    x={540}
                    y={1100}
                    width={840}
                    height={240}
                    amount={params.chequeAmount}
                    payee={params.chequePayee}
                    startFrame={chequeCue}
                    color={colors.accent}
                />

                {/* Cap table — pushed down to leave breathing room below cheque */}
                <g transform="translate(70 1310)">
                    <CapTable
                        x={0}
                        y={0}
                        width={940}
                        rowHeight={50}
                        title="Cap table"
                        rows={params.capRows}
                        showTotals={false}
                    />
                </g>

                {/* Bottom band — share price + Maya stake, well below cap table */}
                <g transform="translate(280 1820)">
                    <PriceTicker
                        x={0}
                        y={0}
                        value={params.tickerTo}
                        rollAt={tickerCue}
                        rollFrom={params.tickerFrom}
                        rollDuration={26}
                        fontSize={56}
                    />
                </g>

                {/* Maya stake counter */}
                {params.mayaStakeFrom !== undefined && params.mayaStakeTo !== undefined && (
                    <g transform="translate(820 1820)" opacity={stakeT}>
                        <text x={0} y={-44} textAnchor="middle" fontFamily={fonts.mono} fontSize={22} fontWeight={700} fill={colors.mute} letterSpacing="0.18em">
                            MAYA&apos;S STAKE
                        </text>
                        <text x={0} y={20} textAnchor="middle" fontFamily={fonts.display} fontWeight={900} fontSize={64} fill={HOLDER_COLORS.maya} letterSpacing="-0.03em" style={{ fontVariantNumeric: "tabular-nums" }}>
                            ${mayaStake.toFixed(1)}M
                        </text>
                    </g>
                )}
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 08 — Reveal: % down vs $ up ──────────────────────────── */
const RevealScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const downCue = wordCue(words, "down", 6);
    const upCue = wordCue(words, "up", downCue + 20);
    const tradeCue = wordCue(words, "trade", upCue + 30);

    const baseY = 1280;
    const cols = [
        { label: "Day 0", pctH: 60, dollarH: 0, dollar: "$0" },
        { label: "Pre", pctH: 45, dollarH: 30, dollar: "$1.8M" },
        { label: "Seed", pctH: 36, dollarH: 100, dollar: "$7.2M" },
        { label: "A", pctH: 28.8, dollarH: 180, dollar: "$14.4M" },
        { label: "B", pctH: 23, dollarH: 360, dollar: "$34.5M" },
    ];
    // Scale: % bars max 60 → 360px height. $ bars max $34.5M → 360px.
    const pctScale = 6;
    const xLeftStart = 100;
    const xRightStart = 600;
    const colWidth = 80;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>THE TRADE</Eyebrow>
                <Hairline delay={14} color={colors.line} />
                <span
                    style={{
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 72,
                        color: colors.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.0,
                        marginTop: space.s4,
                    }}
                >
                    Smaller slice.<br />
                    <span style={{ color: colors.accent }}>Bigger pie.</span>
                </span>
            </ScenePad>

            <Stage>
                {/* Divider */}
                <line x1={540} y1={620} x2={540} y2={1380} stroke={colors.line} strokeWidth={2} />

                {/* Left side: % down */}
                <text x={300} y={600} textAnchor="middle" fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.mute} letterSpacing="0.18em" opacity={interpolate(frame - downCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>MAYA · OWNERSHIP %</text>
                {cols.map((c, i) => (
                    <StakeBar
                        key={`pct-${c.label}`}
                        x={xLeftStart + i * colWidth}
                        baseY={baseY}
                        height={c.pctH * pctScale}
                        width={56}
                        startFrame={downCue + i * 6}
                        color={HOLDER_COLORS.maya}
                        caption={c.label}
                        valueLabel={`${c.pctH}%`}
                    />
                ))}

                {/* Right side: $ up */}
                <text x={780} y={600} textAnchor="middle" fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.mute} letterSpacing="0.18em" opacity={interpolate(frame - upCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>MAYA · STAKE $ VALUE</text>
                {cols.map((c, i) => (
                    <StakeBar
                        key={`dollar-${c.label}`}
                        x={xRightStart + i * colWidth}
                        baseY={baseY}
                        height={c.dollarH * 1}
                        width={56}
                        startFrame={upCue + i * 6}
                        color={colors.pos}
                        caption={c.label}
                        valueLabel={c.dollar}
                    />
                ))}

                {/* Bottom band */}
                <foreignObject x={60} y={1500} width={960} height={260}>
                    <div
                        style={{
                            opacity: interpolate(frame - tradeCue, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                            textAlign: "center",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: fonts.bodyItalic,
                                fontStyle: "italic",
                                fontSize: 56,
                                color: colors.mute,
                                lineHeight: 1.25,
                            }}
                        >
                            % goes down. Dollars go up.<br />That&apos;s the whole game.
                        </span>
                    </div>
                </foreignObject>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 09 — Exit: $500M acquisition ─────────────────────────── */
const ExitScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const halfCue = wordCue(words, "half", 6);
    const angelsCue = wordCue(words, "angel", halfCue + 30);
    const sixtyCue = wordCue(words, "sixty", angelsCue + 24);
    const mayaCue = wordCue(words, "maya", sixtyCue + 24);
    const hundredCue = wordCue(words, "hundred", mayaCue + 12);

    const bannerSpring = spring({
        frame: frame - halfCue,
        fps: REEL.fps,
        config: { damping: 14, stiffness: 130, mass: 0.7 },
    });

    // Payouts shown in narrative order: angels first (top, named in
    // voiceover), then Maya (climax, named in voiceover), then the rest.
    const payouts = [
        { holder: "Angels", amount: "$64M", multiple: "64×", color: HOLDER_COLORS.angels, cue: angelsCue, hl: sixtyCue },
        { holder: "Seed VC", amount: "$64M", multiple: "16×", color: HOLDER_COLORS.seed, cue: angelsCue + 8 },
        { holder: "Maya", amount: "$115M", multiple: "—", color: HOLDER_COLORS.maya, cue: mayaCue, hl: hundredCue },
        { holder: "Alex", amount: "$77M", multiple: "—", color: HOLDER_COLORS.alex, cue: mayaCue + 6 },
        { holder: "Series A", amount: "$80M", multiple: "8×", color: HOLDER_COLORS.seriesA, cue: angelsCue + 16 },
        { holder: "Series B", amount: "$100M", multiple: "3.3×", color: HOLDER_COLORS.seriesB, cue: angelsCue + 24 },
    ];

    return (
        <AbsoluteFill style={{ opacity }}>
            <Stage>
                {/* Banner */}
                <g transform={`translate(540 320) scale(${bannerSpring})`} opacity={bannerSpring}>
                    <rect x={-460} y={-80} width={920} height={160} rx={12} fill={colors.accent} />
                    <text
                        x={0}
                        y={-12}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={26}
                        fontWeight={700}
                        fill={colors.paper}
                        letterSpacing="0.2em"
                    >
                        ACQUIRED
                    </text>
                    <text
                        x={0}
                        y={50}
                        textAnchor="middle"
                        fontFamily={fonts.display}
                        fontWeight={900}
                        fontSize={70}
                        fill={colors.paper}
                        letterSpacing="-0.03em"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        $500,000,000
                    </text>
                </g>

                {/* Payout grid: 2 columns × 3 rows */}
                {payouts.map((p, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const cx = 280 + col * 520;
                    const cy = 640 + row * 280;
                    const t = interpolate(frame - p.cue, [0, 18], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const flipScale = interpolate(t, [0, 0.5, 1], [0, 1.05, 1]);
                    const sparkT = p.hl !== undefined
                        ? interpolate(frame - p.hl, [0, 12, 30], [0, 1, 0], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                        : 0;
                    return (
                        <g key={p.holder} transform={`translate(${cx} ${cy}) scale(${flipScale})`} opacity={t}>
                            <rect x={-220} y={-110} width={440} height={220} rx={12} fill={colors.card} stroke={p.color} strokeWidth={4} />
                            {sparkT > 0 && (
                                <rect x={-220} y={-110} width={440} height={220} rx={12} fill={p.color} opacity={0.18 * sparkT} />
                            )}
                            <text
                                x={-200}
                                y={-60}
                                fontFamily={fonts.mono}
                                fontSize={26}
                                fontWeight={700}
                                fill={colors.mute}
                                letterSpacing="0.14em"
                            >
                                {p.holder.toUpperCase()}
                            </text>
                            <text
                                x={-200}
                                y={30}
                                fontFamily={fonts.display}
                                fontWeight={900}
                                fontSize={78}
                                fill={p.color}
                                letterSpacing="-0.03em"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {p.amount}
                            </text>
                            {p.multiple !== "—" && (
                                <text
                                    x={200}
                                    y={70}
                                    textAnchor="end"
                                    fontFamily={fonts.mono}
                                    fontSize={32}
                                    fontWeight={700}
                                    fill={colors.pos}
                                    letterSpacing="0.06em"
                                    style={{ fontVariantNumeric: "tabular-nums" }}
                                >
                                    {p.multiple}
                                </text>
                            )}
                        </g>
                    );
                })}
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 10 — Outro ───────────────────────────────────────────── */
const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);
    const frame = useCurrentFrame();
    const smallerCue = wordCue(words, "smaller", 4);
    const wholeCue = wordCue(words, "whole", smallerCue + 30);
    const wordmarkOpacity = interpolate(frame - (wholeCue + 20), [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="center">
                <DotMark delay={2} size={48} color={colors.accent} />
                <div style={{ marginTop: space.s7 }}>
                    <InkWipeLine
                        text="A smaller slice"
                        delay={smallerCue}
                        size={92}
                        stagger={1.6}
                    />
                    <InkWipeLine
                        text="of a much bigger pie."
                        delay={smallerCue + 18}
                        size={92}
                        color={colors.accent}
                        stagger={1.6}
                    />
                </div>
                <div style={{ marginTop: space.s7 }}>
                    <MarkerHighlight delay={wholeCue} color={colors.accent}>
                        <span
                            style={{
                                fontFamily: fonts.display,
                                fontWeight: 900,
                                fontSize: 76,
                                color: colors.ink,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            That&apos;s the whole game.
                        </span>
                    </MarkerHighlight>
                </div>
            </ScenePad>
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: fonts.mono,
                    fontSize: 28,
                    color: colors.mute,
                    letterSpacing: "0.32em",
                    opacity: wordmarkOpacity,
                }}
            >
                MADE PLAIN
            </div>
        </AbsoluteFill>
    );
};

/* ─── Round-scene parameter sets ─────────────────────────────────── */
/* Math note: each round's existing slices are scaled by the dilution
   factor so that (existing × factor) + new % = 100. The pie always
   sums to exactly 100 throughout the dilution tween. */

const PRESEED_PARAMS: RoundParams = {
    eyebrow: "Round 1 · Pre-seed",
    title: "Three angels.",
    titleAccent: "$1M in.",
    pre: 3,
    cash: 1,
    post: 4,
    chequeAmount: "$1M",
    chequePayee: "From: Three Angels",
    slices: [
        // factor = 0.75 (existing keeps 75%, angels take 25%)
        { id: "maya", valueFrom: 60, valueTo: 45, color: HOLDER_COLORS.maya, label: "Maya" },
        { id: "alex", valueFrom: 40, valueTo: 30, color: HOLDER_COLORS.alex, label: "Alex" },
        { id: "angels", valueFrom: 0, valueTo: 25, color: HOLDER_COLORS.angels, label: "Angels" },
    ],
    capRows: [
        { holder: "Maya", shares: "6.0M", pct: "45%", color: HOLDER_COLORS.maya, appearAt: 70 },
        { holder: "Alex", shares: "4.0M", pct: "30%", color: HOLDER_COLORS.alex, appearAt: 86 },
        { holder: "Angels", shares: "3.3M", pct: "25%", color: HOLDER_COLORS.angels, appearAt: 102, highlightUntil: 160 },
    ],
    tickerFrom: 0,
    tickerTo: 0.3,
};

const SEED_PARAMS: RoundParams = {
    eyebrow: "Round 2 · Seed",
    title: "Seed VC.",
    titleAccent: "$4M in.",
    pre: 16,
    cash: 4,
    post: 20,
    chequeAmount: "$4M",
    chequePayee: "From: Seed VC",
    slices: [
        // factor = 0.8 (existing keeps 80%, seed takes 20%)
        { id: "maya", valueFrom: 45, valueTo: 36, color: HOLDER_COLORS.maya, label: "Maya" },
        { id: "alex", valueFrom: 30, valueTo: 24, color: HOLDER_COLORS.alex, label: "Alex" },
        { id: "angels", valueFrom: 25, valueTo: 20, color: HOLDER_COLORS.angels, label: "Angels" },
        { id: "seed", valueFrom: 0, valueTo: 20, color: HOLDER_COLORS.seed, label: "Seed VC" },
    ],
    capRows: [
        { holder: "Maya", shares: "6.0M", pct: "36%", color: HOLDER_COLORS.maya, appearAt: 70 },
        { holder: "Alex", shares: "4.0M", pct: "24%", color: HOLDER_COLORS.alex, appearAt: 84 },
        { holder: "Angels", shares: "3.3M", pct: "20%", color: HOLDER_COLORS.angels, appearAt: 98 },
        { holder: "Seed VC", shares: "3.3M", pct: "20%", color: HOLDER_COLORS.seed, appearAt: 112, highlightUntil: 170 },
    ],
    tickerFrom: 0.3,
    tickerTo: 1.2,
    asideCaption: "Smaller slice — but each share is now worth 4× what it was.",
};

const SERIES_A_PARAMS: RoundParams = {
    eyebrow: "Round 3 · Series A",
    title: "Series A.",
    titleAccent: "$10M in.",
    pre: 40,
    cash: 10,
    post: 50,
    chequeAmount: "$10M",
    chequePayee: "From: Series A",
    slices: [
        // factor = 0.8 (existing keeps 80%, series A takes 20%)
        { id: "maya", valueFrom: 36, valueTo: 28.8, color: HOLDER_COLORS.maya, label: "Maya" },
        { id: "alex", valueFrom: 24, valueTo: 19.2, color: HOLDER_COLORS.alex, label: "Alex" },
        { id: "angels", valueFrom: 20, valueTo: 16, color: HOLDER_COLORS.angels, label: "Angels" },
        { id: "seed", valueFrom: 20, valueTo: 16, color: HOLDER_COLORS.seed, label: "Seed" },
        { id: "seriesA", valueFrom: 0, valueTo: 20, color: HOLDER_COLORS.seriesA, label: "Series A" },
    ],
    capRows: [
        { holder: "Maya", shares: "6.0M", pct: "29%", color: HOLDER_COLORS.maya, appearAt: 70 },
        { holder: "Alex", shares: "4.0M", pct: "19%", color: HOLDER_COLORS.alex, appearAt: 82 },
        { holder: "Angels", shares: "3.3M", pct: "16%", color: HOLDER_COLORS.angels, appearAt: 94 },
        { holder: "Seed VC", shares: "3.3M", pct: "16%", color: HOLDER_COLORS.seed, appearAt: 106 },
        { holder: "Series A", shares: "4.2M", pct: "20%", color: HOLDER_COLORS.seriesA, appearAt: 118, highlightUntil: 170 },
    ],
    tickerFrom: 1.2,
    tickerTo: 3.0,
    mayaStakeFrom: 7.2,
    mayaStakeTo: 14.4,
};

const SERIES_B_PARAMS: RoundParams = {
    eyebrow: "Round 4 · Series B",
    title: "Series B.",
    titleAccent: "$30M in.",
    pre: 120,
    cash: 30,
    post: 150,
    chequeAmount: "$30M",
    chequePayee: "From: Series B",
    slices: [
        // factor = 0.8 (existing keeps 80%, series B takes 20%)
        { id: "maya", valueFrom: 28.8, valueTo: 23, color: HOLDER_COLORS.maya, label: "Maya" },
        { id: "alex", valueFrom: 19.2, valueTo: 15.4, color: HOLDER_COLORS.alex, label: "Alex" },
        { id: "angels", valueFrom: 16, valueTo: 12.8, color: HOLDER_COLORS.angels, label: "Angels" },
        { id: "seed", valueFrom: 16, valueTo: 12.8, color: HOLDER_COLORS.seed, label: "Seed" },
        { id: "seriesA", valueFrom: 16, valueTo: 12.8, color: HOLDER_COLORS.seriesA, label: "A" },
        { id: "seriesB", valueFrom: 0, valueTo: 23.2, color: HOLDER_COLORS.seriesB, label: "Series B" },
    ],
    capRows: [
        { holder: "Maya", shares: "6.0M", pct: "23%", color: HOLDER_COLORS.maya, appearAt: 70 },
        { holder: "Alex", shares: "4.0M", pct: "15%", color: HOLDER_COLORS.alex, appearAt: 80 },
        { holder: "Angels", shares: "3.3M", pct: "13%", color: HOLDER_COLORS.angels, appearAt: 90 },
        { holder: "Seed VC", shares: "3.3M", pct: "13%", color: HOLDER_COLORS.seed, appearAt: 100 },
        { holder: "Series A", shares: "4.2M", pct: "13%", color: HOLDER_COLORS.seriesA, appearAt: 110 },
        { holder: "Series B", shares: "5.9M", pct: "23%", color: HOLDER_COLORS.seriesB, appearAt: 120, highlightUntil: 180 },
    ],
    tickerFrom: 3.0,
    tickerTo: 6.0,
    mayaStakeFrom: 14.4,
    mayaStakeTo: 34.5,
};

/* ─── Scene router ───────────────────────────────────────────────── */
const SceneRouter: React.FC<{ id: string; words: Word[]; total: number }> = ({ id, words, total }) => {
    switch (id) {
        case "01-hook":
            return <HookScene words={words} total={total} />;
        case "02-founding":
            return <FoundingScene words={words} total={total} />;
        case "03-valuation":
            return <ValuationPrimerScene words={words} total={total} />;
        case "04-preseed":
            return (
                <RoundScene
                    words={words}
                    total={total}
                    params={PRESEED_PARAMS}
                    chequeCueWord="million"
                    postCueWord="afterward"
                />
            );
        case "05-seed":
            return (
                <RoundScene
                    words={words}
                    total={total}
                    params={SEED_PARAMS}
                    chequeCueWord="million"
                    postCueWord="twenty"
                />
            );
        case "06-seriesA":
            return (
                <RoundScene
                    words={words}
                    total={total}
                    params={SERIES_A_PARAMS}
                    chequeCueWord="million"
                    postCueWord="fifty"
                />
            );
        case "07-seriesB":
            return (
                <RoundScene
                    words={words}
                    total={total}
                    params={SERIES_B_PARAMS}
                    chequeCueWord="thirty"
                    postCueWord="hundred"
                />
            );
        case "08-reveal":
            return <RevealScene words={words} total={total} />;
        case "09-exit":
            return <ExitScene words={words} total={total} />;
        case "10-outro":
            return <OutroScene words={words} total={total} />;
        default:
            return null;
    }
};

/* ─── Composition ────────────────────────────────────────────────── */
export const EquityJourney: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: colors.paper }}>
            <PaperBackground />

            {/* Background music — soft bed under the voiceover.
         Fades in over 1s, ducks well beneath voice (~6% loudness), fades out
         over the last 0.8s. Volume is computed per-frame relative to the
         music track itself (f starts at 0 when audio begins). */}
            <Audio
                src={staticFile("equity-journey/music.mp3")}
                volume={(f) => {
                    const fadeIn = interpolate(f, [0, REEL.fps], [0, 0.06], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const fadeOut = interpolate(
                        f,
                        [EQUITY_JOURNEY_DURATION - Math.round(REEL.fps * 0.8), EQUITY_JOURNEY_DURATION],
                        [0.06, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    return Math.min(fadeIn, fadeOut);
                }}
            />

            {manifest.scenes.map((scene) => (
                <Sequence
                    key={scene.id}
                    from={scene.startFrame}
                    durationInFrames={scene.durationFrames}
                    premountFor={REEL.fps}
                    name={scene.id}
                >
                    <Audio
                        src={staticFile(`equity-journey/voiceover/${scene.audio}`)}
                    />
                    <SceneRouter
                        id={scene.id}
                        words={scene.words}
                        total={scene.durationFrames}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
