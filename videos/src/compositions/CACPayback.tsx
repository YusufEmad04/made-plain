import React from "react";
import {
    AbsoluteFill,
    Sequence,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
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
} from "../brand/motion";
import {
    Storefront,
    TweenedCoin,
    Axis,
    DashedThreshold,
} from "../brand/svg";
import { colors, space, ease } from "../brand/tokens";
import { fonts } from "../brand/fonts";

/* ───────────────────────────────────────────────────────────────────
   CAC Payback (≈18s, 540f, 1080x1920) — animated.
   See videos/PLAN.md for the full scenario.
   ─────────────────────────────────────────────────────────────────── */

export const CAC_DURATION = 540;

/* ─── Scene 1 — Title (0–75, 75f) ─────────────────────────────────── */
const TitleScene: React.FC = () => {
    const opacity = useSceneFade(8, 12, 75);
    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad>
                <Eyebrow delay={4}>UNIT ECONOMICS</Eyebrow>
                <Hairline delay={22} color={colors.line} />
                <div style={{ marginTop: space.s5 }}>
                    <InkWipeLine text="When does" delay={28} size={120} stagger={3} />
                    <div style={{ marginTop: space.s3 }}>
                        <InkWipeLine text="the customer" delay={42} size={120} stagger={3} />
                    </div>
                    <div style={{ marginTop: space.s3 }}>
                        <InkWipeLine
                            text="pay you back?"
                            delay={56}
                            size={120}
                            color={colors.accent}
                            stagger={3}
                        />
                    </div>
                </div>
            </ScenePad>
        </AbsoluteFill>
    );
};

/* ─── Scene 2 — Transaction (75–180, 105f) ────────────────────────── */
const TransactionScene: React.FC = () => {
    const opacity = useSceneFade(10, 12, 105);
    const frame = useCurrentFrame();

    const storefrontDrawAt = 6;
    const coinFlightStart = 28;
    const coinFlightEnd = 50;
    const pulseAt = coinFlightEnd;
    const monthlyStart = 60;
    const monthlyChips = [0, 12, 24].map((d) => monthlyStart + d);

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4} color={colors.accent}>THE EXAMPLE</Eyebrow>
                <Hairline delay={22} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Storefront
                    x={620}
                    y={780}
                    size={340}
                    delay={storefrontDrawAt}
                    duration={26}
                    pulseAt={pulseAt}
                />
                <TweenedCoin
                    fromX={140}
                    fromY={950}
                    toX={790}
                    toY={950}
                    startFrame={coinFlightStart}
                    endFrame={coinFlightEnd}
                    arcHeight={-220}
                    label="$400"
                    r={62}
                    fill={colors.accent}
                    textColor={colors.accentInk}
                    fadeOutAt={coinFlightEnd + 2}
                />
                {monthlyChips.map((startF, i) => (
                    <TweenedCoin
                        key={i}
                        fromX={790}
                        fromY={920}
                        toX={210 + i * 220}
                        toY={1380}
                        startFrame={startF}
                        endFrame={startF + 22}
                        arcHeight={-180}
                        label="$80"
                        r={48}
                        fill={colors.ink}
                        textColor={colors.paper}
                    />
                ))}
                <line
                    x1={120}
                    x2={interpolate(frame - (monthlyStart - 6), [0, 18], [120, 960], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...ease.quart),
                    })}
                    y1={1450}
                    y2={1450}
                    stroke={colors.line}
                    strokeWidth={2}
                />
            </svg>

            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    top: 1180,
                    opacity: interpolate(frame - 40, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.body,
                        fontSize: 38,
                        color: colors.mute,
                        fontStyle: "italic",
                    }}
                >
                    Acquire a clinic for{" "}
                    <span style={{ fontFamily: fonts.mono, color: colors.accent, fontStyle: "normal" }}>
                        $400
                    </span>
                    .
                </span>
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    top: 1540,
                    opacity: interpolate(frame - 78, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.body,
                        fontSize: 38,
                        color: colors.mute,
                        fontStyle: "italic",
                    }}
                >
                    It pays you{" "}
                    <span style={{ fontFamily: fonts.mono, color: colors.ink, fontStyle: "normal" }}>
                        $80
                    </span>{" "}
                    a month.
                </span>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 3 — Payback chart (180–360, 180f) ────────────────────── */
const ChartScene: React.FC = () => {
    const opacity = useSceneFade(8, 14, 180);
    const frame = useCurrentFrame();

    // Chart geometry
    const chartLeft = 110;
    const chartTop = 540;
    const chartWidth = 860;
    const chartHeight = 700;
    const baselineY = chartTop + chartHeight;
    const max = 480;
    const cac = 400;
    const cacY = baselineY - (cac / max) * chartHeight;

    const monthDelays = [22, 44, 66, 88, 110, 132];
    const barWidth = chartWidth / 6 - 14;

    // Total = sum of (animated bar values)
    const total = (() => {
        let t = 0;
        for (let i = 0; i < 6; i++) {
            const localProgress = interpolate(
                frame - monthDelays[i],
                [0, 18],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            t += 80 * localProgress;
        }
        return Math.round(t);
    })();

    const crossingFrame = 110 + 18;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4}>THE CHART</Eyebrow>
                <Hairline delay={22} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <Axis
                    x={chartLeft}
                    y={baselineY}
                    width={chartWidth}
                    ticks={6}
                    tickHeight={10}
                    delay={20}
                    duration={20}
                    color={colors.line}
                />
                <line
                    x1={chartLeft}
                    y1={baselineY}
                    x2={chartLeft}
                    y2={
                        baselineY -
                        chartHeight *
                        interpolate(frame - 20, [0, 22], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(...ease.quart),
                        })
                    }
                    stroke={colors.line}
                    strokeWidth={1.5}
                />

                <DashedThreshold
                    x={chartLeft}
                    y={cacY}
                    width={chartWidth}
                    delay={50}
                    duration={26}
                    label="CAC $400"
                    color={colors.accent}
                    flashAt={crossingFrame + 2}
                />

                {/* Cumulative payback bars — each month adds $80 on top of prior. */}
                {monthDelays.map((delay, i) => {
                    const isCrossing = i === 4;
                    const barX = chartLeft + (chartWidth / 6) * i + 7;
                    const cumulative = (i + 1) * 80;
                    const barColor =
                        isCrossing && frame >= crossingFrame ? colors.accent : colors.ink;
                    const localProgress = interpolate(frame - delay, [0, 20], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...ease.quart),
                    });
                    const targetH = (cumulative / max) * chartHeight;
                    const h = targetH * localProgress;
                    return (
                        <g key={`b-${i}`}>
                            <rect
                                x={barX}
                                y={baselineY - h}
                                width={barWidth}
                                height={h}
                                fill={barColor}
                                rx={2}
                            />
                            {localProgress > 0.7 && (
                                <text
                                    x={barX + barWidth / 2}
                                    y={baselineY - h - 14}
                                    textAnchor="middle"
                                    fontFamily={fonts.mono}
                                    fontSize={20}
                                    fontWeight={600}
                                    fill={barColor}
                                    style={{ fontVariantNumeric: "tabular-nums" }}
                                    opacity={interpolate(localProgress, [0.7, 1], [0, 1])}
                                >
                                    {`$${cumulative}`}
                                </text>
                            )}
                            {/* Month axis label */}
                            <text
                                x={barX + barWidth / 2}
                                y={baselineY + 36}
                                textAnchor="middle"
                                fontFamily={fonts.mono}
                                fontSize={20}
                                fill={colors.mute2}
                                opacity={interpolate(frame - delay, [0, 10], [0, 1], {
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                })}
                            >
                                M{i + 1}
                            </text>
                        </g>
                    );
                })}

                {/* Crossing dot */}
                {frame >= crossingFrame && (
                    <circle
                        cx={chartLeft + (chartWidth / 6) * 4 + 7 + barWidth / 2}
                        cy={cacY}
                        r={interpolate(frame - crossingFrame, [0, 8], [0, 14], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(...ease.spring),
                        })}
                        fill={colors.accent}
                    />
                )}
            </svg>

            {/* Hide the helper GrowBars by overlaying — actually they're behind, leave them */}

            {/* Earned counter */}
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    top: 380,
                    opacity: interpolate(frame - 22, [0, 12], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <span
                    style={{
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        color: colors.mute,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                    }}
                >
                    earned
                </span>
                <span
                    style={{
                        display: "block",
                        fontFamily: fonts.mono,
                        fontWeight: 600,
                        fontSize: 84,
                        color: frame >= crossingFrame ? colors.accent : colors.ink,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.02em",
                        marginTop: 6,
                    }}
                >
                    ${total}
                </span>
            </div>

            {/* Final reveal — "5 months." */}
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    top: 1340,
                    opacity: interpolate(frame - 138, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <div
                    style={{
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 200,
                        lineHeight: 0.9,
                        color: colors.accent,
                        letterSpacing: "-0.04em",
                    }}
                >
                    5 months.
                </div>
                <div
                    style={{
                        marginTop: 12,
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 38,
                        color: colors.mute,
                    }}
                >
                    That's payback.
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 4 — Payback vs Runway (360–480, 120f) ─────────────────── */
const RunwayScene: React.FC = () => {
    const opacity = useSceneFade(8, 12, 120);
    const frame = useCurrentFrame();

    const barLeft = 90;
    const barMaxWidth = 900;
    const monthsMax = 6;
    const paybackWidth = barMaxWidth * (5 / monthsMax);
    const runwayWidth = barMaxWidth * (3 / monthsMax);

    const paybackProg = interpolate(frame - 8, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...ease.quart),
    });
    const runwayProg = interpolate(frame - 22, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...ease.quart),
    });
    const drainProg = interpolate(frame - 56, [0, 28], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.42, 0, 1, 1),
    });
    const runwayCurrent = runwayWidth * Math.max(0, 1 - drainProg);

    const paybackY = 720;
    const runwayY = 1020;
    const barHeight = 84;

    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="start">
                <Eyebrow delay={4} color={colors.warn}>WHEN PAYBACK &gt; RUNWAY</Eyebrow>
                <Hairline delay={22} color={colors.line} />
            </ScenePad>

            <svg
                viewBox="0 0 1080 1920"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
            >
                <text
                    x={barLeft}
                    y={paybackY - 14}
                    fontFamily={fonts.mono}
                    fontSize={22}
                    fill={colors.mute}
                    letterSpacing="0.12em"
                    opacity={paybackProg}
                >
                    PAYBACK
                </text>
                <rect
                    x={barLeft}
                    y={paybackY}
                    width={paybackWidth * paybackProg}
                    height={barHeight}
                    fill={colors.ink}
                    rx={3}
                />
                {paybackProg > 0.6 && (
                    <text
                        x={barLeft + paybackWidth + 16}
                        y={paybackY + barHeight / 2 + 12}
                        fontFamily={fonts.mono}
                        fontWeight={600}
                        fontSize={36}
                        fill={colors.ink}
                        opacity={interpolate(paybackProg, [0.6, 1], [0, 1])}
                    >
                        5 months
                    </text>
                )}

                <text
                    x={barLeft}
                    y={runwayY - 14}
                    fontFamily={fonts.mono}
                    fontSize={22}
                    fill={colors.mute}
                    letterSpacing="0.12em"
                    opacity={runwayProg}
                >
                    RUNWAY
                </text>
                <rect
                    x={barLeft}
                    y={runwayY}
                    width={runwayCurrent}
                    height={barHeight}
                    fill={colors.accent}
                    rx={3}
                />
                {runwayProg > 0.6 && (
                    <text
                        x={barLeft + runwayWidth + 16}
                        y={runwayY + barHeight / 2 + 12}
                        fontFamily={fonts.mono}
                        fontWeight={600}
                        fontSize={36}
                        fill={colors.accent}
                        opacity={interpolate(runwayProg, [0.6, 1], [0, 1])}
                    >
                        {`${Math.max(0, Math.ceil(3 * (1 - drainProg)))} months left`}
                    </text>
                )}

                {/* Tick legend */}
                <line
                    x1={barLeft}
                    y1={1180}
                    x2={barLeft + barMaxWidth}
                    y2={1180}
                    stroke={colors.line}
                    strokeWidth={1}
                />
                {Array.from({ length: 7 }).map((_, i) => (
                    <g key={i}>
                        <line
                            x1={barLeft + (barMaxWidth / 6) * i}
                            x2={barLeft + (barMaxWidth / 6) * i}
                            y1={1180}
                            y2={1190}
                            stroke={colors.line}
                            strokeWidth={1}
                        />
                        <text
                            x={barLeft + (barMaxWidth / 6) * i}
                            y={1218}
                            textAnchor="middle"
                            fontFamily={fonts.mono}
                            fontSize={18}
                            fill={colors.mute2}
                        >
                            {i === 0 ? "now" : `M${i}`}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Screenshot line */}
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    top: 1320,
                    opacity: interpolate(frame - 70, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <div
                    style={{
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 50,
                        lineHeight: 1.25,
                        color: colors.ink,
                        letterSpacing: "-0.005em",
                    }}
                >
                    You don't have a growth engine —
                    <br />
                    you have a{" "}
                    <MarkerHighlight delay={94} duration={20} behind>
                        cash leak.
                    </MarkerHighlight>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Scene 5 — Brand outro (480–540, 60f) ────────────────────────── */
const OutroScene: React.FC = () => {
    const opacity = useSceneFade(8, 0, 60);
    return (
        <AbsoluteFill style={{ opacity }}>
            <ScenePad align="center">
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: space.s5 }}>
                    <Hairline delay={2} color={colors.line} />
                    <div style={{ display: "flex", alignItems: "center", gap: space.s4 }}>
                        <DotMark size={36} delay={6} />
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
                </div>
            </ScenePad>
        </AbsoluteFill>
    );
};

export const CACPayback: React.FC = () => {
    const { fps } = useVideoConfig();
    return (
        <AbsoluteFill>
            <PaperBackground />
            <Sequence durationInFrames={75} premountFor={1 * fps}>
                <TitleScene />
            </Sequence>
            <Sequence from={75} durationInFrames={105} premountFor={1 * fps}>
                <TransactionScene />
            </Sequence>
            <Sequence from={180} durationInFrames={180} premountFor={1 * fps}>
                <ChartScene />
            </Sequence>
            <Sequence from={360} durationInFrames={120} premountFor={1 * fps}>
                <RunwayScene />
            </Sequence>
            <Sequence from={480} durationInFrames={60} premountFor={1 * fps}>
                <OutroScene />
            </Sequence>
        </AbsoluteFill>
    );
};
