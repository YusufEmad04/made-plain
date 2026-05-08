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
    DotMark,
    ScenePad,
    useSceneFade,
} from "../../brand/motion";
import { colors, ease, space, REEL } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

/* ───────────────────────────────────────────────────────────────────
   What A Business Actually Is — Day 1 of the May concept loop.
   Voice: Laura. Durations driven entirely by voiceover/manifest.json.
   Motif: a three-corner value-triangle (CREATE / DELIVER / CAPTURE).
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

export const WHAT_BUSINESS_ACTUALLY_IS_DURATION = manifest.totalFrames;

/** Find the start frame (scene-local) of the first word containing `needle`. */
function wordCue(words: Word[], needle: string, fallback = 0): number {
    const n = needle.toLowerCase().replace(/[.,!?]/g, "");
    for (const w of words) {
        const clean = w.word.toLowerCase().replace(/[.,!?]/g, "");
        if (clean.includes(n)) return w.startFrame;
    }
    return fallback;
}

const easeQ = (t: number) => Easing.bezier(...ease.quart)(t);

/* ─── Stage: full-canvas SVG wrapper ─────────────────────────────── */
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

/* ─── Triangle geometry & helpers ────────────────────────────────── */

type Corner = "create" | "deliver" | "capture";
type Side = "create-deliver" | "deliver-capture" | "capture-create";

type Pt = { x: number; y: number };

function triCorners(cx: number, cy: number, size: number): Record<Corner, Pt> {
    // Equilateral-ish: top apex CREATE, bottom-right DELIVER, bottom-left CAPTURE
    const h = size * 0.866;
    return {
        create: { x: cx, y: cy - h * 0.6 },
        deliver: { x: cx + size * 0.5, y: cy + h * 0.4 },
        capture: { x: cx - size * 0.5, y: cy + h * 0.4 },
    };
}

/** Animated stroke-dash "draw on" for a line segment. */
const DrawSegment: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    width?: number;
    delay?: number;
    duration?: number;
    broken?: boolean;
    breakAt?: number; // local frame when an idle line snaps to broken
    dashArray?: string;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = colors.ink,
    width = 4,
    delay = 0,
    duration = 24,
    broken = false,
    breakAt,
    dashArray,
}) => {
        const frame = useCurrentFrame();
        const len = Math.hypot(x2 - x1, y2 - y1);
        const draw = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeQ,
        });

        const isBroken =
            broken || (typeof breakAt === "number" && frame >= breakAt);
        const breakFlash = (() => {
            if (typeof breakAt !== "number") return 0;
            return interpolate(frame - breakAt, [0, 6, 18], [0, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
        })();

        const stroke = isBroken ? colors.neg : color;
        const dash = isBroken ? "10 10" : dashArray ?? `${len} ${len}`;
        const offset = isBroken ? 0 : len * (1 - draw);

        return (
            <g>
                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={width + breakFlash * 4}
                    strokeLinecap="round"
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                    opacity={isBroken ? 0.85 : 1}
                />
            </g>
        );
    };

/** A labeled triangle node with optional lit pulse. */
const TriNode: React.FC<{
    cx: number;
    cy: number;
    label: string;
    appearAt: number;
    litAt?: number;
    radius?: number;
    labelOffset?: { dx: number; dy: number };
    color?: string;
    showLabel?: boolean;
}> = ({
    cx,
    cy,
    label,
    appearAt,
    litAt,
    radius = 38,
    labelOffset,
    color = colors.ink,
    showLabel = true,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        const enter = spring({
            frame: frame - appearAt,
            fps,
            config: { damping: 12, stiffness: 180 },
            durationInFrames: 22,
        });

        const lit =
            typeof litAt === "number"
                ? interpolate(frame - litAt, [0, 14], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: easeQ,
                })
                : 0;

        const pulse =
            typeof litAt === "number"
                ? Math.max(0, Math.sin(((frame - litAt) / fps) * Math.PI * 1.4)) *
                Math.exp(-(frame - litAt) / 90)
                : 0;

        const lo = labelOffset ?? { dx: 0, dy: radius + 38 };

        return (
            <g transform={`translate(${cx}, ${cy}) scale(${enter})`}>
                {/* halo when lit */}
                <circle
                    r={radius + 14 + pulse * 12}
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth={2}
                    opacity={lit * (0.5 + pulse * 0.5)}
                />
                <circle
                    r={radius}
                    fill={interpolate(lit, [0, 1], [0, 1]) > 0 ? colors.accent : colors.paper}
                    stroke={lit > 0 ? colors.accent : color}
                    strokeWidth={3}
                    opacity={1}
                />
                <circle r={radius - 8} fill={colors.paper} opacity={1 - lit} />
                {/* label */}
                {showLabel && (
                    <text
                        x={lo.dx}
                        y={lo.dy}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={34}
                        fontWeight={600}
                        letterSpacing={3}
                        fill={colors.ink}
                        opacity={enter}
                    >
                        {label}
                    </text>
                )}
            </g>
        );
    };

type SideState = {
    drawAt: number; // frame to start drawing the side
    breakAt?: number; // frame to switch to broken/red
    duration?: number;
    width?: number;
    color?: string;
};

/** Local primitive: the three-corner value triangle. */
const ValueTriangle: React.FC<{
    cx: number;
    cy: number;
    size: number;
    nodes?: Partial<Record<Corner, { appearAt: number; litAt?: number }>>;
    sides?: Partial<Record<Side, SideState>>;
    showLabels?: boolean;
    labelOffsets?: Partial<Record<Corner, { dx: number; dy: number }>>;
    nodeRadius?: number;
}> = ({ cx, cy, size, nodes, sides, showLabels = true, labelOffsets, nodeRadius = 38 }) => {
    const c = triCorners(cx, cy, size);
    const sideMap: Record<Side, [Pt, Pt]> = {
        "create-deliver": [c.create, c.deliver],
        "deliver-capture": [c.deliver, c.capture],
        "capture-create": [c.capture, c.create],
    };
    const defaultNodes = {
        create: { appearAt: 0 },
        deliver: { appearAt: 0 },
        capture: { appearAt: 0 },
        ...nodes,
    } as Record<Corner, { appearAt: number; litAt?: number }>;

    const lo = {
        create: labelOffsets?.create ?? { dx: 0, dy: -(nodeRadius + 60) },
        deliver: labelOffsets?.deliver ?? { dx: nodeRadius + 110, dy: 90 },
        capture: labelOffsets?.capture ?? { dx: -(nodeRadius + 110), dy: 90 },
    };

    return (
        <g>
            {/* Sides drawn first so nodes overlay them */}
            {sides &&
                (Object.keys(sides) as Side[]).map((s) => {
                    const st = sides[s];
                    if (!st) return null;
                    const [a, b] = sideMap[s];
                    return (
                        <DrawSegment
                            key={s}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            color={st.color ?? colors.ink}
                            width={st.width ?? 3}
                            delay={st.drawAt}
                            duration={st.duration ?? 22}
                            breakAt={st.breakAt}
                        />
                    );
                })}
            <TriNode
                cx={c.create.x}
                cy={c.create.y}
                label={showLabels ? "CREATE" : ""}
                appearAt={defaultNodes.create.appearAt}
                litAt={defaultNodes.create.litAt}
                radius={nodeRadius}
                labelOffset={lo.create}
                showLabel={showLabels}
            />
            <TriNode
                cx={c.deliver.x}
                cy={c.deliver.y}
                label={showLabels ? "DELIVER" : ""}
                appearAt={defaultNodes.deliver.appearAt}
                litAt={defaultNodes.deliver.litAt}
                radius={nodeRadius}
                labelOffset={lo.deliver}
                showLabel={showLabels}
            />
            <TriNode
                cx={c.capture.x}
                cy={c.capture.y}
                label={showLabels ? "CAPTURE" : ""}
                appearAt={defaultNodes.capture.appearAt}
                litAt={defaultNodes.capture.litAt}
                radius={nodeRadius}
                labelOffset={lo.capture}
                showLabel={showLabels}
            />
        </g>
    );
};

/* ─── Small reusable glyphs ─────────────────────────────────────── */

const Lightbulb: React.FC<{ cx: number; cy: number; appearAt: number; fadeAt?: number; size?: number }> = ({
    cx,
    cy,
    appearAt,
    fadeAt,
    size = 60,
}) => {
    const frame = useCurrentFrame();
    const enter = interpolate(frame - appearAt, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const fade =
        typeof fadeAt === "number"
            ? interpolate(frame - fadeAt, [0, 22], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeQ,
            })
            : 1;
    const flicker = 1 + Math.sin(frame / 5) * 0.04;
    return (
        <g transform={`translate(${cx}, ${cy}) scale(${enter * flicker})`} opacity={enter * fade}>
            <circle r={size * 0.55} fill={colors.warn} opacity={0.18} />
            <path
                d={`M 0 ${-size * 0.5} a ${size * 0.4} ${size * 0.4} 0 1 1 -0.001 0 z`}
                fill={colors.warn}
                opacity={0.92}
            />
            <rect x={-size * 0.18} y={size * 0.05} width={size * 0.36} height={size * 0.08} fill={colors.ink} opacity={0.8} />
            <rect x={-size * 0.14} y={size * 0.18} width={size * 0.28} height={size * 0.06} fill={colors.ink} opacity={0.7} />
            <line x1={-size * 0.08} y1={-size * 0.18} x2={-size * 0.08} y2={size * 0.05} stroke={colors.paper} strokeWidth={1.5} opacity={0.6} />
            <line x1={size * 0.08} y1={-size * 0.18} x2={size * 0.08} y2={size * 0.05} stroke={colors.paper} strokeWidth={1.5} opacity={0.6} />
        </g>
    );
};

const PainDot: React.FC<{ cx: number; cy: number; appearAt: number; resolveAt?: number; size?: number }> = ({
    cx,
    cy,
    appearAt,
    resolveAt,
    size = 32,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 10 },
        durationInFrames: 18,
    });
    const resolve =
        typeof resolveAt === "number"
            ? interpolate(frame - resolveAt, [0, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeQ,
            })
            : 0;
    const pulse =
        resolve < 0.5
            ? 1 + Math.sin(((frame - appearAt) / fps) * Math.PI * 3.4) * 0.18
            : 1;
    const fill =
        resolve > 0.5
            ? colors.pos
            : resolve > 0
                ? colors.warn
                : colors.neg;
    return (
        <g transform={`translate(${cx}, ${cy}) scale(${enter * pulse})`}>
            <circle r={size + 10 * (1 - resolve)} fill={fill} opacity={0.18} />
            <circle r={size} fill={fill} />
            {resolve > 0.6 && (
                <path
                    d={`M ${-size * 0.4} 0 L ${-size * 0.05} ${size * 0.35} L ${size * 0.45} ${-size * 0.35}`}
                    stroke={colors.ink}
                    strokeWidth={4}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={interpolate(resolve, [0.6, 1], [0, 1])}
                />
            )}
        </g>
    );
};

const CustomerGlyph: React.FC<{ cx: number; cy: number; appearAt: number; size?: number; label?: string }> = ({
    cx,
    cy,
    appearAt,
    size = 60,
    label = "CUSTOMER",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 12 },
        durationInFrames: 22,
    });
    return (
        <g transform={`translate(${cx}, ${cy})`} opacity={enter}>
            <circle cx={0} cy={-size * 0.35} r={size * 0.32} fill={colors.mute} />
            <path
                d={`M ${-size * 0.55} ${size * 0.55} a ${size * 0.55} ${size * 0.55} 0 0 1 ${size * 1.1} 0 L ${size * 0.55} ${size * 0.7} L ${-size * 0.55} ${size * 0.7} Z`}
                fill={colors.mute}
            />
            {label && (
                <text
                    x={0}
                    y={size * 1.15}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={28}
                    letterSpacing={3}
                    fill={colors.ink}
                    opacity={0.85}
                >
                    {label}
                </text>
            )}
        </g>
    );
};

/** A small example chip: tiny framed card with a mono title + italic sub-line. */
const ExampleChip: React.FC<{
    cx: number;
    cy: number;
    appearAt: number;
    title: string;
    sub: string;
    color?: string;
    width?: number;
}> = ({ cx, cy, appearAt, title, sub, color = colors.accent, width = 360 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14, stiffness: 140 },
        durationInFrames: 24,
    });
    const h = 110;
    const x = cx - width / 2;
    const y = cy - h / 2;
    return (
        <g
            transform={`translate(${cx}, ${cy}) scale(${enter}) translate(${-cx}, ${-cy})`}
            opacity={enter}
        >
            <rect x={x} y={y} width={width} height={h} fill={colors.card} stroke={color} strokeWidth={2} rx={4} />
            <line x1={x + 16} y1={y + 14} x2={x + 16} y2={y + h - 14} stroke={color} strokeWidth={3} />
            <text
                x={x + 32}
                y={y + 44}
                fontFamily={fonts.mono}
                fontSize={26}
                letterSpacing={3}
                fontWeight={600}
                fill={colors.ink}
            >
                {title}
            </text>
            <text
                x={x + 32}
                y={y + 82}
                fontFamily={fonts.body}
                fontSize={26}
                fontStyle="italic"
                fontWeight={500}
                fill={colors.mute}
            >
                {sub}
            </text>
        </g>
    );
};

/** A traveling token (small disc) along a straight segment. */
const TravelingToken: React.FC<{
    from: Pt;
    to: Pt;
    startAt: number;
    duration: number;
    color?: string;
    radius?: number;
    label?: string;
}> = ({ from, to, startAt, duration, color = colors.accent, radius = 14, label }) => {
    const frame = useCurrentFrame();
    const t = interpolate(frame - startAt, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    if (t <= 0 || t >= 1) return null;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    return (
        <g transform={`translate(${x}, ${y})`}>
            <circle r={radius + 4} fill={color} opacity={0.25} />
            <circle r={radius} fill={color} />
            {label && (
                <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={radius * 0.9}
                    fontWeight={700}
                    fill={colors.paper}
                >
                    {label}
                </text>
            )}
        </g>
    );
};

/** Coin flying in a small arc back to a target. */
const CoinArc: React.FC<{
    from: Pt;
    to: Pt;
    startAt: number;
    duration?: number;
    arc?: number;
    label?: string;
}> = ({ from, to, startAt, duration = 26, arc = 140, label = "$" }) => {
    const frame = useCurrentFrame();
    const t = interpolate(frame - startAt, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    if (t <= 0 || t >= 1) return null;
    const x = from.x + (to.x - from.x) * t;
    const yLine = from.y + (to.y - from.y) * t;
    const y = yLine - Math.sin(t * Math.PI) * arc;
    const r = 18;
    return (
        <g transform={`translate(${x}, ${y})`}>
            <circle r={r + 2} fill={colors.warn} opacity={0.85} />
            <circle r={r - 3} fill={colors.paper} stroke={colors.warn} strokeWidth={2} />
            <text
                x={0}
                y={6}
                textAnchor="middle"
                fontFamily={fonts.display}
                fontWeight={700}
                fontSize={20}
                fill={colors.warn}
            >
                {label}
            </text>
        </g>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 01 — Hook
   "An idea is not a business yet. A business is a system that does
    three things."
   ═══════════════════════════════════════════════════════════════════ */
const HookScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const ideaCue = wordCue(words, "idea", 4);
    const notCue = wordCue(words, "not", ideaCue + 16);
    const systemCue = wordCue(words, "system", notCue + 18);
    const threeCue = wordCue(words, "three", systemCue + 22);

    // Triangle geometry around lightbulb at center
    const cx = REEL.width / 2;
    const cy = 1080;
    const size = 540;

    // Dashed feeler stalls — three short lines from bulb that try to extend
    const feelerProgress = interpolate(frame - ideaCue - 14, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const feelerStall = interpolate(frame - notCue, [0, 14], [1, 0.4], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const xOpacity = interpolate(frame - notCue, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={6}>DAY 1 · WHAT IS A BUSINESS</Eyebrow>
                <Hairline delay={20} duration={30} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="An idea"
                    delay={ideaCue + 2}
                    size={140}
                    weight={600}
                />
                <InkWipeLine
                    text="is not a business."
                    delay={notCue}
                    size={140}
                    weight={600}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
            </ScenePad>

            <Stage>
                {/* Lightbulb at center, fades when triangle takes over */}
                <Lightbulb cx={cx} cy={cy} appearAt={ideaCue} fadeAt={threeCue + 18} size={70} />

                {/* Three dashed feelers from the bulb that stall on "not" */}
                {[0, 1, 2].map((i) => {
                    const angle = (-Math.PI / 2) + (i - 1) * (Math.PI / 4);
                    const len = 220 * feelerProgress * feelerStall;
                    const ex = cx + Math.cos(angle) * len;
                    const ey = cy + Math.sin(angle) * len;
                    return (
                        <g key={i}>
                            <line
                                x1={cx}
                                y1={cy}
                                x2={ex}
                                y2={ey}
                                stroke={colors.mute2}
                                strokeWidth={2}
                                strokeDasharray="6 8"
                                opacity={0.7}
                            />
                            {/* Tiny X stamp on the end after "not" */}
                            <g transform={`translate(${ex}, ${ey})`} opacity={xOpacity}>
                                <line x1={-10} y1={-10} x2={10} y2={10} stroke={colors.neg} strokeWidth={3} />
                                <line x1={-10} y1={10} x2={10} y2={-10} stroke={colors.neg} strokeWidth={3} />
                            </g>
                        </g>
                    );
                })}

                {/* The triangle draws on "system", nodes pop on "three" */}
                <ValueTriangle
                    cx={cx}
                    cy={cy}
                    size={size}
                    nodes={{
                        create: { appearAt: threeCue },
                        deliver: { appearAt: threeCue + 6 },
                        capture: { appearAt: threeCue + 12 },
                    }}
                    sides={{
                        "create-deliver": { drawAt: systemCue, duration: 22 },
                        "deliver-capture": { drawAt: systemCue + 8, duration: 22 },
                        "capture-create": { drawAt: systemCue + 16, duration: 22 },
                    }}
                />
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 02 — Create value
   "First, it creates value. It solves a real problem for a real person."
   ═══════════════════════════════════════════════════════════════════ */
const CreateScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const createsCue = wordCue(words, "creates", 4);
    const realCue = wordCue(words, "real", createsCue + 22);
    const solvesCue = wordCue(words, "solves", realCue + 18);
    const personCue = wordCue(words, "person", solvesCue + 24);
    const leakyCue = wordCue(words, "leaky", personCue + 18);
    const freelancerCue = wordCue(words, "freelancer", leakyCue + 50);

    const cx = REEL.width / 2;
    const cy = 1320;
    const size = 480;
    const corners = triCorners(cx, cy, size);

    // Solution travels from CREATE node to pain dot
    const painPt: Pt = { x: cx + 320, y: cy + 120 };
    const customerPt: Pt = { x: cx + 320, y: cy + 280 };

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>SIDE 1 · CREATE</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="Create value."
                    delay={createsCue}
                    size={160}
                    weight={700}
                    color={colors.accent}
                />
                <InkWipeLine
                    text="Solve a real problem"
                    delay={realCue}
                    size={72}
                    weight={500}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
                <InkWipeLine
                    text="for a real person."
                    delay={realCue + 6}
                    size={72}
                    weight={500}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
            </ScenePad>

            <Stage>
                <ValueTriangle
                    cx={cx}
                    cy={cy}
                    size={size}
                    nodes={{
                        create: { appearAt: 0, litAt: createsCue },
                        deliver: { appearAt: 0 },
                        capture: { appearAt: 0 },
                    }}
                    sides={{
                        "create-deliver": { drawAt: 0, duration: 1, color: colors.mute2, width: 2 },
                        "deliver-capture": { drawAt: 0, duration: 1, color: colors.mute2, width: 2 },
                        "capture-create": { drawAt: 0, duration: 1, color: colors.mute2, width: 2 },
                    }}
                />

                {/* Pain dot to the right, becomes a green check */}
                <PainDot cx={painPt.x} cy={painPt.y} appearAt={realCue} resolveAt={personCue} size={32} />

                {/* Solution token travels CREATE → pain */}
                <TravelingToken
                    from={corners.create}
                    to={painPt}
                    startAt={solvesCue}
                    duration={26}
                    color={colors.accent}
                    radius={18}
                />

                <CustomerGlyph cx={customerPt.x} cy={customerPt.y + 60} appearAt={personCue} size={50} />

                {/* Concrete examples — fade in on their words */}
                <ExampleChip
                    cx={cx - 340}
                    cy={900}
                    appearAt={leakyCue}
                    width={380}
                    title="LEAKY FAUCET"
                    sub="midnight · water everywhere"
                    color={colors.warn}
                />
                <ExampleChip
                    cx={cx - 340}
                    cy={1040}
                    appearAt={freelancerCue}
                    width={380}
                    title="LATE INVOICE"
                    sub="freelancer · 6-week wait"
                    color={colors.warn}
                />
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 03 — Deliver
   "Then it delivers that value reliably. A product shipped, a service
    done, an app used, a marketplace matched."
   ═══════════════════════════════════════════════════════════════════ */
const DeliverScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const deliversCue = wordCue(words, "delivers", 4);
    const shippedCue = wordCue(words, "shipped", deliversCue + 30);
    const doneCue = wordCue(words, "done", shippedCue + 18);
    const usedCue = wordCue(words, "used", doneCue + 18);
    const matchedCue = wordCue(words, "matched", usedCue + 18);

    const cx = REEL.width / 2;
    const cy = 1060;
    const size = 360;

    const lanes = [
        { label: "SHIPPED", cue: shippedCue, glyph: "box" as const },
        { label: "DONE", cue: doneCue, glyph: "check" as const },
        { label: "USED", cue: usedCue, glyph: "phone" as const },
        { label: "MATCHED", cue: matchedCue, glyph: "swap" as const },
    ];

    const laneTop = 1240;
    const laneSpacing = 120;
    const laneStartX = 200;
    const laneEndX = REEL.width - 200;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>SIDE 2 · DELIVER</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="Deliver it."
                    delay={deliversCue}
                    size={160}
                    weight={700}
                    color={colors.accent}
                />
                <InkWipeLine
                    text="Reliably. Repeatedly."
                    delay={deliversCue + 16}
                    size={64}
                    weight={500}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
            </ScenePad>

            <Stage>
                <ValueTriangle
                    cx={cx}
                    cy={cy}
                    size={size}
                    nodeRadius={30}
                    showLabels={false}
                    nodes={{
                        create: { appearAt: 0, litAt: 0 },
                        deliver: { appearAt: 0, litAt: deliversCue },
                        capture: { appearAt: 0 },
                    }}
                    sides={{
                        "create-deliver": { drawAt: deliversCue, duration: 18, color: colors.accent, width: 4 },
                        "deliver-capture": { drawAt: 0, duration: 1, color: colors.mute2, width: 2 },
                        "capture-create": { drawAt: 0, duration: 1, color: colors.mute2, width: 2 },
                    }}
                />

                {/* Customer on the right edge */}
                <CustomerGlyph cx={laneEndX + 60} cy={laneTop + laneSpacing * 1.5} appearAt={deliversCue + 8} size={42} label="" />

                {/* Four delivery lanes */}
                {lanes.map((lane, i) => {
                    const y = laneTop + i * laneSpacing;
                    const trackProgress = interpolate(frame - lane.cue, [0, 22], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const labelProgress = interpolate(frame - lane.cue, [0, 12], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const tokenT = interpolate(frame - lane.cue - 6, [0, 22], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const tokenX = laneStartX + (laneEndX - laneStartX) * tokenT;
                    return (
                        <g key={lane.label}>
                            {/* Lane track */}
                            <line
                                x1={laneStartX}
                                y1={y}
                                x2={laneStartX + (laneEndX - laneStartX) * trackProgress}
                                y2={y}
                                stroke={colors.line}
                                strokeWidth={2}
                                strokeDasharray="4 6"
                            />
                            {/* Lane label */}
                            <text
                                x={laneStartX - 10}
                                y={y + 12}
                                textAnchor="end"
                                fontFamily={fonts.mono}
                                fontSize={36}
                                letterSpacing={3}
                                fontWeight={600}
                                fill={colors.ink}
                                opacity={labelProgress}
                            >
                                {lane.label}
                            </text>
                            {/* Glyph token */}
                            {tokenT > 0 && tokenT < 1 && (
                                <g transform={`translate(${tokenX}, ${y})`}>
                                    {lane.glyph === "box" && (
                                        <g>
                                            <rect x={-14} y={-14} width={28} height={28} fill={colors.accent} rx={3} />
                                            <line x1={-14} y1={0} x2={14} y2={0} stroke={colors.paper} strokeWidth={2} />
                                            <line x1={0} y1={-14} x2={0} y2={14} stroke={colors.paper} strokeWidth={2} />
                                        </g>
                                    )}
                                    {lane.glyph === "check" && (
                                        <g>
                                            <circle r={16} fill={colors.accent} />
                                            <path
                                                d="M -6 0 L -1 5 L 7 -5"
                                                stroke={colors.paper}
                                                strokeWidth={3}
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    )}
                                    {lane.glyph === "phone" && (
                                        <g>
                                            <rect x={-10} y={-16} width={20} height={32} rx={3} fill={colors.accent} />
                                            <rect x={-7} y={-12} width={14} height={20} fill={colors.paper} />
                                        </g>
                                    )}
                                    {lane.glyph === "swap" && (
                                        <g>
                                            <path d="M -16 -4 L 10 -4 L 6 -8 M 10 -4 L 6 0" stroke={colors.accent} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M 16 6 L -10 6 L -6 2 M -10 6 L -6 10" stroke={colors.accent} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    )}
                                </g>
                            )}
                        </g>
                    );
                })}
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 04 — Capture
   "And it captures part of that value back. As money, as margin,
    as cash."
   ═══════════════════════════════════════════════════════════════════ */
const CaptureScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const capturesCue = wordCue(words, "captures", 4);
    const moneyCue = wordCue(words, "money", capturesCue + 28);
    const marginCue = wordCue(words, "margin", moneyCue + 24);
    const cashCue = wordCue(words, "cash", marginCue + 24);
    const tenCue = wordCue(words, "ten", moneyCue + 18);
    const twoCue = wordCue(words, "two", marginCue + 18);
    const fridayCue = wordCue(words, "Friday", cashCue + 18);

    const cx = REEL.width / 2;
    const cy = 1000;
    const size = 360;
    const corners = triCorners(cx, cy, size);
    const customerPt: Pt = { x: REEL.width - 180, y: 1080 };

    const meters = [
        { label: "MONEY", cue: moneyCue, color: colors.accent, example: "$10 at the till", exampleCue: tenCue },
        { label: "MARGIN", cue: marginCue, color: colors.pos, example: "$2 left after costs", exampleCue: twoCue },
        { label: "CASH", cue: cashCue, color: colors.warn, example: "in the bank Friday", exampleCue: fridayCue },
    ];

    const meterTop = 1280;
    const meterHeight = 110;
    const meterWidth = 240;
    const meterGap = 40;
    const totalMeterW = meterWidth * 3 + meterGap * 2;
    const meterStart = (REEL.width - totalMeterW) / 2;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>SIDE 3 · CAPTURE</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="Capture part of it."
                    delay={capturesCue}
                    size={140}
                    weight={700}
                    color={colors.accent}
                />
            </ScenePad>

            <Stage>
                <ValueTriangle
                    cx={cx}
                    cy={cy}
                    size={size}
                    nodeRadius={30}
                    showLabels={false}
                    nodes={{
                        create: { appearAt: 0, litAt: 0 },
                        deliver: { appearAt: 0, litAt: 0 },
                        capture: { appearAt: 0, litAt: capturesCue },
                    }}
                    sides={{
                        "create-deliver": { drawAt: 0, duration: 1, color: colors.accent, width: 3 },
                        "deliver-capture": { drawAt: capturesCue, duration: 22, color: colors.accent, width: 4 },
                        "capture-create": { drawAt: 0, duration: 1, color: colors.accent, width: 3 },
                    }}
                />

                <CustomerGlyph cx={customerPt.x} cy={customerPt.y} appearAt={0} size={40} label="" />

                {/* Coins fly back from customer to CAPTURE corner across the scene */}
                {[0, 1, 2, 3, 4].map((i) => {
                    const start = capturesCue + i * 7;
                    return (
                        <CoinArc
                            key={i}
                            from={customerPt}
                            to={corners.capture}
                            startAt={start}
                            duration={28}
                            arc={160 + (i % 2) * 30}
                        />
                    );
                })}

                {/* Three meters fill on their words */}
                {meters.map((m, i) => {
                    const x = meterStart + i * (meterWidth + meterGap);
                    const fillProgress = interpolate(frame - m.cue, [0, 22], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const labelProgress = interpolate(frame - m.cue, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const exampleProgress = interpolate(frame - m.exampleCue, [0, 16], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    return (
                        <g key={m.label}>
                            <rect
                                x={x}
                                y={meterTop}
                                width={meterWidth}
                                height={meterHeight}
                                fill="none"
                                stroke={colors.line}
                                strokeWidth={2}
                            />
                            <rect
                                x={x}
                                y={meterTop + meterHeight - meterHeight * fillProgress}
                                width={meterWidth}
                                height={meterHeight * fillProgress}
                                fill={m.color}
                                opacity={0.85}
                            />
                            <text
                                x={x + meterWidth / 2}
                                y={meterTop + meterHeight + 50}
                                textAnchor="middle"
                                fontFamily={fonts.mono}
                                fontSize={40}
                                letterSpacing={4}
                                fontWeight={600}
                                fill={colors.ink}
                                opacity={labelProgress}
                            >
                                {m.label}
                            </text>
                            <text
                                x={x + meterWidth / 2}
                                y={meterTop + meterHeight + 96}
                                textAnchor="middle"
                                fontFamily={fonts.body}
                                fontSize={30}
                                fontStyle="italic"
                                fontWeight={500}
                                fill={m.color}
                                opacity={exampleProgress}
                            >
                                {m.example}
                            </text>
                        </g>
                    );
                })}
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 05 — Breaks
   "If one side is weak, the loop is stuck. Good idea, no buyer.
    Lots of orders, no margin. Busy work, no real value."
   ═══════════════════════════════════════════════════════════════════ */
const BreaksScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const weakCue = wordCue(words, "weak", 4);
    const goodCue = wordCue(words, "good", weakCue + 30);
    const lotsCue = wordCue(words, "lots", goodCue + 50);
    const busyCue = wordCue(words, "busy", lotsCue + 50);

    const miniSize = 220;
    const miniY = 1180;
    const miniXs = [REEL.width * 0.22, REEL.width * 0.5, REEL.width * 0.78];

    type Card = { cue: number; caption: string; brokenSide: Side };
    const cards: Card[] = [
        { cue: goodCue, caption: "Good idea,\nno buyer.", brokenSide: "create-deliver" },
        { cue: lotsCue, caption: "Lots of orders,\nno margin.", brokenSide: "deliver-capture" },
        { cue: busyCue, caption: "Busy work,\nno real value.", brokenSide: "capture-create" },
    ];

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>THE LOOP</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="One missing side"
                    delay={weakCue}
                    size={108}
                    weight={700}
                />
                <InkWipeLine
                    text="breaks the loop."
                    delay={weakCue + 8}
                    size={108}
                    weight={700}
                    italic
                    family={fonts.body}
                    color={colors.neg}
                />
            </ScenePad>

            <Stage>
                {cards.map((card, i) => {
                    const x = miniXs[i];
                    const captionLines = card.caption.split("\n");
                    const cardEnter = interpolate(frame - weakCue - 4, [0, 18], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    const captionEnter = interpolate(frame - card.cue, [0, 16], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: easeQ,
                    });
                    return (
                        <g key={i} opacity={cardEnter}>
                            <ValueTriangle
                                cx={x}
                                cy={miniY}
                                size={miniSize}
                                nodeRadius={16}
                                showLabels={false}
                                nodes={{
                                    create: { appearAt: 0 },
                                    deliver: { appearAt: 0 },
                                    capture: { appearAt: 0 },
                                }}
                                sides={{
                                    "create-deliver": {
                                        drawAt: 0,
                                        duration: 1,
                                        breakAt: card.brokenSide === "create-deliver" ? card.cue : undefined,
                                        width: 3,
                                    },
                                    "deliver-capture": {
                                        drawAt: 0,
                                        duration: 1,
                                        breakAt: card.brokenSide === "deliver-capture" ? card.cue : undefined,
                                        width: 3,
                                    },
                                    "capture-create": {
                                        drawAt: 0,
                                        duration: 1,
                                        breakAt: card.brokenSide === "capture-create" ? card.cue : undefined,
                                        width: 3,
                                    },
                                }}
                            />
                            {captionLines.map((line, li) => (
                                <text
                                    key={li}
                                    x={x}
                                    y={miniY + miniSize * 0.95 + li * 48}
                                    textAnchor="middle"
                                    fontFamily={fonts.body}
                                    fontStyle="italic"
                                    fontSize={40}
                                    fill={colors.ink}
                                    opacity={captionEnter}
                                >
                                    {line}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 06 — Same loop, different weak side
   "Software, services, products. Same loop. The weak side is just
    different."
   ═══════════════════════════════════════════════════════════════════ */
const TypesScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();

    const softwareCue = wordCue(words, "software", 4);
    const servicesCue = wordCue(words, "services", softwareCue + 18);
    const productsCue = wordCue(words, "products", servicesCue + 18);
    const differentCue = wordCue(words, "different", productsCue + 30);

    type Card = { cue: number; label: string; example: string; weakSide: Side };
    const cards: Card[] = [
        { cue: softwareCue, label: "SOFTWARE", example: "Notion", weakSide: "deliver-capture" }, // capture (retention) wobbles
        { cue: servicesCue, label: "SERVICES", example: "a plumber", weakSide: "create-deliver" }, // deliver (scaling) wobbles
        { cue: productsCue, label: "PRODUCTS", example: "coffee roaster", weakSide: "deliver-capture" }, // capture (margin) wobbles
    ];

    const cardW = 320;
    const cardH = 380;
    const gap = 30;
    const totalW = cardW * 3 + gap * 2;
    const startX = (REEL.width - totalW) / 2;
    const cardY = 920;
    const miniSize = 170;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>SAME LOOP</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="Different business."
                    delay={softwareCue}
                    size={104}
                    weight={700}
                />
                <InkWipeLine
                    text="Different weak side."
                    delay={differentCue}
                    size={104}
                    weight={700}
                    italic
                    family={fonts.body}
                    color={colors.accent}
                />
            </ScenePad>

            <Stage>
                {cards.map((card, i) => {
                    const x = startX + i * (cardW + gap);
                    const cx = x + cardW / 2;
                    const cy = cardY + cardH / 2 - 20;
                    const enter = spring({
                        frame: frame - card.cue,
                        fps: 30,
                        config: { damping: 12, stiffness: 160 },
                        durationInFrames: 22,
                    });
                    // The weak side is highlighted in accent; the other two stay ink.
                    const sideColor = (s: Side) =>
                        s === card.weakSide ? colors.accent : colors.ink;
                    const sideWidth = (s: Side) =>
                        s === card.weakSide ? 5 : 2;
                    // The weak side pulses gently
                    const wobble =
                        Math.sin(((frame - card.cue) / 30) * Math.PI * 2.4) * 0.5 + 0.5;
                    return (
                        <g
                            key={card.label}
                            transform={`translate(${cx}, ${cy}) scale(${enter}) translate(${-cx}, ${-cy})`}
                            opacity={enter}
                        >
                            {/* Card frame */}
                            <rect
                                x={x}
                                y={cardY}
                                width={cardW}
                                height={cardH}
                                fill={colors.card}
                                stroke={colors.line}
                                strokeWidth={1}
                                rx={4}
                            />
                            {/* Mini triangle */}
                            <ValueTriangle
                                cx={cx}
                                cy={cy}
                                size={miniSize}
                                nodeRadius={14}
                                showLabels={false}
                                nodes={{
                                    create: { appearAt: card.cue },
                                    deliver: { appearAt: card.cue + 4 },
                                    capture: { appearAt: card.cue + 8 },
                                }}
                                sides={{
                                    "create-deliver": {
                                        drawAt: card.cue + 2,
                                        duration: 16,
                                        color: sideColor("create-deliver"),
                                        width: sideWidth("create-deliver") + (card.weakSide === "create-deliver" ? wobble * 2 : 0),
                                    },
                                    "deliver-capture": {
                                        drawAt: card.cue + 6,
                                        duration: 16,
                                        color: sideColor("deliver-capture"),
                                        width: sideWidth("deliver-capture") + (card.weakSide === "deliver-capture" ? wobble * 2 : 0),
                                    },
                                    "capture-create": {
                                        drawAt: card.cue + 10,
                                        duration: 16,
                                        color: sideColor("capture-create"),
                                        width: sideWidth("capture-create") + (card.weakSide === "capture-create" ? wobble * 2 : 0),
                                    },
                                }}
                            />
                            {/* Label */}
                            <text
                                x={cx}
                                y={cardY + cardH - 70}
                                textAnchor="middle"
                                fontFamily={fonts.mono}
                                fontSize={40}
                                letterSpacing={4}
                                fontWeight={600}
                                fill={colors.ink}
                            >
                                {card.label}
                            </text>
                            {/* Example */}
                            <text
                                x={cx}
                                y={cardY + cardH - 28}
                                textAnchor="middle"
                                fontFamily={fonts.body}
                                fontSize={28}
                                fontStyle="italic"
                                fontWeight={500}
                                fill={colors.accent}
                            >
                                like {card.example}
                            </text>
                        </g>
                    );
                })}
            </Stage>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 07 — Outro
   "So the real question is simple. Where is your loop weakest?
    Start there."
   ═══════════════════════════════════════════════════════════════════ */
const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 16, total);
    const frame = useCurrentFrame();

    const questionCue = wordCue(words, "question", 4);
    const weakestCue = wordCue(words, "weakest", questionCue + 30);
    const startCue = wordCue(words, "start", weakestCue + 28);

    const cx = REEL.width / 2;
    const cy = 1100;
    const size = 460;
    const corners = triCorners(cx, cy, size);

    // Traveling pulse around the loop, slowing on "weakest"
    const slowFactor = interpolate(frame - weakestCue, [0, 24], [1, 0.25], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    // Tracks the pulse position along the perimeter t∈[0,3) (3 sides)
    // We just use frame*speed mod 3
    const pulseSpeed = 0.018 * slowFactor;
    const pulseT = (frame * pulseSpeed) % 3;
    const segIdx = Math.floor(pulseT);
    const segT = pulseT - segIdx;
    const segs: [Pt, Pt][] = [
        [corners.create, corners.deliver],
        [corners.deliver, corners.capture],
        [corners.capture, corners.create],
    ];
    const [a, b] = segs[segIdx] ?? segs[0];
    const px = a.x + (b.x - a.x) * segT;
    const py = a.y + (b.y - a.y) * segT;

    // Triple node pulse on "weakest"
    const nodePulse = (offset: number) =>
        Math.max(
            0,
            Math.sin(((frame - weakestCue - offset) / 30) * Math.PI * 3)
        ) * Math.exp(-(frame - weakestCue) / 60);

    return (
        <AbsoluteFill style={{ opacity }}>
            <Stage>
                {/* Loop triangle, all sides drawn from start */}
                <ValueTriangle
                    cx={cx}
                    cy={cy}
                    size={size}
                    nodeRadius={36}
                    nodes={{
                        create: { appearAt: 0 },
                        deliver: { appearAt: 0 },
                        capture: { appearAt: 0 },
                    }}
                    sides={{
                        "create-deliver": { drawAt: 0, duration: 24, color: colors.ink, width: 3 },
                        "deliver-capture": { drawAt: 8, duration: 24, color: colors.ink, width: 3 },
                        "capture-create": { drawAt: 16, duration: 24, color: colors.ink, width: 3 },
                    }}
                />
                {/* Traveling pulse */}
                <g>
                    <circle cx={px} cy={py} r={26} fill={colors.accent} opacity={0.2} />
                    <circle cx={px} cy={py} r={14} fill={colors.accent} />
                </g>
                {/* Triple-pulse halos on each node when weakest is asked */}
                {(["create", "deliver", "capture"] as Corner[]).map((k, i) => {
                    const p = corners[k];
                    const np = nodePulse(i * 6);
                    return (
                        <circle
                            key={k}
                            cx={p.x}
                            cy={p.y}
                            r={36 + 20 * np}
                            fill="none"
                            stroke={colors.accent}
                            strokeWidth={2}
                            opacity={np * 0.8}
                        />
                    );
                })}
            </Stage>

            <ScenePad align="start">
                <div style={{ height: 60 }} />
                <Eyebrow delay={questionCue}>THE QUESTION</Eyebrow>
                <Hairline delay={questionCue + 14} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine
                    text="Where is your loop"
                    delay={questionCue + 12}
                    size={108}
                    weight={700}
                />
                <InkWipeLine
                    text="weakest?"
                    delay={weakestCue}
                    size={144}
                    weight={700}
                    italic
                    family={fonts.body}
                    color={colors.accent}
                />
            </ScenePad>

            {/* Bottom: start there + dot mark + wordmark */}
            <AbsoluteFill
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom: space.s9,
                    gap: space.s5,
                }}
            >
                <div
                    style={{
                        fontFamily: fonts.body,
                        fontStyle: "italic",
                        fontSize: 76,
                        color: colors.ink,
                        opacity: interpolate(frame - startCue, [0, 14], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }),
                    }}
                >
                    Start there.
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: space.s4,
                        opacity: interpolate(frame - startCue - 8, [0, 16], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }),
                    }}
                >
                    <DotMark delay={startCue + 8} size={24} />
                    <span
                        style={{
                            fontFamily: fonts.display,
                            fontWeight: 700,
                            fontSize: 44,
                            letterSpacing: "0.18em",
                            color: colors.ink,
                        }}
                    >
                        MADE PLAIN
                    </span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ─── Scene router ───────────────────────────────────────────────── */
const SceneRouter: React.FC<{ id: string; words: Word[]; total: number }> = ({
    id,
    words,
    total,
}) => {
    switch (id) {
        case "01-hook":
            return <HookScene words={words} total={total} />;
        case "02-create":
            return <CreateScene words={words} total={total} />;
        case "03-deliver":
            return <DeliverScene words={words} total={total} />;
        case "04-capture":
            return <CaptureScene words={words} total={total} />;
        case "05-breaks":
            return <BreaksScene words={words} total={total} />;
        case "06-types":
            return <TypesScene words={words} total={total} />;
        case "07-outro":
            return <OutroScene words={words} total={total} />;
        default:
            return null;
    }
};

/* ─── Composition ────────────────────────────────────────────────── */
export const WhatBusinessActuallyIs: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: colors.paper }}>
            <PaperBackground />

            {/* Background music — same soft bed as Equity Journey. */}
            <Audio
                src={staticFile("equity-journey/music.mp3")}
                volume={(f) => {
                    const fadeIn = interpolate(f, [0, REEL.fps], [0, 0.06], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const fadeOut = interpolate(
                        f,
                        [
                            WHAT_BUSINESS_ACTUALLY_IS_DURATION -
                            Math.round(REEL.fps * 0.8),
                            WHAT_BUSINESS_ACTUALLY_IS_DURATION,
                        ],
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
                        src={staticFile(
                            `what-a-business-actually-is/voiceover/${scene.audio}`
                        )}
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
