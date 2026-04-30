import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    interpolate,
    useCurrentFrame,
    Easing,
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
import { Station, QueueDots, FlowArrow } from "../../brand/svg";
import { colors, space, ease } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

const manifest = manifestJson as Manifest;

/* ───────────────────────────────────────────────────────────────────
   Bottleneck — Theory of Constraints. Narrated reel.
   Durations come from `voiceover/manifest.json`. See PLAN.md.
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

export const BOTTLENECK_DURATION = manifest.totalFrames;

function wordCue(words: Word[], needle: string, fallback = 0): number {
    const n = needle.toLowerCase();
    for (const w of words) {
        if (w.word.toLowerCase().includes(n)) return w.startFrame;
    }
    return fallback;
}

const easeQ = (t: number) => Easing.bezier(...ease.quart)(t);

/* Common factory line layout */
const LINE_Y = 1100;
const STATION_W = 220;
const STATION_H = 220;
const STATIONS_X = [120, 460, 820]; // left edges; spacing leaves room for arrows

/* ─── Scene 01 — Title ─────────────────────────────────────────────── */
const TitleScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const chainCue = wordCue(words, "chain", 4);
    const weakestCue = wordCue(words, "weakest", chainCue + 30);
    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad>
                <Eyebrow delay={2}>THEORY OF CONSTRAINTS · MADE PLAIN</Eyebrow>
                <Hairline delay={16} color={colors.line} />
                <div style={{ marginTop: space.s7 }}>
                    <InkWipeLine
                        text="A chain is only as strong"
                        delay={chainCue}
                        size={86}
                        stagger={1.6}
                    />
                    <div style={{ marginTop: space.s4 }}>
                        <InkWipeLine
                            text="as its weakest link."
                            delay={weakestCue}
                            size={102}
                            color={colors.warn}
                            stagger={2.2}
                        />
                    </div>
                </div>
            </ScenePad>
        </AbsoluteFill>
    );
};

/* ─── Scene 02 — Factory line draws on ────────────────────────────── */
const LineScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const designCue = wordCue(words, "design", 30);
    const buildCue = wordCue(words, "build", designCue + 24);
    const shipCue = wordCue(words, "ship", buildCue + 24);

    const arrow1Delay = designCue + 14;
    const arrow2Delay = buildCue + 14;

    // Throughput counter ramps to 100/min
    const tCounter = interpolate(frame - shipCue, [0, 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const rate = Math.round(100 * tCounter);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>EVERY BUSINESS · IS A LINE</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Station
                    x={STATIONS_X[0]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="DESIGN"
                    rate="100/min"
                    delay={designCue}
                />
                <FlowArrow
                    x={STATIONS_X[0] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[1] - (STATIONS_X[0] + STATION_W) - 20}
                    delay={arrow1Delay}
                />
                <Station
                    x={STATIONS_X[1]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="BUILD"
                    rate="100/min"
                    delay={buildCue}
                />
                <FlowArrow
                    x={STATIONS_X[1] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[2] - (STATIONS_X[1] + STATION_W) - 20}
                    delay={arrow2Delay}
                />
                <Station
                    x={STATIONS_X[2]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="SHIP"
                    rate="100/min"
                    delay={shipCue}
                />
            </svg>

            {/* Throughput counter */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 64,
                    top: 460,
                    textAlign: "right",
                    opacity: tCounter,
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.14em",
                    }}
                >
                    THROUGHPUT
                </span>
                <div
                    style={{
                        marginTop: 4,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 140,
                        color: colors.ink,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {rate}
                    <span style={{ fontSize: 38, color: colors.mute, marginLeft: 8 }}>/min</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 03 — One station weakens ──────────────────────────────── */
const SlowestScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const slowCue = wordCue(words, "slow", 6);
    const pileCue = wordCue(words, "pile", slowCue + 24);
    const dropsCue = wordCue(words, "drop", pileCue + 24);

    // Throughput drops 100 → 40
    const tDrop = interpolate(frame - dropsCue, [0, 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const rate = Math.round(100 - 60 * tDrop);

    // BUILD station slowdown opacity transition
    const slowT = interpolate(frame - slowCue, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.warn}>BOTTLENECK FORMS</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                {/* Stations are pre-drawn (delay 0, fast) */}
                <Station
                    x={STATIONS_X[0]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="DESIGN"
                    rate="100/min"
                    delay={0}
                    duration={6}
                />
                <FlowArrow
                    x={STATIONS_X[0] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[1] - (STATIONS_X[0] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                />
                {/* BUILD turns ochre on slowCue. Use TWO overlaid stations and crossfade. */}
                <g opacity={1 - slowT}>
                    <Station
                        x={STATIONS_X[1]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="BUILD"
                        rate="100/min"
                        delay={0}
                        duration={6}
                    />
                </g>
                <g opacity={slowT}>
                    <Station
                        x={STATIONS_X[1]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="BUILD"
                        rate="40/min"
                        delay={0}
                        duration={6}
                        color={colors.warn}
                        rateColor={colors.warn}
                        fillOpacity={0.08}
                    />
                    {/* BOTTLENECK label below */}
                    <text
                        x={STATIONS_X[1] + STATION_W / 2}
                        y={LINE_Y + STATION_H + 70}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={20}
                        fontWeight={700}
                        fill={colors.warn}
                        letterSpacing="0.18em"
                    >
                        BOTTLENECK
                    </text>
                </g>
                <FlowArrow
                    x={STATIONS_X[1] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[2] - (STATIONS_X[1] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                    thickness={interpolate(slowT, [0, 1], [6, 2.5])}
                    color={interpolate(slowT, [0, 1], [0, 1]) > 0.5 ? colors.warn : colors.ink}
                />
                <Station
                    x={STATIONS_X[2]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="SHIP"
                    rate="40/min"
                    delay={0}
                    duration={6}
                />

                {/* Queue dots stacking behind BUILD */}
                <QueueDots
                    x={STATIONS_X[1] - 30}
                    y={LINE_Y + STATION_H / 2}
                    count={8}
                    delay={pileCue}
                    stagger={5}
                    spacing={28}
                    r={11}
                    color={colors.warn}
                />
            </svg>

            {/* Throughput counter dropping */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 64,
                    top: 460,
                    textAlign: "right",
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.14em",
                    }}
                >
                    THROUGHPUT
                </span>
                <div
                    style={{
                        marginTop: 4,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 140,
                        color: tDrop > 0.4 ? colors.warn : colors.ink,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {rate}
                    <span style={{ fontSize: 38, color: colors.mute, marginLeft: 8 }}>/min</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 04 — Tempting fix (speed up wrong station) ────────────── */
const TemptingScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const fasterCue = wordCue(words, "faster", 6);
    const sameCue = wordCue(words, "same", fasterCue + 24);
    const inventoryCue = wordCue(words, "inventory", sameCue + 24);

    // Counter shake on sameCue (still 40)
    const shake = interpolate(
        Math.sin(((frame - sameCue) * Math.PI) / 8),
        [-1, 1],
        [-1, 1]
    );
    const shakeAmp =
        frame >= sameCue && frame < sameCue + 30
            ? interpolate(frame - sameCue, [0, 30], [4, 0]) * shake
            : 0;

    // Design pulse green on fasterCue
    const designPulseT = interpolate(frame - fasterCue, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>THE TEMPTING FIX</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                {/* DESIGN station - rate cycles up */}
                <g opacity={1 - designPulseT}>
                    <Station
                        x={STATIONS_X[0]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="DESIGN"
                        rate="100/min"
                        delay={0}
                        duration={6}
                    />
                </g>
                <g opacity={designPulseT}>
                    <Station
                        x={STATIONS_X[0]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="DESIGN"
                        rate="200/min"
                        delay={0}
                        duration={6}
                        color={colors.pos}
                        rateColor={colors.pos}
                        fillOpacity={0.08}
                        pulse={{ at: fasterCue, color: colors.pos }}
                    />
                </g>
                <FlowArrow
                    x={STATIONS_X[0] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[1] - (STATIONS_X[0] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                    thickness={interpolate(designPulseT, [0, 1], [6, 10])}
                    color={designPulseT > 0.5 ? colors.pos : colors.ink}
                    flowing={designPulseT > 0.6}
                />
                {/* BUILD remains the bottleneck */}
                <Station
                    x={STATIONS_X[1]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="BUILD"
                    rate="40/min"
                    delay={0}
                    duration={6}
                    color={colors.warn}
                    rateColor={colors.warn}
                    fillOpacity={0.08}
                />
                <FlowArrow
                    x={STATIONS_X[1] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[2] - (STATIONS_X[1] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                    thickness={2.5}
                    color={colors.warn}
                />
                <Station
                    x={STATIONS_X[2]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="SHIP"
                    rate="40/min"
                    delay={0}
                    duration={6}
                />

                {/* Larger queue stacking up before BUILD */}
                <QueueDots
                    x={STATIONS_X[1] - 30}
                    y={LINE_Y + STATION_H / 2}
                    count={14}
                    delay={inventoryCue}
                    stagger={4}
                    spacing={28}
                    r={11}
                    color={colors.warn}
                />
            </svg>

            {/* Throughput counter — STILL 40 */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 64,
                    top: 460,
                    textAlign: "right",
                    transform: `translateX(${shakeAmp}px)`,
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.14em",
                    }}
                >
                    THROUGHPUT
                </span>
                <div
                    style={{
                        marginTop: 4,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 140,
                        color: colors.warn,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    40
                    <span style={{ fontSize: 38, color: colors.mute, marginLeft: 8 }}>/min</span>
                </div>
                <div
                    style={{
                        marginTop: 6,
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 30,
                        color: colors.mute,
                        opacity: interpolate(frame - sameCue, [0, 16], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }),
                    }}
                >
                    unchanged.
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 05 — Fix the bottleneck ───────────────────────────────── */
const FixScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const fixCue = wordCue(words, "fix", 6);
    const jumpsCue = wordCue(words, "jump", fixCue + 24);

    const fixT = interpolate(frame - fixCue, [0, 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    // Throughput rises 40 → 100 on jumpsCue
    const jumpT = interpolate(frame - jumpsCue, [0, 28], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeQ,
    });
    const rate = Math.round(40 + 60 * jumpT);
    // queue drains: dot count shrinks
    const queueCount = Math.round(14 * (1 - jumpT));

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2} color={colors.accent}>FIX THE LIMIT</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Station
                    x={STATIONS_X[0]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="DESIGN"
                    rate="100/min"
                    delay={0}
                    duration={6}
                />
                <FlowArrow
                    x={STATIONS_X[0] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[1] - (STATIONS_X[0] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                />
                {/* BUILD: ochre → pulsing → green/ink */}
                <g opacity={1 - fixT}>
                    <Station
                        x={STATIONS_X[1]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="BUILD"
                        rate="40/min"
                        delay={0}
                        duration={6}
                        color={colors.warn}
                        rateColor={colors.warn}
                        fillOpacity={0.08}
                    />
                </g>
                <g opacity={fixT}>
                    <Station
                        x={STATIONS_X[1]}
                        y={LINE_Y}
                        width={STATION_W}
                        height={STATION_H}
                        label="BUILD"
                        rate={`${Math.round(40 + 60 * jumpT)}/min`}
                        delay={0}
                        duration={6}
                        color={colors.ink}
                        rateColor={colors.pos}
                        fillOpacity={0.04}
                        pulse={{ at: fixCue, color: colors.neg }}
                    />
                </g>
                <FlowArrow
                    x={STATIONS_X[1] + STATION_W + 10}
                    y={LINE_Y + STATION_H / 2}
                    length={STATIONS_X[2] - (STATIONS_X[1] + STATION_W) - 20}
                    delay={0}
                    duration={6}
                    thickness={interpolate(jumpT, [0, 1], [2.5, 6])}
                    color={jumpT > 0.5 ? colors.ink : colors.warn}
                    flowing={jumpT > 0.6}
                />
                <Station
                    x={STATIONS_X[2]}
                    y={LINE_Y}
                    width={STATION_W}
                    height={STATION_H}
                    label="SHIP"
                    rate={`${rate}/min`}
                    delay={0}
                    duration={6}
                />

                {/* Queue draining */}
                <QueueDots
                    x={STATIONS_X[1] - 30}
                    y={LINE_Y + STATION_H / 2}
                    count={queueCount}
                    delay={0}
                    stagger={0}
                    spacing={28}
                    r={11}
                    color={colors.warn}
                />
            </svg>

            {/* Throughput counter rising */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 64,
                    top: 460,
                    textAlign: "right",
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.14em",
                    }}
                >
                    THROUGHPUT
                </span>
                <div
                    style={{
                        marginTop: 4,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 140,
                        color: jumpT > 0.5 ? colors.pos : colors.warn,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {rate}
                    <span style={{ fontSize: 38, color: colors.mute, marginLeft: 8 }}>/min</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 06 — The rule ──────────────────────────────────────────── */
const RuleScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const opacity = useSceneFade(8, 14, total);
    const frame = useCurrentFrame();
    const throughputCue = wordCue(words, "throughput", 4);
    const bottleneckCue = wordCue(words, "bottleneck", throughputCue + 30);
    const theatreCue = wordCue(words, "theatre", bottleneckCue + 30);

    const line1T = interpolate(frame - throughputCue, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const line2T = interpolate(frame - theatreCue, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={2}>THE RULE</Eyebrow>
                <Hairline delay={14} color={colors.line} />
            </ScenePad>

            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    top: 700,
                }}
            >
                <div
                    style={{
                        opacity: line1T,
                        transform: `translateY(${interpolate(line1T, [0, 1], [16, 0])}px)`,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 88,
                        color: colors.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                    }}
                >
                    Throughput is set by the{" "}
                    <MarkerHighlight delay={bottleneckCue} duration={22} behind color={colors.warn}>
                        bottleneck.
                    </MarkerHighlight>
                </div>

                <div
                    style={{
                        marginTop: space.s6,
                        opacity: line2T,
                        transform: `translateY(${interpolate(line2T, [0, 1], [16, 0])}px)`,
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 48,
                        color: colors.mute,
                        lineHeight: 1.25,
                    }}
                >
                    Improving anything else
                    <br />
                    is theatre.
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 07 — Outro ─────────────────────────────────────────────── */
const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ total }) => {
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
                            fontSize: 38,
                            color: colors.mute,
                        }}
                    >
                        Find the slow link. Then break it.
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
        case "02-line":
            return <LineScene {...props} />;
        case "03-slowest":
            return <SlowestScene {...props} />;
        case "04-tempting":
            return <TemptingScene {...props} />;
        case "05-fix":
            return <FixScene {...props} />;
        case "06-rule":
            return <RuleScene {...props} />;
        case "07-outro":
            return <OutroScene {...props} />;
        default:
            return null;
    }
};

export const Bottleneck: React.FC = () => {
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
                    <Audio src={staticFile(`bottleneck/voiceover/${scene.audio}`)} />
                    <SceneRouter scene={scene as SceneManifest} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
