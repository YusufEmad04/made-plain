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
    ScenePad,
    useSceneFade,
} from "../../brand/motion";
import { colors, ease, space, REEL } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

/* ───────────────────────────────────────────────────────────────────
   A Business Has Three Jobs — v4.
   - Persistent Scoreboard with plain words + formal names
     (MAKE/OPERATIONS · HAND OVER/MARKETING & SALES · KEEP/FINANCE).
   - Cash-flow animation in scene 04 (the math is the motion).
   - Trap = 3 horizontal rows, each with a mini scoreboard.
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

export const BUSINESS_THREE_JOBS_DURATION = manifest.totalFrames;

function wordCue(words: Word[], needle: string, fallback = 0): number {
    const n = needle.toLowerCase().replace(/[.,!?]/g, "");
    for (const w of words) {
        const clean = w.word.toLowerCase().replace(/[.,!?]/g, "");
        if (clean.includes(n)) return w.startFrame;
    }
    return fallback;
}

/** Find the Nth occurrence of a word (1-indexed). Useful for repeated terms. */
function wordCueN(words: Word[], needle: string, n: number, fallback = 0): number {
    const target = needle.toLowerCase().replace(/[.,!?]/g, "");
    let count = 0;
    for (const w of words) {
        const clean = w.word.toLowerCase().replace(/[.,!?]/g, "");
        if (clean.includes(target)) {
            count += 1;
            if (count === n) return w.startFrame;
        }
    }
    return fallback;
}

const easeQ = (t: number) => Easing.bezier(...ease.quart)(t);

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

/* ════════════════════════════════════════════════════════════════════
   SCOREBOARD — the spine of the whole reel.
   Three cells. Each cell can be empty/check/cross.
   Each cell carries a plain-word label and a formal sub-label.
   ════════════════════════════════════════════════════════════════════ */

type CellState = "empty" | "check" | "cross";

type ScoreboardProps = {
    cx: number;
    cy: number;
    cellW?: number;
    cellH?: number;
    gap?: number;
    appearAt: number;
    states: CellState[];
    revealAt: number[]; // when each cell flips from empty to its state
    showLabelsAt?: number[]; // when plain + formal labels appear (per cell)
    labels?: [string, string, string];
    subLabels?: [string, string, string];
    mini?: boolean;
};

const Scoreboard: React.FC<ScoreboardProps> = ({
    cx,
    cy,
    cellW,
    cellH,
    gap = 32,
    appearAt,
    states,
    revealAt,
    showLabelsAt,
    labels = ["", "", ""],
    subLabels = ["", "", ""],
    mini = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const w = cellW ?? (mini ? 110 : 280);
    const h = cellH ?? (mini ? 90 : 220);
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const totalW = w * 3 + gap * 2;
    const startX = cx - totalW / 2;

    return (
        <g opacity={enter}>
            {[0, 1, 2].map((i) => {
                const x = startX + i * (w + gap);
                const state = states[i];
                const reveal = interpolate(frame - revealAt[i], [0, 14], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: easeQ,
                });
                const labelT =
                    showLabelsAt && showLabelsAt[i] != null
                        ? interpolate(frame - showLabelsAt[i], [0, 14], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                        : reveal;
                const stateColor =
                    state === "check" ? colors.pos : state === "cross" ? colors.neg : colors.line;
                const cellFill = reveal > 0.5 && state === "check" ? "rgba(108,168,107,0.10)" : colors.card;
                return (
                    <g key={i}>
                        {/* cell box */}
                        <rect
                            x={x}
                            y={cy - h / 2}
                            width={w}
                            height={h}
                            fill={cellFill}
                            stroke={reveal > 0.5 ? stateColor : colors.line}
                            strokeWidth={mini ? 3 : 4}
                            rx={6}
                        />
                        {/* numeral always visible */}
                        <text
                            x={x + w / 2}
                            y={cy - h * 0.18}
                            textAnchor="middle"
                            fontFamily={fonts.display}
                            fontSize={mini ? 44 : 90}
                            fontWeight={700}
                            fill={colors.mute}
                            opacity={mini ? 0.6 : 1 - reveal * 0.7}
                        >
                            {i + 1}
                        </text>

                        {/* check or cross overlay */}
                        {state === "check" && reveal > 0 && (
                            <g
                                transform={`translate(${x + w / 2}, ${cy - h * 0.05}) scale(${reveal})`}
                            >
                                <circle cx={0} cy={0} r={mini ? 22 : 50} fill={colors.pos} />
                                <path
                                    d={`M ${mini ? -10 : -22} 0 l ${mini ? 8 : 18} ${mini ? 8 : 18} l ${mini ? 18 : 38} ${mini ? -18 : -38}`}
                                    stroke={colors.paper}
                                    strokeWidth={mini ? 5 : 9}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        )}
                        {state === "cross" && reveal > 0 && (
                            <g
                                transform={`translate(${x + w / 2}, ${cy - h * 0.05}) scale(${reveal})`}
                            >
                                <circle cx={0} cy={0} r={mini ? 22 : 50} fill={colors.neg} />
                                <path
                                    d={`M ${mini ? -12 : -24} ${mini ? -12 : -24} l ${mini ? 24 : 48} ${mini ? 24 : 48} M ${mini ? 12 : 24} ${mini ? -12 : -24} l ${mini ? -24 : -48} ${mini ? 24 : 48}`}
                                    stroke={colors.paper}
                                    strokeWidth={mini ? 5 : 9}
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </g>
                        )}

                        {/* plain-words label */}
                        {!mini && labels[i] && (
                            <text
                                x={x + w / 2}
                                y={cy + h * 0.28}
                                textAnchor="middle"
                                fontFamily={fonts.display}
                                fontSize={42}
                                fontWeight={700}
                                fill={state === "cross" ? colors.neg : colors.accent}
                                opacity={labelT}
                            >
                                {labels[i]}
                            </text>
                        )}
                        {/* formal sub-label */}
                        {!mini && subLabels[i] && (
                            <text
                                x={x + w / 2}
                                y={cy + h * 0.42}
                                textAnchor="middle"
                                fontFamily={fonts.mono}
                                fontSize={22}
                                letterSpacing={3}
                                fontWeight={600}
                                fill={colors.mute}
                                opacity={labelT}
                            >
                                {subLabels[i]}
                            </text>
                        )}
                    </g>
                );
            })}
        </g>
    );
};

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES (carried from v2)
   ════════════════════════════════════════════════════════════════════ */

type BakeryProps = {
    cx: number;
    cy: number;
    width?: number;
    appearAt?: number;
    drawDuration?: number;
    open?: number | null;
    breadAt?: number | null;
    breadDull?: boolean;
    locked?: boolean;
    glow?: boolean;
};
const Bakery: React.FC<BakeryProps> = ({
    cx,
    cy,
    width = 720,
    appearAt = 0,
    drawDuration = 28,
    open = null,
    breadAt = null,
    breadDull = false,
    locked = false,
    glow = true,
}) => {
    const frame = useCurrentFrame();
    const height = width * 0.72;
    const left = cx - width / 2;
    const top = cy - height / 2;
    const right = left + width;
    const bottom = top + height;

    const draw = interpolate(frame - appearAt, [0, drawDuration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const fillIn = interpolate(frame - appearAt, [drawDuration * 0.6, drawDuration + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const awningH = height * 0.22;
    const awningTop = top;
    const awningBottom = top + awningH;
    const stripeW = width / 7;

    const baseTop = awningBottom + 30 * (width / 720);
    const baseBottom = bottom - 20 * (width / 720);
    const windowW = width * 0.55;
    const windowH = baseBottom - baseTop - 40;
    const windowLeft = left + 30 * (width / 720);
    const windowTop = baseTop + 20 * (width / 720);
    const doorW = width * 0.32;
    const doorLeft = right - doorW - 30 * (width / 720);

    const breadProgress =
        breadAt == null
            ? 0
            : interpolate(frame - breadAt, [0, 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeQ,
            });

    const openFlip =
        open == null
            ? 0
            : interpolate(frame - open, [0, 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });

    const scale = width / 720;

    return (
        <g opacity={draw}>
            <rect x={left} y={top} width={width} height={height} fill={colors.card} stroke={colors.ink} strokeWidth={4} rx={6} />
            <rect x={left} y={awningTop} width={width} height={awningH} fill={colors.paper} stroke={colors.ink} strokeWidth={3} opacity={fillIn} />
            {Array.from({ length: 7 }).map((_, i) =>
                i % 2 === 0 ? (
                    <rect key={i} x={left + i * stripeW} y={awningTop} width={stripeW} height={awningH} fill={colors.accent} opacity={fillIn * 0.9} />
                ) : null,
            )}
            <path
                d={(() => {
                    const peaks = 14;
                    const w = width / peaks;
                    let d = `M ${left} ${awningBottom} `;
                    for (let i = 0; i < peaks; i++) {
                        d += `l ${w / 2} ${14 * scale} l ${w / 2} ${-14 * scale} `;
                    }
                    return d;
                })()}
                fill="none"
                stroke={colors.ink}
                strokeWidth={3}
                opacity={fillIn}
            />
            <rect x={windowLeft} y={windowTop} width={windowW} height={windowH} fill={glow ? "#3a2418" : colors.paper} stroke={colors.ink} strokeWidth={3} opacity={fillIn} />
            <line x1={windowLeft + windowW / 2} y1={windowTop} x2={windowLeft + windowW / 2} y2={windowTop + windowH} stroke={colors.ink} strokeWidth={2} opacity={fillIn * 0.7} />
            <line x1={windowLeft} y1={windowTop + windowH / 2} x2={windowLeft + windowW} y2={windowTop + windowH / 2} stroke={colors.ink} strokeWidth={2} opacity={fillIn * 0.7} />
            {glow && (
                <ellipse cx={windowLeft + windowW / 2} cy={windowTop + windowH / 2} rx={windowW * 0.45} ry={windowH * 0.35} fill={colors.warn} opacity={fillIn * 0.18} />
            )}
            {breadAt != null && (
                <g
                    transform={`translate(${windowLeft + windowW * 0.72}, ${windowTop + windowH * 0.78 - breadProgress * 60 * scale
                        })`}
                    opacity={breadProgress}
                >
                    <BreadLoaf size={56 * scale} dull={breadDull} />
                </g>
            )}
            <rect x={doorLeft} y={baseTop + 20 * scale} width={doorW} height={baseBottom - baseTop - 40 * scale} fill={colors.paper} stroke={colors.ink} strokeWidth={3} opacity={fillIn} />
            <circle cx={doorLeft + doorW - 22 * scale} cy={baseTop + (baseBottom - baseTop) / 2} r={6 * scale} fill={colors.ink} opacity={fillIn} />
            {open != null && (
                <g transform={`translate(${doorLeft + doorW / 2}, ${baseTop + 60 * scale})`} opacity={fillIn}>
                    <rect x={-50 * scale} y={-22 * scale} width={100 * scale} height={44 * scale} fill={openFlip > 0.5 ? colors.pos : colors.mute} rx={4} />
                    <text x={0} y={6 * scale} textAnchor="middle" fontFamily={fonts.mono} fontSize={22 * scale} letterSpacing={3} fontWeight={700} fill={colors.paper}>
                        {openFlip > 0.5 ? "OPEN" : "CLOSED"}
                    </text>
                </g>
            )}
            {locked && (
                <g transform={`translate(${doorLeft + doorW / 2}, ${baseTop + (baseBottom - baseTop) / 2})`} opacity={fillIn}>
                    <rect x={-22 * scale} y={-4 * scale} width={44 * scale} height={36 * scale} fill={colors.neg} rx={4} />
                    <path d={`M ${-14 * scale} ${-4 * scale} v ${-10 * scale} a ${14 * scale} ${14 * scale} 0 0 1 ${28 * scale} 0 v ${10 * scale}`} stroke={colors.neg} strokeWidth={5} fill="none" />
                </g>
            )}
        </g>
    );
};

const BreadLoaf: React.FC<{ size?: number; dull?: boolean }> = ({ size = 60, dull = false }) => {
    const fill = dull ? colors.mute : "#d4a373";
    const stroke = dull ? colors.mute2 : colors.ink;
    return (
        <g>
            <ellipse cx={0} cy={0} rx={size} ry={size * 0.55} fill={fill} stroke={stroke} strokeWidth={2.5} />
            {!dull && (
                <>
                    <line x1={-size * 0.6} y1={-4} x2={-size * 0.3} y2={-12} stroke={colors.ink} strokeWidth={2} opacity={0.45} />
                    <line x1={-size * 0.2} y1={-6} x2={size * 0.1} y2={-14} stroke={colors.ink} strokeWidth={2} opacity={0.45} />
                    <line x1={size * 0.2} y1={-6} x2={size * 0.5} y2={-14} stroke={colors.ink} strokeWidth={2} opacity={0.45} />
                </>
            )}
            {dull && (
                <text x={0} y={6} textAnchor="middle" fontFamily={fonts.mono} fontSize={size * 0.55} fill={colors.mute2}>
                    meh
                </text>
            )}
        </g>
    );
};

const Customer: React.FC<{
    cx: number;
    cy: number;
    appearAt: number;
    size?: number;
    holdsLoaf?: boolean;
    heart?: number | null;
}> = ({ cx, cy, appearAt, size = 90, holdsLoaf = false, heart = null }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const heartPulse =
        heart == null
            ? 0
            : interpolate(frame - heart, [0, 12, 28], [0, 1, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
    return (
        <g transform={`translate(${cx}, ${cy})`} opacity={enter}>
            <circle cx={0} cy={-size * 0.9} r={size * 0.32} fill={colors.mute} />
            <path d={`M ${-size * 0.45} ${-size * 0.5} a ${size * 0.45} ${size * 0.55} 0 0 1 ${size * 0.9} 0 L ${size * 0.45} ${size * 0.5} L ${-size * 0.45} ${size * 0.5} Z`} fill={colors.mute} />
            {holdsLoaf && (
                <g transform={`translate(${size * 0.55}, ${size * 0.05})`}>
                    <BreadLoaf size={size * 0.45} />
                </g>
            )}
            {heart != null && heartPulse > 0 && (
                <g transform={`translate(0, ${-size * 1.55}) scale(${0.7 + heartPulse * 0.5})`} opacity={heartPulse}>
                    <path d="M 0 12 C -22 -8 -28 -28 -10 -28 C 0 -28 0 -16 0 -16 C 0 -16 0 -28 10 -28 C 28 -28 22 -8 0 12 Z" fill={colors.accent} />
                </g>
            )}
        </g>
    );
};

const Bill: React.FC<{
    cx: number;
    cy: number;
    appearAt: number;
    label: string;
    color?: string;
    size?: number;
}> = ({ cx, cy, appearAt, label, color = colors.pos, size = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const w = 220 * size;
    const h = 130 * size;
    return (
        <g transform={`translate(${cx}, ${cy}) scale(${enter}) translate(${-cx}, ${-cy})`} opacity={enter}>
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={color} stroke={colors.ink} strokeWidth={3} rx={6} />
            <rect x={cx - w / 2 + 12} y={cy - h / 2 + 12} width={w - 24} height={h - 24} fill="none" stroke={colors.paper} strokeWidth={2} opacity={0.5} />
            <text x={cx} y={cy + h * 0.14} textAnchor="middle" fontFamily={fonts.display} fontSize={h * 0.62} fontWeight={700} fill={colors.paper}>
                {label}
            </text>
        </g>
    );
};

const KeepJar: React.FC<{ cx: number; cy: number; appearAt: number; filledAt?: number | null; broken?: boolean; ringAt?: number | null }> = ({
    cx,
    cy,
    appearAt,
    filledAt = null,
    broken = false,
    ringAt = null,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const w = 220;
    const h = 240;
    const fill =
        filledAt == null
            ? 0
            : interpolate(frame - filledAt, [0, 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeQ,
            });
    const ring =
        ringAt == null
            ? 0
            : interpolate(frame - ringAt, [0, 14, 36], [0, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
    return (
        <g transform={`translate(${cx}, ${cy}) scale(${enter}) translate(${-cx}, ${-cy})`} opacity={enter}>
            <rect x={cx - w / 2} y={cy - h / 2 + 24} width={w} height={h - 24} fill="none" stroke={broken ? colors.neg : colors.ink} strokeWidth={4} rx={20} />
            <rect x={cx - w / 2 - 14} y={cy - h / 2} width={w + 28} height={28} fill="none" stroke={broken ? colors.neg : colors.ink} strokeWidth={4} rx={6} />
            <text x={cx} y={cy - h / 2 - 30} textAnchor="middle" fontFamily={fonts.mono} fontSize={36} letterSpacing={5} fontWeight={700} fill={broken ? colors.neg : colors.ink}>
                {broken ? "EMPTY" : "KEEP"}
            </text>
            {!broken && fill > 0 && (
                <rect x={cx - w / 2 + 14} y={cy + h / 2 - 14 - (h - 60) * fill} width={w - 28} height={(h - 60) * fill} fill={colors.pos} opacity={0.7} rx={4} />
            )}
            {broken && (
                <>
                    <path d={`M ${cx - w / 4} ${cy + h / 2 - 8} q -10 30 0 60`} stroke={colors.neg} strokeWidth={5} fill="none" strokeLinecap="round" />
                    <path d={`M ${cx + w / 4} ${cy + h / 2 - 8} q 10 30 0 60`} stroke={colors.neg} strokeWidth={5} fill="none" strokeLinecap="round" />
                </>
            )}
            {ring > 0 && (
                <ellipse cx={cx} cy={cy} rx={w / 2 + 30 + ring * 30} ry={h / 2 + 30 + ring * 30} fill="none" stroke={colors.accent} strokeWidth={6} opacity={1 - ring} />
            )}
        </g>
    );
};

/** Wooden crate that catches the $2 cost bill. */
const CostsBin: React.FC<{ cx: number; cy: number; appearAt: number; receivedAt?: number | null }> = ({ cx, cy, appearAt, receivedAt = null }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const shake =
        receivedAt == null
            ? 0
            : interpolate(frame - receivedAt, [0, 4, 10, 16], [0, -6, 6, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
    const w = 280;
    const h = 200;
    return (
        <g transform={`translate(${cx + shake}, ${cy}) scale(${enter}) translate(${-cx}, ${-cy})`} opacity={enter}>
            {/* crate body */}
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={colors.warn} stroke={colors.ink} strokeWidth={4} rx={4} opacity={0.85} />
            {/* slats */}
            <line x1={cx - w / 2} y1={cy - h / 6} x2={cx + w / 2} y2={cy - h / 6} stroke={colors.ink} strokeWidth={2} opacity={0.5} />
            <line x1={cx - w / 2} y1={cy + h / 6} x2={cx + w / 2} y2={cy + h / 6} stroke={colors.ink} strokeWidth={2} opacity={0.5} />
            {/* label */}
            <text x={cx} y={cy - h / 2 - 28} textAnchor="middle" fontFamily={fonts.mono} fontSize={28} letterSpacing={4} fontWeight={700} fill={colors.ink}>
                COSTS
            </text>
            <text x={cx} y={cy + h / 2 + 38} textAnchor="middle" fontFamily={fonts.mono} fontSize={22} letterSpacing={3} fontWeight={500} fill={colors.mute}>
                FLOUR · POWER · TIME
            </text>
        </g>
    );
};

/** Big checklist row with two-layer label (plain words + formal name). */
const FormalChecklistRow: React.FC<{
    cx: number;
    cy: number;
    appearAt: number;
    checkAt: number;
    label: string;
    formal: string;
}> = ({ cx, cy, appearAt, checkAt, label, formal }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        frame: frame - appearAt,
        fps,
        config: { damping: 14 },
        durationInFrames: 22,
    });
    const checked = interpolate(frame - checkAt, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const boxSize = 84;
    const boxX = -460;
    const labelX = boxX + boxSize + 36;
    return (
        <g transform={`translate(${cx}, ${cy})`} opacity={enter}>
            <rect
                x={boxX}
                y={-boxSize / 2}
                width={boxSize}
                height={boxSize}
                fill={checked > 0.5 ? colors.pos : "none"}
                stroke={checked > 0.5 ? colors.pos : colors.ink}
                strokeWidth={4}
                rx={4}
            />
            {checked > 0 && (
                <path
                    d={`M ${boxX + 16} 4 l ${18 * checked} ${18 * checked} l ${38 * checked} ${-38 * checked}`}
                    stroke={colors.paper}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
            <text x={labelX} y={-6} fontFamily={fonts.display} fontSize={50} fontWeight={600} fill={colors.ink}>
                {label}
            </text>
            <text x={labelX} y={42} fontFamily={fonts.mono} fontSize={26} letterSpacing={4} fontWeight={600} fill={checked > 0.5 ? colors.pos : colors.mute}>
                {formal}
            </text>
        </g>
    );
};

/* ════════════════════════════════════════════════════════════════════
   SCENES
   ════════════════════════════════════════════════════════════════════ */

const SCOREBOARD_LABELS: [string, string, string] = ["MAKE", "HAND OVER", "KEEP"];
const SCOREBOARD_SUBS: [string, string, string] = ["OPERATIONS", "MARKETING & SALES", "FINANCE"];

/* ─── Scene 01 — Hook ─────────────────────────────────────────────── */
const HookScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);

    const bakeryCue = wordCue(words, "bakery", 4);
    const threeCue = wordCue(words, "three", bakeryCue + 30);
    const ideaCue = wordCue(words, "idea", threeCue + 60);

    const cx = REEL.width / 2;
    const cy = 1180;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>DAY 1 · WHAT IS A BUSINESS</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine text="A tiny" delay={bakeryCue} size={140} weight={700} color={colors.accent} />
                <InkWipeLine text="bakery." delay={bakeryCue + 6} size={140} weight={700} color={colors.accent} />
                <InkWipeLine
                    text="Three things have to be true."
                    delay={threeCue}
                    size={56}
                    weight={500}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
                <InkWipeLine
                    text="Or it's just an idea."
                    delay={ideaCue}
                    size={56}
                    weight={500}
                    italic
                    family={fonts.body}
                    color={colors.mute}
                />
            </ScenePad>

            <Stage>
                <Bakery cx={cx} cy={cy} width={780} appearAt={bakeryCue} drawDuration={32} open={null} />

                {/* Empty scoreboard preview */}
                <Scoreboard
                    cx={REEL.width / 2}
                    cy={1700}
                    appearAt={threeCue}
                    states={["empty", "empty", "empty"]}
                    revealAt={[threeCue, threeCue, threeCue]}
                    showLabelsAt={[ideaCue + 200, ideaCue + 200, ideaCue + 200]}
                />
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 02 — Make · Operations ────────────────────────────────── */
const MakeScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);

    const jobOneCue = wordCue(words, "job", 4);
    const wantCue = wordCue(words, "actually", jobOneCue + 30);
    const goodCue = wordCue(words, "good", wantCue + 30);
    const wishCue = wordCue(words, "wish", goodCue + 30);
    const opsCue = wordCue(words, "operations", wishCue + 30);

    const cx = REEL.width / 2;

    return (
        <AbsoluteFill style={{ opacity }}>
            <Stage>
                {/* Scoreboard at top */}
                <Scoreboard
                    cx={cx}
                    cy={400}
                    appearAt={4}
                    states={["check", "empty", "empty"]}
                    revealAt={[goodCue, total + 1000, total + 1000]}
                    showLabelsAt={[goodCue, total + 1000, total + 1000]}
                    labels={SCOREBOARD_LABELS}
                    subLabels={SCOREBOARD_SUBS}
                />

                {/* Bakery in lower middle */}
                <Bakery cx={cx} cy={1200} width={680} appearAt={0} drawDuration={1} breadAt={wantCue} />

                {/* Customer on right */}
                <Customer cx={cx + 320} cy={1340} appearAt={wantCue + 10} size={110} heart={goodCue} />

                {/* Headline below the scene action */}
                <text x={cx} y={1700} textAnchor="middle" fontFamily={fonts.display} fontSize={84} fontWeight={700} fill={colors.accent} opacity={interpolate(useCurrentFrame() - jobOneCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Job 1 — Make.
                </text>
                <text x={cx} y={1790} textAnchor="middle" fontFamily={fonts.body} fontSize={44} fontStyle="italic" fontWeight={500} fill={colors.mute} opacity={interpolate(useCurrentFrame() - wishCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Something people actually want.
                </text>
                <text x={cx} y={1870} textAnchor="middle" fontFamily={fonts.mono} fontSize={32} letterSpacing={5} fontWeight={700} fill={colors.pos} opacity={interpolate(useCurrentFrame() - opsCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    aka OPERATIONS
                </text>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 03 — Hand over · Marketing & Sales ────────────────────── */
const HandoverScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);
    const frame = useCurrentFrame();

    const jobTwoCue = wordCue(words, "job", 4);
    const handsCue = wordCue(words, "hands", jobTwoCue + 30);
    const openCue = wordCue(words, "open", handsCue + 30);
    const findCue = wordCue(words, "find", openCue + 30);
    const counterCue = wordCue(words, "counter", findCue + 30);
    const marketingCue = wordCue(words, "marketing", counterCue + 20);

    const cx = REEL.width / 2;
    const cy = 1200;

    const doorX = cx + 200;
    const startX = cx + 700;
    const slideT = interpolate(frame - findCue, [0, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const exitT = interpolate(frame - counterCue, [10, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const customerX = startX + (doorX - startX) * slideT + (cx + 700 - doorX) * exitT;
    const holdsLoaf = frame >= counterCue + 8;

    const loafT = interpolate(frame - counterCue, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const loafFromX = cx - 180;
    const loafToX = doorX - 60;
    const loafX = loafFromX + (loafToX - loafFromX) * loafT;
    const loafY = cy + 80;

    return (
        <AbsoluteFill style={{ opacity }}>
            <Stage>
                <Scoreboard
                    cx={cx}
                    cy={400}
                    appearAt={4}
                    states={["check", "check", "empty"]}
                    revealAt={[4, counterCue, total + 1000]}
                    showLabelsAt={[4, marketingCue, total + 1000]}
                    labels={SCOREBOARD_LABELS}
                    subLabels={SCOREBOARD_SUBS}
                />

                <Bakery cx={cx} cy={cy} width={680} appearAt={0} drawDuration={1} breadAt={0} open={openCue} />

                {loafT > 0 && loafT < 1 && (
                    <g transform={`translate(${loafX}, ${loafY - Math.sin(loafT * Math.PI) * 50})`}>
                        <BreadLoaf size={40} />
                    </g>
                )}

                <Customer cx={customerX} cy={cy + 240} appearAt={openCue} size={110} holdsLoaf={holdsLoaf} />

                <text x={cx} y={1700} textAnchor="middle" fontFamily={fonts.display} fontSize={84} fontWeight={700} fill={colors.accent} opacity={interpolate(frame - jobTwoCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Job 2 — Hand over.
                </text>
                <text x={cx} y={1790} textAnchor="middle" fontFamily={fonts.body} fontSize={44} fontStyle="italic" fontWeight={500} fill={colors.mute} opacity={interpolate(frame - handsCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Open. Findable. Across the counter.
                </text>
                <text x={cx} y={1870} textAnchor="middle" fontFamily={fonts.mono} fontSize={32} letterSpacing={5} fontWeight={700} fill={colors.pos} opacity={interpolate(frame - marketingCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    aka MARKETING & SALES
                </text>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 04 — Keep · Finance (cash-flow animation) ─────────────── */
const KeepScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);
    const frame = useCurrentFrame();

    const jobThreeCue = wordCue(words, "job", 4);
    const costCue = wordCue(words, "cost", jobThreeCue + 30);
    const fiveCue = wordCue(words, "five", costCue + 20);
    const twoCue = wordCue(words, "two", fiveCue + 30);
    const stayCue = wordCue(words, "stay", twoCue + 60);
    const wholeCue = wordCue(words, "whole", stayCue + 30);
    const financeCue = wordCue(words, "finance", wholeCue + 20);

    const cx = REEL.width / 2;

    // Vertical flow:
    //  Customer (top-center) ─ $5 ↓ ─ Bakery (middle-center)
    //  Bakery ─ $2 ↘ ─ Costs bin (lower-left)
    //  Bakery ─ $3 ↙ ─ Keep jar (lower-right)
    const customerX = cx;
    const customerY = 760;
    const bakeryX = cx;
    const bakeryY = 1080;
    const binX = 240;
    const binY = 1430;
    const jarX = REEL.width - 240;
    const jarY = 1430;

    // $5 bill: customer → bakery (down)
    const fiveT = interpolate(frame - fiveCue, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const fiveBillX = customerX;
    const fiveBillY = customerY + 80 + (bakeryY - 80 - (customerY + 80)) * fiveT;

    // $2 bill: bakery → bin (down-left)
    const twoT = interpolate(frame - twoCue, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const twoBillX = bakeryX + (binX - bakeryX) * twoT;
    const twoBillY = bakeryY + 80 + (binY - 80 - (bakeryY + 80)) * twoT;

    // $3 bill: bakery → jar (down-right)
    const threeT = interpolate(frame - stayCue, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeQ });
    const threeBillX = bakeryX + (jarX - bakeryX) * threeT;
    const threeBillY = bakeryY + 80 + (jarY - 80 - (bakeryY + 80)) * threeT;

    return (
        <AbsoluteFill style={{ opacity }}>
            <Stage>
                <Scoreboard
                    cx={cx}
                    cy={380}
                    appearAt={4}
                    states={["check", "check", "check"]}
                    revealAt={[4, 4, wholeCue]}
                    showLabelsAt={[4, 4, financeCue]}
                    labels={SCOREBOARD_LABELS}
                    subLabels={SCOREBOARD_SUBS}
                />

                {/* Customer at top with IN $5 label */}
                <Customer cx={customerX} cy={customerY} appearAt={costCue} size={90} />
                <text x={customerX + 130} y={customerY + 20} fontFamily={fonts.mono} fontSize={30} letterSpacing={3} fontWeight={700} fill={colors.pos} opacity={interpolate(frame - fiveCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    IN $5
                </text>

                {/* Bakery in middle, smaller */}
                <Bakery cx={bakeryX} cy={bakeryY} width={340} appearAt={costCue + 4} drawDuration={18} breadAt={costCue + 14} open={costCue + 14} />

                {/* Costs bin (lower left) */}
                <CostsBin cx={binX} cy={binY} appearAt={costCue + 8} receivedAt={twoCue + 24} />
                <text x={binX} y={binY + 220} textAnchor="middle" fontFamily={fonts.mono} fontSize={32} letterSpacing={4} fontWeight={700} fill={colors.warn} opacity={interpolate(frame - twoCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    OUT $2
                </text>

                {/* Keep jar (lower right) */}
                <KeepJar cx={jarX} cy={jarY} appearAt={costCue + 8} filledAt={stayCue + 24} ringAt={wholeCue} />
                <text x={jarX} y={jarY + 220} textAnchor="middle" fontFamily={fonts.mono} fontSize={32} letterSpacing={4} fontWeight={700} fill={colors.pos} opacity={interpolate(frame - stayCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    KEEP $3
                </text>

                {/* Animated bills */}
                {fiveT > 0 && fiveT < 1 && (
                    <g transform={`translate(${fiveBillX}, ${fiveBillY})`}>
                        <Bill cx={0} cy={0} appearAt={0} label="$5" color={colors.pos} size={0.9} />
                    </g>
                )}
                {twoT > 0 && twoT < 1 && (
                    <g transform={`translate(${twoBillX}, ${twoBillY})`}>
                        <Bill cx={0} cy={0} appearAt={0} label="$2" color={colors.warn} size={0.85} />
                    </g>
                )}
                {threeT > 0 && threeT < 1 && (
                    <g transform={`translate(${threeBillX}, ${threeBillY})`}>
                        <Bill cx={0} cy={0} appearAt={0} label="$3" color={colors.accent} size={0.9} />
                    </g>
                )}

                {/* Headlines at bottom */}
                <text x={cx} y={1740} textAnchor="middle" fontFamily={fonts.display} fontSize={70} fontWeight={700} fill={colors.accent} opacity={interpolate(frame - jobThreeCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Job 3 — Keep the gap.
                </text>
                <text x={cx} y={1820} textAnchor="middle" fontFamily={fonts.body} fontSize={42} fontStyle="italic" fontWeight={500} fill={colors.mute} opacity={interpolate(frame - wholeCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    $5 in − $2 out = $3 kept.
                </text>
                <text x={cx} y={1890} textAnchor="middle" fontFamily={fonts.mono} fontSize={30} letterSpacing={5} fontWeight={700} fill={colors.pos} opacity={interpolate(frame - financeCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    aka FINANCE
                </text>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 05 — The trap (3 rows with mini scoreboards) ──────────── */
const TrapScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 18, total);
    const frame = useCurrentFrame();

    const watchCue = wordCue(words, "watch", 4);
    // Bakery A: "Bakery A. Great bread. Locked door. Their operations work, their marketing doesn't."
    const aCue = wordCue(words, "great", watchCue + 10);
    const aMarketingCue = wordCueN(words, "marketing", 1, aCue + 60);
    // Bakery B: "Bakery B. Open every day. Bread nobody remembers. Marketing fine, operations broken."
    const bCue = wordCue(words, "every", aMarketingCue + 30);
    const bOpsCue = wordCueN(words, "operations", 2, bCue + 60);
    // Bakery C: "Bakery C. Customers everywhere, but five dollars in, six dollars out. Finance is the leak."
    const cCue = wordCue(words, "everywhere", bOpsCue + 30);
    const cFinanceCue = wordCue(words, "finance", cCue + 30);
    const fixCue = wordCue(words, "fix", cFinanceCue + 30);

    // Layout: 3 stacked rows. Each row has bakery on left, mini scoreboard center, caption right.
    // All within 1080 width.
    const rowYs = [780, 1180, 1580];
    const bakeryX = 180;
    const scoreboardX = 540;
    const captionX = 750;

    type Row = {
        y: number;
        rowAppearCue: number;
        revealCue: number;
        bakeryProps: { breadAt?: number | null; locked?: boolean; open?: number | null; breadDull?: boolean };
        states: CellState[];
        captionLine1: string;
        captionLine2: string;
    };

    const rows: Row[] = [
        {
            y: rowYs[0],
            rowAppearCue: aCue,
            revealCue: aMarketingCue,
            bakeryProps: { breadAt: aCue, locked: true },
            states: ["check", "cross", "empty"],
            captionLine1: "Great bread.",
            captionLine2: "Locked door.",
        },
        {
            y: rowYs[1],
            rowAppearCue: bCue,
            revealCue: bOpsCue,
            bakeryProps: { breadAt: bCue, breadDull: true, open: bCue },
            states: ["cross", "check", "empty"],
            captionLine1: "Open daily.",
            captionLine2: "Forgettable.",
        },
        {
            y: rowYs[2],
            rowAppearCue: cCue,
            revealCue: cFinanceCue,
            bakeryProps: { breadAt: cCue, open: cCue },
            states: ["check", "check", "cross"],
            captionLine1: "$5 in. $6 out.",
            captionLine2: "Nothing stays.",
        },
    ];

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>THE TRAP</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine text="Most do" delay={watchCue - 28} size={96} weight={700} color={colors.accent} />
                <InkWipeLine text="one or two." delay={watchCue - 14} size={96} weight={700} color={colors.accent} />
            </ScenePad>

            <Stage>
                {rows.map((r, i) => {
                    const rowOpacity = interpolate(frame - r.rowAppearCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    return (
                        <g key={i} opacity={rowOpacity}>
                            {/* Mini bakery */}
                            <Bakery cx={bakeryX} cy={r.y} width={260} appearAt={r.rowAppearCue} drawDuration={16} {...r.bakeryProps} />

                            {/* Mini scoreboard */}
                            <Scoreboard
                                cx={scoreboardX}
                                cy={r.y}
                                cellW={80}
                                cellH={110}
                                gap={14}
                                mini
                                appearAt={r.rowAppearCue + 6}
                                states={r.states}
                                revealAt={[r.revealCue, r.revealCue, r.revealCue]}
                            />

                            {/* Caption (right of scoreboard) */}
                            <text x={captionX} y={r.y - 18} fontFamily={fonts.display} fontSize={42} fontWeight={700} fill={colors.ink}>
                                {r.captionLine1}
                            </text>
                            <text x={captionX} y={r.y + 30} fontFamily={fonts.display} fontSize={42} fontWeight={700} fill={colors.neg}>
                                {r.captionLine2}
                            </text>
                            {/* Formal diagnosis line */}
                            <text x={captionX} y={r.y + 76} fontFamily={fonts.mono} fontSize={20} letterSpacing={3} fontWeight={600} fill={colors.mute} opacity={interpolate(frame - r.revealCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                                {i === 0 && "MARKETING broken"}
                                {i === 1 && "OPERATIONS broken"}
                                {i === 2 && "FINANCE broken"}
                            </text>
                        </g>
                    );
                })}

                {/* Footer */}
                <text x={REEL.width / 2} y={1860} textAnchor="middle" fontFamily={fonts.display} fontSize={56} fontWeight={700} fontStyle="italic" fill={colors.ink} opacity={interpolate(frame - fixCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Find the empty slot. Fix that one.
                </text>
            </Stage>
        </AbsoluteFill>
    );
};

/* ─── Scene 06 — Outro (formal checklist, no bakery) ──────────────── */
const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 24, total);
    const frame = useCurrentFrame();

    const ideaCue = wordCue(words, "idea", 4);
    const opsCue = wordCue(words, "operations", ideaCue + 20);
    const mktCue = wordCue(words, "marketing", opsCue + 20);
    const finCue = wordCue(words, "finance", mktCue + 20);
    const startCue = wordCue(words, "start", finCue + 30);

    const cx = REEL.width / 2;
    const rowGap = 220;
    const rowsTop = 900;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>START HERE</Eyebrow>
                <Hairline delay={18} duration={24} thickness={1} />
                <div style={{ height: space.s5 }} />
                <InkWipeLine text="Is each box" delay={ideaCue} size={120} weight={700} color={colors.accent} />
                <InkWipeLine text="checked?" delay={ideaCue + 10} size={120} weight={700} color={colors.accent} />
            </ScenePad>

            <Stage>
                <FormalChecklistRow cx={cx} cy={rowsTop} appearAt={ideaCue} checkAt={opsCue} label="People want it." formal="OPERATIONS" />
                <FormalChecklistRow cx={cx} cy={rowsTop + rowGap} appearAt={ideaCue + 6} checkAt={mktCue} label="They can get it." formal="MARKETING & SALES" />
                <FormalChecklistRow cx={cx} cy={rowsTop + rowGap * 2} appearAt={ideaCue + 12} checkAt={finCue} label="You keep more than you spent." formal="FINANCE" />

                <text x={cx} y={1720} textAnchor="middle" fontFamily={fonts.body} fontSize={56} fontStyle="italic" fontWeight={500} fill={colors.mute} opacity={interpolate(frame - startCue, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    Whichever is no — start there.
                </text>

                <g transform={`translate(${cx}, 1860)`} opacity={interpolate(frame - startCue, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    <circle cx={-180} cy={0} r={10} fill={colors.accent} />
                    <text x={-150} y={14} fontFamily={fonts.mono} fontSize={40} letterSpacing={6} fontWeight={700} fill={colors.ink}>
                        MADE PLAIN
                    </text>
                </g>
            </Stage>
        </AbsoluteFill>
    );
};

/* ════════════════════════════════════════════════════════════════════
   ROUTER + COMPOSITION
   ════════════════════════════════════════════════════════════════════ */

const SceneRouter: React.FC<{ id: string; words: Word[]; total: number }> = ({ id, words, total }) => {
    switch (id) {
        case "01-hook":
            return <HookScene words={words} total={total} />;
        case "02-make":
            return <MakeScene words={words} total={total} />;
        case "03-handover":
            return <HandoverScene words={words} total={total} />;
        case "04-keep":
            return <KeepScene words={words} total={total} />;
        case "05-trap":
            return <TrapScene words={words} total={total} />;
        case "06-outro":
            return <OutroScene words={words} total={total} />;
        default:
            return null;
    }
};

export const BusinessThreeJobs: React.FC = () => {
    return (
        <AbsoluteFill>
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
                            BUSINESS_THREE_JOBS_DURATION -
                            Math.round(REEL.fps * 0.8),
                            BUSINESS_THREE_JOBS_DURATION,
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
                >
                    <Audio src={staticFile(`business-three-jobs/voiceover/${scene.audio}`)} />
                    <SceneRouter id={scene.id} words={scene.words} total={scene.durationFrames} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
