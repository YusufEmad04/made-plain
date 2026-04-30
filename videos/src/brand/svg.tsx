import React from "react";
import {
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Easing,
} from "remotion";
import { colors, ease } from "./tokens";
import { fonts } from "./fonts";

/* ───────────────────────────────────────────────────────────────────
   Made Plain — Animated SVG primitives
   These are the visual building blocks for concept reels: bucket,
   coin, drops, bars, axes, threshold lines, storefront. Every
   primitive is a pure function of `useCurrentFrame()`.
   ─────────────────────────────────────────────────────────────────── */

/**
 * `<DrawPath>` — draws an SVG path on by tweening stroke-dashoffset.
 * Pass the path's measured length (or a generous overestimate).
 */
export const DrawPath: React.FC<
    React.SVGProps<SVGPathElement> & {
        d: string;
        length: number;
        delay?: number;
        duration?: number;
        stroke?: string;
        strokeWidth?: number;
    }
> = ({
    d,
    length,
    delay = 0,
    duration = 30,
    stroke = colors.ink,
    strokeWidth = 3,
    ...rest
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        return (
            <path
                d={d}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - progress)}
                {...rest}
            />
        );
    };

/**
 * `<Storefront>` — a Phosphor-style line drawing of a small shop.
 * Two doors, awning, window. Stroke-draws on with `delay`/`duration`.
 */
export const Storefront: React.FC<{
    x: number;
    y: number;
    size?: number;
    delay?: number;
    duration?: number;
    pulseAt?: number;
    stroke?: string;
}> = ({
    x,
    y,
    size = 200,
    delay = 0,
    duration = 30,
    pulseAt,
    stroke = colors.ink,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        const pulseScale =
            pulseAt !== undefined
                ? 1 +
                0.06 *
                Math.max(
                    0,
                    Math.sin(
                        interpolate(frame - pulseAt, [0, 8], [0, Math.PI], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                    )
                )
                : 1;

        // viewBox is 100x100; we scale to `size`
        // Building rectangle, awning stripes, door, window, sign dot
        return (
            <g
                transform={`translate(${x},${y}) scale(${(size / 100) * pulseScale}) translate(${-50 * (pulseScale - 1) * 0
                    },0)`}
            >
                {/* base */}
                <DrawPath
                    d="M 5 95 L 5 35 L 95 35 L 95 95 Z"
                    length={320}
                    delay={delay}
                    duration={duration}
                    stroke={stroke}
                    strokeWidth={2.5}
                />
                {/* awning */}
                <DrawPath
                    d="M 0 35 L 100 35 L 92 22 L 8 22 Z"
                    length={240}
                    delay={delay + 6}
                    duration={duration - 6}
                    stroke={stroke}
                    strokeWidth={2.5}
                />
                {/* awning stripes */}
                <DrawPath
                    d="M 22 22 L 16 35 M 38 22 L 32 35 M 54 22 L 48 35 M 70 22 L 64 35 M 86 22 L 80 35"
                    length={90}
                    delay={delay + 12}
                    duration={duration - 6}
                    stroke={stroke}
                    strokeWidth={2}
                />
                {/* door */}
                <DrawPath
                    d="M 38 95 L 38 60 L 62 60 L 62 95"
                    length={94}
                    delay={delay + 16}
                    duration={duration - 8}
                    stroke={stroke}
                    strokeWidth={2.5}
                />
                {/* window */}
                <DrawPath
                    d="M 14 50 L 30 50 L 30 64 L 14 64 Z M 22 50 L 22 64 M 14 57 L 30 57"
                    length={120}
                    delay={delay + 18}
                    duration={duration - 8}
                    stroke={stroke}
                    strokeWidth={2}
                />
                {/* sign dot */}
                <circle
                    cx={50}
                    cy={14}
                    r={
                        interpolate(frame - delay - 24, [0, 10], [0, 2.5], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                    }
                    fill={colors.accent}
                />
            </g>
        );
    };

/**
 * `<CoinChip>` — a round chip with a `$N` label inside.
 * Rendered as an SVG `<g>` so it can be transformed/animated by parents.
 */
export const CoinChip: React.FC<{
    cx: number;
    cy: number;
    r?: number;
    label: string;
    fill?: string;
    textColor?: string;
    borderColor?: string;
    fontSize?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
}> = ({
    cx,
    cy,
    r = 38,
    label,
    fill = colors.accent,
    textColor = colors.accentInk,
    borderColor,
    fontSize,
    rotate = 0,
    scale = 1,
    opacity = 1,
}) => {
        const fs = fontSize ?? r * 0.7;
        return (
            <g
                transform={`translate(${cx},${cy}) rotate(${rotate}) scale(${scale}) translate(${-cx},${-cy})`}
                opacity={opacity}
            >
                <circle cx={cx} cy={cy} r={r} fill={fill} />
                {borderColor && (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={r - 1.5}
                        fill="none"
                        stroke={borderColor}
                        strokeWidth={2}
                    />
                )}
                <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={fonts.mono}
                    fontWeight={600}
                    fontSize={fs}
                    fill={textColor}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {label}
                </text>
            </g>
        );
    };

/**
 * `<TweenedCoin>` — coin chip that travels along an arc from
 * `(fromX,fromY)` to `(toX,toY)` between `startFrame` and `endFrame`,
 * with optional `arcHeight` (negative = bow up, positive = bow down).
 */
export const TweenedCoin: React.FC<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    startFrame: number;
    endFrame: number;
    arcHeight?: number;
    label: string;
    r?: number;
    fill?: string;
    textColor?: string;
    fadeOutAt?: number;
}> = ({
    fromX,
    fromY,
    toX,
    toY,
    startFrame,
    endFrame,
    arcHeight = -160,
    label,
    r = 38,
    fill = colors.accent,
    textColor = colors.accentInk,
    fadeOutAt,
}) => {
        const frame = useCurrentFrame();
        const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
        });
        const x = fromX + (toX - fromX) * t;
        // parabolic arc: 4*t*(1-t) peaks at t=0.5 with value 1
        const y = fromY + (toY - fromY) * t + arcHeight * (4 * t * (1 - t));
        const rotate = interpolate(t, [0, 1], [0, 360]);

        const visibility =
            frame < startFrame ? 0 : fadeOutAt !== undefined && frame >= fadeOutAt ? 0 : 1;

        return (
            <CoinChip
                cx={x}
                cy={y}
                r={r}
                label={label}
                fill={fill}
                textColor={textColor}
                rotate={rotate}
                opacity={visibility}
            />
        );
    };

/**
 * `<Drop>` — a teardrop shape, bottom-centered at (cx, cy).
 */
export const Drop: React.FC<{
    cx: number;
    cy: number;
    size?: number;
    fill?: string;
    rotate?: number;
    scaleY?: number;
    opacity?: number;
}> = ({
    cx,
    cy,
    size = 14,
    fill = colors.accent,
    rotate = 0,
    scaleY = 1,
    opacity = 1,
}) => {
        // Teardrop path centered around origin (top point at -size, bottom at 0)
        const w = size * 0.7;
        const path = `
    M 0 ${-size}
    C ${w} ${-size * 0.5}, ${w} ${-size * 0.05}, 0 0
    C ${-w} ${-size * 0.05}, ${-w} ${-size * 0.5}, 0 ${-size}
    Z
  `;
        return (
            <g
                transform={`translate(${cx},${cy}) rotate(${rotate}) scale(1, ${scaleY})`}
                opacity={opacity}
            >
                <path d={path} fill={fill} />
            </g>
        );
    };

/**
 * `<DropFall>` — a single drop that falls from `(fromX, fromY)` to
 * `(toX, toY)` between `startFrame` and `endFrame`, then squishes on
 * impact and fades. Use inside a parent that provides absolute coords.
 */
export const DropFall: React.FC<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    startFrame: number;
    endFrame: number;
    size?: number;
    color?: string;
    arc?: number;
}> = ({
    fromX,
    fromY,
    toX,
    toY,
    startFrame,
    endFrame,
    size = 14,
    color = colors.accent,
    arc = 0,
}) => {
        const frame = useCurrentFrame();
        if (frame < startFrame) return null;
        const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.42, 0, 1, 1), // accelerate
        });
        const x = fromX + (toX - fromX) * t + arc * (4 * t * (1 - t));
        const y = fromY + (toY - fromY) * t;

        // squish on impact in last 4 frames
        const impactT = interpolate(frame, [endFrame - 4, endFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        const scaleY = 1 - 0.55 * impactT;
        const opacity =
            impactT < 1
                ? 1
                : interpolate(frame, [endFrame, endFrame + 6], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });

        return (
            <Drop
                cx={x}
                cy={y}
                size={size}
                fill={color}
                scaleY={scaleY}
                opacity={opacity}
            />
        );
    };

/**
 * `<DropStream>` — emits drops at a regular cadence between `from` and `to`.
 * Each drop is a `<DropFall>` deterministically scheduled by frame.
 */
export const DropStream: React.FC<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    startFrame: number;
    endFrame: number;
    every?: number; // frames between drops
    fallDuration?: number; // frames per drop
    size?: number;
    color?: string;
    jitter?: number; // px of horizontal jitter
    arc?: number;
}> = ({
    fromX,
    fromY,
    toX,
    toY,
    startFrame,
    endFrame,
    every = 10,
    fallDuration = 20,
    size = 14,
    color = colors.accent,
    jitter = 14,
    arc = 0,
}) => {
        const drops: React.ReactElement[] = [];
        for (let f = startFrame; f <= endFrame - fallDuration; f += every) {
            // deterministic pseudo-jitter from frame index
            const j = ((Math.sin(f * 12.9898) * 43758.5453) % 1) * jitter * 2 - jitter;
            drops.push(
                <DropFall
                    key={f}
                    fromX={fromX + j}
                    fromY={fromY}
                    toX={toX + j * 0.4}
                    toY={toY}
                    startFrame={f}
                    endFrame={f + fallDuration}
                    size={size}
                    color={color}
                    arc={arc}
                />
            );
        }
        return <>{drops}</>;
    };

/**
 * `<Bucket>` — SVG bucket with optional holes and an internal water level.
 * Coordinates are local to the SVG: top at `y`, width `w`, height `h`.
 *
 * `waterLevel` is 0–1 (proportion of internal height filled).
 * `drawProgress` is 0–1 controlling outline reveal (use `<DrawPath>` length).
 * `holes` is a list of (yProp 0–1 along the side, side: "left"|"right", radius).
 */
export const Bucket: React.FC<{
    x: number;
    y: number;
    w: number;
    h: number;
    drawProgress?: number;
    waterLevel?: number;
    waterColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    holes?: { yProp: number; side: "left" | "right"; r?: number; appearAt?: number }[];
}> = ({
    x,
    y,
    w,
    h,
    drawProgress = 1,
    waterLevel = 0,
    waterColor = colors.accent,
    strokeColor = colors.ink,
    strokeWidth = 4,
    holes = [],
}) => {
        const frame = useCurrentFrame();
        // Trapezoidal bucket: rim wider than base by ~14%
        const rimInset = 0;
        const baseInset = w * 0.07;
        const rimY = y;
        const baseY = y + h;
        const leftTop = { x: x + rimInset, y: rimY };
        const rightTop = { x: x + w - rimInset, y: rimY };
        const leftBottom = { x: x + baseInset, y: baseY };
        const rightBottom = { x: x + w - baseInset, y: baseY };

        // Path lengths (overestimate is fine for stroke-dasharray)
        const sideLen = Math.hypot(leftTop.x - leftBottom.x, h);
        const totalLen = w + sideLen + (w - 2 * baseInset) + sideLen;

        // Bucket outline path (rim → left side → base → right side → close)
        const outlinePath = `
    M ${leftTop.x} ${leftTop.y}
    L ${rightTop.x} ${rightTop.y}
    L ${rightBottom.x} ${rightBottom.y}
    L ${leftBottom.x} ${leftBottom.y}
    Z
  `;

        // Inner clip path (slightly inset from outline)
        const inset = strokeWidth / 2 + 1;
        const innerLeftTop = { x: leftTop.x + inset, y: leftTop.y + inset };
        const innerRightTop = { x: rightTop.x - inset, y: rightTop.y + inset };
        const innerLeftBottom = { x: leftBottom.x + inset, y: leftBottom.y - inset };
        const innerRightBottom = { x: rightBottom.x - inset, y: rightBottom.y - inset };
        const innerPath = `
    M ${innerLeftTop.x} ${innerLeftTop.y}
    L ${innerRightTop.x} ${innerRightTop.y}
    L ${innerRightBottom.x} ${innerRightBottom.y}
    L ${innerLeftBottom.x} ${innerLeftBottom.y}
    Z
  `;

        const waterTopY = baseY - h * waterLevel;
        const clipId = React.useId();

        // rim handle (a small loop on top)
        const handlePath = `
    M ${leftTop.x + w * 0.18} ${rimY}
    Q ${x + w * 0.5} ${rimY - h * 0.16}, ${rightTop.x - w * 0.18} ${rimY}
  `;
        const handleLen = w * 0.9;

        return (
            <g>
                {/* Outline (drawn-on) */}
                <path
                    d={outlinePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={totalLen}
                    strokeDashoffset={totalLen * (1 - drawProgress)}
                />
                {/* Handle (drawn after outline) */}
                <path
                    d={handlePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth - 1}
                    strokeLinecap="round"
                    strokeDasharray={handleLen}
                    strokeDashoffset={handleLen * Math.max(0, 1 - (drawProgress - 0.7) / 0.3)}
                />
                {/* Water (clipped to inner) */}
                <defs>
                    <clipPath id={clipId}>
                        <path d={innerPath} />
                    </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                    <rect
                        x={leftTop.x - 10}
                        y={waterTopY}
                        width={w + 20}
                        height={baseY - waterTopY + 10}
                        fill={waterColor}
                    />
                    {/* surface ripple — a thin lighter line */}
                    <rect
                        x={leftTop.x - 10}
                        y={waterTopY}
                        width={w + 20}
                        height={2}
                        fill={colors.ink}
                        opacity={0.18}
                    />
                </g>
                {/* Holes — two-tone ring punched into the wall */}
                {holes.map((hole, i) => {
                    const r = hole.r ?? 7;
                    const t = interpolate(
                        frame - (hole.appearAt ?? 0),
                        [0, 10],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    // Position along the side
                    const sideTopX = hole.side === "left" ? leftTop.x : rightTop.x;
                    const sideBotX = hole.side === "left" ? leftBottom.x : rightBottom.x;
                    const sideTopY = leftTop.y;
                    const sideBotY = leftBottom.y;
                    const cx = sideTopX + (sideBotX - sideTopX) * hole.yProp;
                    const cy = sideTopY + (sideBotY - sideTopY) * hole.yProp;
                    return (
                        <g key={i} transform={`translate(${cx},${cy}) scale(${t})`}>
                            <circle r={r + 1.5} fill={colors.paper} />
                            <circle r={r} fill="none" stroke={strokeColor} strokeWidth={2} />
                        </g>
                    );
                })}
            </g>
        );
    };

/**
 * `<GrowBar>` — a vertical bar that grows from `baselineY` upward to a
 * height proportional to `value/max`. `delay` and `duration` control when.
 */
export const GrowBar: React.FC<{
    x: number;
    baselineY: number;
    width: number;
    value: number;
    max: number;
    maxHeight: number;
    delay?: number;
    duration?: number;
    color?: string;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    axisLabel?: string;
}> = ({
    x,
    baselineY,
    width,
    value,
    max,
    maxHeight,
    delay = 0,
    duration = 18,
    color = colors.ink,
    label,
    labelColor = colors.ink,
    labelSize = 22,
    axisLabel,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();
        const target = (value / max) * maxHeight;
        const grow = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200 },
            durationInFrames: duration,
        });
        const h = target * grow;
        return (
            <g>
                <rect
                    x={x}
                    y={baselineY - h}
                    width={width}
                    height={h}
                    fill={color}
                    rx={2}
                />
                {label && (
                    <text
                        x={x + width / 2}
                        y={baselineY - h - 12}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={labelSize}
                        fontWeight={600}
                        fill={labelColor}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                        opacity={grow}
                    >
                        {label}
                    </text>
                )}
                {axisLabel && (
                    <text
                        x={x + width / 2}
                        y={baselineY + 32}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={20}
                        fill={colors.mute}
                        letterSpacing="0.06em"
                    >
                        {axisLabel}
                    </text>
                )}
            </g>
        );
    };

/**
 * `<Axis>` — horizontal axis line with optional ticks above the baseline.
 */
export const Axis: React.FC<{
    x: number;
    y: number;
    width: number;
    delay?: number;
    duration?: number;
    ticks?: number;
    tickHeight?: number;
    color?: string;
}> = ({
    x,
    y,
    width,
    delay = 0,
    duration = 18,
    ticks = 0,
    tickHeight = 6,
    color = colors.line,
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const tickEls = [];
        for (let i = 0; i <= ticks; i++) {
            const tx = x + (width / ticks) * i;
            const tProgress = interpolate(
                frame - delay - 6 - i * 1.5,
                [0, 8],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            tickEls.push(
                <line
                    key={i}
                    x1={tx}
                    y1={y}
                    x2={tx}
                    y2={y - tickHeight * tProgress}
                    stroke={color}
                    strokeWidth={1.5}
                />
            );
        }
        return (
            <g>
                <line
                    x1={x}
                    y1={y}
                    x2={x + width * progress}
                    y2={y}
                    stroke={color}
                    strokeWidth={1.5}
                />
                {tickEls}
            </g>
        );
    };

/**
 * `<DashedThreshold>` — horizontal dashed accent line with a label tag.
 * Used as the "$400 acquisition cost" bar in the payback chart.
 */
export const DashedThreshold: React.FC<{
    x: number;
    y: number;
    width: number;
    delay?: number;
    duration?: number;
    label?: string;
    color?: string;
    flashAt?: number;
}> = ({
    x,
    y,
    width,
    delay = 0,
    duration = 24,
    label,
    color = colors.accent,
    flashAt,
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const flashing =
            flashAt !== undefined && frame >= flashAt && frame < flashAt + 8
                ? 1
                : 0;
        return (
            <g>
                <line
                    x1={x}
                    y1={y}
                    x2={x + width * progress}
                    y2={y}
                    stroke={color}
                    strokeWidth={flashing ? 4 : 2}
                    strokeDasharray={flashing ? "0" : "8 6"}
                />
                {label && (
                    <g
                        opacity={interpolate(frame - delay - 12, [0, 10], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })}
                    >
                        <rect
                            x={x + width - 100}
                            y={y - 32}
                            width={100}
                            height={26}
                            fill={colors.paper}
                            stroke={color}
                            strokeWidth={1.5}
                            rx={3}
                        />
                        <text
                            x={x + width - 50}
                            y={y - 14}
                            textAnchor="middle"
                            fontFamily={fonts.mono}
                            fontSize={18}
                            fontWeight={600}
                            fill={color}
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {label}
                        </text>
                    </g>
                )}
            </g>
        );
    };

/**
 * `<Arrow>` — a small line+chevron arrow drawing on. Direction inferred
 * from from→to. Used for "−5%/month" or "+100/mo" labels.
 */
export const Arrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay?: number;
    duration?: number;
    color?: string;
    width?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    delay = 0,
    duration = 18,
    color = colors.ink,
    width = 2,
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const cx = x1 + (x2 - x1) * progress;
        const cy = y1 + (y2 - y1) * progress;
        // chevron at tip
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 14;
        const headAngle = Math.PI / 6;
        const hx1 = cx - headLen * Math.cos(angle - headAngle);
        const hy1 = cy - headLen * Math.sin(angle - headAngle);
        const hx2 = cx - headLen * Math.cos(angle + headAngle);
        const hy2 = cy - headLen * Math.sin(angle + headAngle);
        return (
            <g>
                <line
                    x1={x1}
                    y1={y1}
                    x2={cx}
                    y2={cy}
                    stroke={color}
                    strokeWidth={width}
                    strokeLinecap="round"
                />
                {progress > 0.85 && (
                    <>
                        <line
                            x1={cx}
                            y1={cy}
                            x2={hx1}
                            y2={hy1}
                            stroke={color}
                            strokeWidth={width}
                            strokeLinecap="round"
                        />
                        <line
                            x1={cx}
                            y1={cy}
                            x2={hx2}
                            y2={hy2}
                            stroke={color}
                            strokeWidth={width}
                            strokeLinecap="round"
                        />
                    </>
                )}
            </g>
        );
    };

/**
 * `<Pipeline>` — a horizontal pipe with stamped stage stops, used for
 * the Cash Conversion Cycle reel. Pipe draws on; each stop appears at
 * its configured `appearAt` frame. An optional shaded "trap zone" can
 * be drawn between two stop indices.
 */
export const Pipeline: React.FC<{
    x: number;
    y: number;
    width: number;
    stops: { label: string; t: number; appearAt?: number }[]; // t in [0,1]
    delay?: number;
    duration?: number;
    pipeColor?: string;
    pipeWidth?: number;
    stopColor?: string;
    labelColor?: string;
    trap?: { from: number; to: number; color: string; appearAt?: number; label?: string };
    showLabels?: boolean;
}> = ({
    x,
    y,
    width,
    stops,
    delay = 0,
    duration = 26,
    pipeColor = colors.ink,
    pipeWidth = 6,
    stopColor = colors.ink,
    labelColor = colors.mute,
    trap,
    showLabels = true,
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const x2 = x + width * progress;

        const trapProg = trap
            ? interpolate(frame - (trap.appearAt ?? 0), [0, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...ease.quart),
            })
            : 0;

        return (
            <g>
                {/* Trap zone (under pipe) */}
                {trap && trapProg > 0 && (
                    <g opacity={trapProg}>
                        <rect
                            x={x + width * trap.from}
                            y={y - 28}
                            width={width * (trap.to - trap.from)}
                            height={56}
                            fill={trap.color}
                            opacity={0.22}
                            rx={4}
                        />
                        {trap.label && (
                            <text
                                x={x + width * (trap.from + trap.to) / 2}
                                y={y - 38}
                                textAnchor="middle"
                                fontFamily={fonts.mono}
                                fontSize={22}
                                fontWeight={600}
                                fill={trap.color}
                                letterSpacing="0.04em"
                            >
                                {trap.label}
                            </text>
                        )}
                    </g>
                )}

                {/* Pipe stroke (drawn on) */}
                <line
                    x1={x}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke={pipeColor}
                    strokeWidth={pipeWidth}
                    strokeLinecap="round"
                />

                {/* Stops */}
                {stops.map((stop, i) => {
                    const cx = x + width * stop.t;
                    const visible = progress >= stop.t - 0.02;
                    const appearProgress = interpolate(
                        frame - (stop.appearAt ?? delay + duration * stop.t),
                        [0, 12],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    if (!visible && appearProgress <= 0) return null;
                    const r = 12 * Math.min(1, appearProgress);
                    return (
                        <g key={i}>
                            <circle cx={cx} cy={y} r={r} fill={stopColor} />
                            {showLabels && (
                                <text
                                    x={cx}
                                    y={y + 56}
                                    textAnchor="middle"
                                    fontFamily={fonts.mono}
                                    fontSize={22}
                                    fill={labelColor}
                                    letterSpacing="0.06em"
                                    opacity={appearProgress}
                                >
                                    {stop.label.toUpperCase()}
                                </text>
                            )}
                        </g>
                    );
                })}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<Station>` — a process step (factory station / service node).
   Renders an editorial box with a label and a "rate" badge below.
   - capacity sets the visual width of the box (units/min on the badge).
   - draw-on via stroke-dashoffset; fade-in on label and rate.
   - `pulse` triggers a red bottleneck pulse halo.
   ─────────────────────────────────────────────────────────────────── */
export const Station: React.FC<{
    x: number;
    y: number;
    width?: number;
    height?: number;
    label: string;
    rate: string;
    delay?: number;
    duration?: number;
    color?: string;
    rateColor?: string;
    pulse?: { at: number; color?: string };
    fillOpacity?: number;
}> = ({
    x,
    y,
    width = 180,
    height = 200,
    label,
    rate,
    delay = 0,
    duration = 22,
    color = colors.ink,
    rateColor = colors.mute,
    pulse,
    fillOpacity = 0,
}) => {
        const frame = useCurrentFrame();
        const t = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const perimeter = 2 * (width + height);
        const dash = perimeter;
        const dashOffset = perimeter * (1 - t);

        // Pulse halo: spring out from `pulse.at`
        const pulseT = pulse
            ? interpolate(frame - pulse.at, [0, 30, 60], [0, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            })
            : 0;
        const pulseScale = 1 + pulseT * 0.18;
        const pulseOpacity = pulseT * 0.55;
        const pulseColor = pulse?.color ?? colors.neg;

        return (
            <g>
                {/* Pulse halo */}
                {pulse && (
                    <rect
                        x={x + width / 2 - (width * pulseScale) / 2}
                        y={y + height / 2 - (height * pulseScale) / 2}
                        width={width * pulseScale}
                        height={height * pulseScale}
                        rx={6}
                        fill="none"
                        stroke={pulseColor}
                        strokeWidth={4}
                        opacity={pulseOpacity}
                    />
                )}
                {/* Box */}
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    fill={pulse ? pulseColor : color}
                    fillOpacity={fillOpacity * t}
                    stroke={pulse ? pulseColor : color}
                    strokeWidth={4}
                    strokeDasharray={dash}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="square"
                />
                {/* Label */}
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 4}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={32}
                    fill={pulse ? pulseColor : color}
                    letterSpacing="-0.01em"
                    opacity={t}
                >
                    {label}
                </text>
                {/* Rate badge below */}
                <text
                    x={x + width / 2}
                    y={y + height + 36}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={22}
                    fill={rateColor}
                    letterSpacing="0.06em"
                    opacity={t}
                >
                    {rate}
                </text>
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<QueueDots>` — a queue of work-in-process stacking up before
   a station. Dots appear from right to left with a stagger,
   like backlogged jobs. Use to show throughput buildup.
   ─────────────────────────────────────────────────────────────────── */
export const QueueDots: React.FC<{
    x: number; // rightmost dot center
    y: number;
    count: number;
    delay?: number;
    stagger?: number;
    spacing?: number;
    r?: number;
    color?: string;
}> = ({
    x,
    y,
    count,
    delay = 0,
    stagger = 4,
    spacing = 26,
    r = 9,
    color = colors.warn,
}) => {
        const frame = useCurrentFrame();
        return (
            <g>
                {Array.from({ length: count }).map((_, i) => {
                    const appear = delay + i * stagger;
                    const t = interpolate(frame - appear, [0, 12], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...ease.quart),
                    });
                    const cx = x - i * spacing;
                    return (
                        <circle
                            key={i}
                            cx={cx}
                            cy={y}
                            r={r * t}
                            fill={color}
                            opacity={t}
                        />
                    );
                })}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<FlowArrow>` — a horizontal arrow showing throughput between
   stations. Width is proportional to flow (capacity).
   Animates in from left, with optional flowing dashes for "moving".
   ─────────────────────────────────────────────────────────────────── */
export const FlowArrow: React.FC<{
    x: number;
    y: number;
    length: number;
    thickness?: number;
    delay?: number;
    duration?: number;
    color?: string;
    flowing?: boolean;
}> = ({
    x,
    y,
    length,
    thickness = 6,
    delay = 0,
    duration = 18,
    color = colors.ink,
    flowing = false,
}) => {
        const frame = useCurrentFrame();
        const t = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const drawn = length * t;
        const head = 16;
        const dashOffset = flowing ? -((frame - delay) * 1.2) : 0;
        return (
            <g>
                <line
                    x1={x}
                    y1={y}
                    x2={x + drawn}
                    y2={y}
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeDasharray={flowing ? "10 8" : undefined}
                    strokeDashoffset={dashOffset}
                    opacity={t}
                />
                {t > 0.95 && (
                    <polygon
                        points={`${x + length},${y} ${x + length - head},${y - head * 0.6} ${x + length - head
                            },${y + head * 0.6}`}
                        fill={color}
                        opacity={t}
                    />
                )}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<Pie>` — animated equity pie chart.
   Slices fan out from a center point. Each slice can:
     - appear at a specific frame (slice.appearAt)
     - "detach" (slide outward) at slice.detachAt
   Slice angles are computed from `value` (any positive number; ratios).
   The pie itself can scale (size) over time via `growFrom` / `growAt`.
   ─────────────────────────────────────────────────────────────────── */

export type PieSlice = {
    /** Numeric weight; share = value / sum(values). */
    value: number;
    label?: string;
    /** % shown inside slice (auto if omitted). */
    percentLabel?: boolean;
    color?: string;
    textColor?: string;
    /** Frame at which this slice fades/draws in (relative to component). */
    appearAt?: number;
    /** Frame at which slice slides outward off the pie. */
    detachAt?: number;
    /** How far (px) it slides when detached. */
    detachDistance?: number;
};

export const Pie: React.FC<{
    cx: number;
    cy: number;
    r: number;
    slices: PieSlice[];
    /** Rotation offset (degrees). 0 = first slice starts at top (-90°). */
    rotate?: number;
    /** Optional growth: animate radius from `growFrom` to `r` starting at `growAt`. */
    growFrom?: number;
    growAt?: number;
    growDuration?: number;
    /** Stroke between slices. */
    strokeColor?: string;
    strokeWidth?: number;
    /** Per-slice draw-on duration. */
    drawDuration?: number;
    /** Label font size. */
    labelSize?: number;
}> = ({
    cx,
    cy,
    r,
    slices,
    rotate = 0,
    growFrom,
    growAt = 0,
    growDuration = 22,
    strokeColor,
    strokeWidth = 4,
    drawDuration = 18,
    labelSize = 28,
}) => {
        const frame = useCurrentFrame();

        // Pie-level radius animation
        const radius =
            growFrom !== undefined
                ? interpolate(frame - growAt, [0, growDuration], [growFrom, r], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...ease.quart),
                })
                : r;

        const total = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0) || 1;

        // Compute slice arcs.
        let cursor = -90 + rotate; // start angle in degrees
        const arcs = slices.map((slice) => {
            const sweep = (slice.value / total) * 360;
            const startAngle = cursor;
            const endAngle = cursor + sweep;
            cursor = endAngle;

            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle * Math.PI) / 180;

            return { slice, startAngle, endAngle, sweep, midAngle, midRad };
        });

        const polar = (cxv: number, cyv: number, rv: number, angleDeg: number) => {
            const a = (angleDeg * Math.PI) / 180;
            return [cxv + rv * Math.cos(a), cyv + rv * Math.sin(a)] as const;
        };

        const arcPath = (
            cxv: number,
            cyv: number,
            rv: number,
            startAngle: number,
            endAngle: number
        ) => {
            if (endAngle - startAngle >= 359.9) {
                // Full circle — draw as two arcs.
                const [x1, y1] = polar(cxv, cyv, rv, 0);
                const [x2, y2] = polar(cxv, cyv, rv, 180);
                return `M ${cxv} ${cyv} L ${x1} ${y1} A ${rv} ${rv} 0 1 1 ${x2} ${y2} A ${rv} ${rv} 0 1 1 ${x1} ${y1} Z`;
            }
            const [x1, y1] = polar(cxv, cyv, rv, startAngle);
            const [x2, y2] = polar(cxv, cyv, rv, endAngle);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            return `M ${cxv} ${cyv} L ${x1} ${y1} A ${rv} ${rv} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        };

        return (
            <g>
                {arcs.map(({ slice, startAngle, endAngle, midRad }, i) => {
                    const appearAt = slice.appearAt ?? 0;
                    const t = interpolate(frame - appearAt, [0, drawDuration], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...ease.quart),
                    });

                    // Detach offset
                    const detachT =
                        slice.detachAt !== undefined
                            ? interpolate(frame - slice.detachAt, [0, 24], [0, 1], {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                                easing: Easing.bezier(...ease.quart),
                            })
                            : 0;
                    const detachDist = (slice.detachDistance ?? 80) * detachT;
                    const ox = Math.cos(midRad) * detachDist;
                    const oy = Math.sin(midRad) * detachDist;

                    // Animate the slice arc from 0 sweep up to its full sweep.
                    const sweepT = endAngle - startAngle;
                    const animEnd = startAngle + sweepT * t;
                    const path = arcPath(cx + ox, cy + oy, radius, startAngle, animEnd);

                    // Label position: midpoint, ~70% out.
                    const labelR = radius * 0.62;
                    const lx = cx + ox + Math.cos(midRad) * labelR;
                    const ly = cy + oy + Math.sin(midRad) * labelR;
                    const pct = Math.round((slice.value / total) * 100);
                    const fillColor = slice.color ?? colors.accent;
                    const labelColor = slice.textColor ?? colors.paper;

                    return (
                        <g key={i} opacity={t}>
                            <path
                                d={path}
                                fill={fillColor}
                                stroke={strokeColor ?? colors.paper}
                                strokeWidth={strokeWidth}
                                strokeLinejoin="round"
                            />
                            {(slice.percentLabel ?? true) && t > 0.6 && (
                                <text
                                    x={lx}
                                    y={ly + 6}
                                    textAnchor="middle"
                                    fontFamily={fonts.display}
                                    fontWeight={900}
                                    fontSize={labelSize}
                                    fill={labelColor}
                                    letterSpacing="-0.01em"
                                >
                                    {pct}%
                                </text>
                            )}
                            {slice.label && t > 0.6 && (
                                <text
                                    x={cx + ox + Math.cos(midRad) * (radius + 36)}
                                    y={cy + oy + Math.sin(midRad) * (radius + 36) + 6}
                                    textAnchor="middle"
                                    fontFamily={fonts.mono}
                                    fontSize={20}
                                    fill={fillColor}
                                    letterSpacing="0.08em"
                                    fontWeight={700}
                                >
                                    {slice.label.toUpperCase()}
                                </text>
                            )}
                        </g>
                    );
                })}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<DollarTag>` — a stamped price tag for valuations.
   Pops in with a spring; the number can swap in place.
   ─────────────────────────────────────────────────────────────────── */
export const DollarTag: React.FC<{
    x: number;
    y: number;
    value: string;
    delay?: number;
    fontSize?: number;
    color?: string;
    bgColor?: string;
    label?: string;
}> = ({
    x,
    y,
    value,
    delay = 0,
    fontSize = 100,
    color = colors.paper,
    bgColor = colors.ink,
    label,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();
        const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, mass: 0.7, stiffness: 140 },
        });
        const scale = s;
        const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

        // Estimate width (rough)
        const padX = 28;
        const padY = 18;
        const w = value.length * fontSize * 0.55 + padX * 2;
        const h = fontSize + padY * 2;

        return (
            <g
                transform={`translate(${x} ${y}) scale(${scale}) translate(${-w / 2} ${-h / 2
                    })`}
                opacity={opacity}
            >
                <rect
                    x={0}
                    y={0}
                    width={w}
                    height={h}
                    rx={6}
                    fill={bgColor}
                />
                <text
                    x={w / 2}
                    y={h / 2 + fontSize * 0.34}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={fontSize}
                    fill={color}
                    letterSpacing="-0.03em"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {value}
                </text>
                {label && (
                    <text
                        x={w / 2}
                        y={h + 32}
                        textAnchor="middle"
                        fontFamily={fonts.mono}
                        fontSize={22}
                        fill={bgColor}
                        letterSpacing="0.14em"
                        fontWeight={700}
                    >
                        {label}
                    </text>
                )}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<MoneyBill>` — a flying dollar bill rectangle. Travels along an arc.
   ─────────────────────────────────────────────────────────────────── */
export const MoneyBill: React.FC<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    startFrame: number;
    endFrame: number;
    arcHeight?: number;
    width?: number;
    height?: number;
    rotation?: number;
    label?: string;
}> = ({
    fromX,
    fromY,
    toX,
    toY,
    startFrame,
    endFrame,
    arcHeight = -180,
    width = 160,
    height = 80,
    rotation = -8,
    label = "$",
}) => {
        const frame = useCurrentFrame();
        const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const x = fromX + (toX - fromX) * t;
        const y = fromY + (toY - fromY) * t + arcHeight * 4 * t * (1 - t);
        const opacity = interpolate(frame - startFrame, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

        return (
            <g
                transform={`translate(${x} ${y}) rotate(${rotation})`}
                opacity={opacity}
            >
                <rect
                    x={-width / 2}
                    y={-height / 2}
                    width={width}
                    height={height}
                    rx={6}
                    fill={colors.pos}
                    stroke={colors.ink}
                    strokeWidth={3}
                />
                <text
                    x={0}
                    y={height * 0.18}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={48}
                    fill={colors.ink}
                >
                    {label}
                </text>
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<RoundBadge>` — a stage pill: small dot + round name. Springs in.
   Used at the top of each funding-round scene.
   ─────────────────────────────────────────────────────────────────── */
export const RoundBadge: React.FC<{
    x: number;
    y: number;
    label: string;
    color?: string;
    delay?: number;
    width?: number;
    height?: number;
}> = ({ x, y, label, color = colors.accent, delay = 0, width = 360, height = 84 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = spring({
        frame: frame - delay,
        fps,
        config: { damping: 14, stiffness: 160, mass: 0.6 },
    });
    return (
        <g
            transform={`translate(${x} ${y}) scale(${s})`}
            opacity={s}
        >
            <rect
                x={-width / 2}
                y={-height / 2}
                width={width}
                height={height}
                rx={height / 2}
                fill={colors.card}
                stroke={color}
                strokeWidth={3}
            />
            <circle cx={-width / 2 + 36} cy={0} r={12} fill={color} />
            <text
                x={-width / 2 + 64}
                y={10}
                textAnchor="start"
                fontFamily={fonts.mono}
                fontSize={28}
                fontWeight={700}
                fill={colors.ink}
                letterSpacing="0.14em"
            >
                {label.toUpperCase()}
            </text>
        </g>
    );
};

/* ───────────────────────────────────────────────────────────────────
   `<InvestorChip>` — small avatar (circle silhouette) + role label.
   ─────────────────────────────────────────────────────────────────── */
export const InvestorChip: React.FC<{
    x: number;
    y: number;
    label: string;
    color?: string;
    delay?: number;
    size?: number;
}> = ({ x, y, label, color = colors.ink, delay = 0, size = 80 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 150, mass: 0.6 },
    });
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`} opacity={s}>
            <circle cx={0} cy={0} r={size / 2} fill={color} opacity={0.9} />
            {/* head silhouette */}
            <circle cx={0} cy={-size * 0.12} r={size * 0.18} fill={colors.paper} />
            <path
                d={`M ${-size * 0.28} ${size * 0.28} a ${size * 0.28} ${size * 0.28} 0 0 1 ${size * 0.56} 0 Z`}
                fill={colors.paper}
            />
            <text
                x={0}
                y={size / 2 + 28}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={18}
                fontWeight={700}
                fill={colors.mute}
                letterSpacing="0.12em"
            >
                {label.toUpperCase()}
            </text>
        </g>
    );
};

/* ───────────────────────────────────────────────────────────────────
   `<ValuationStack>` — three labeled bars showing
     pre-money + cash = post-money. Bars draw L→R.
   Designed for SVG coordinate space.
   ─────────────────────────────────────────────────────────────────── */
export const ValuationStack: React.FC<{
    x: number;
    y: number;
    preValue: number; // millions
    cashValue: number;
    postValue: number;
    startFrame: number;
    /** Maximum width in px representing `maxValueShown`. */
    maxWidth?: number;
    maxValueShown?: number;
    rowHeight?: number;
    rowGap?: number;
    /** Format for value labels. */
    unit?: string;
}> = ({
    x,
    y,
    preValue,
    cashValue,
    postValue,
    startFrame,
    maxWidth = 760,
    maxValueShown,
    rowHeight = 56,
    rowGap = 28,
    unit = "M",
}) => {
        const frame = useCurrentFrame();
        const max = maxValueShown ?? Math.max(preValue, postValue);
        const wPre = (preValue / max) * maxWidth;
        const wCash = (cashValue / max) * maxWidth;
        const wPost = (postValue / max) * maxWidth;

        const drawT = (delay: number) =>
            interpolate(frame - (startFrame + delay), [0, 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...ease.quart),
            });
        const labelOpacity = (delay: number) =>
            interpolate(frame - (startFrame + delay), [10, 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });

        const Row: React.FC<{
            yOffset: number;
            delay: number;
            width: number;
            color: string;
            rowLabel: string;
            valueLabel: string;
        }> = ({ yOffset, delay, width, color, rowLabel, valueLabel }) => (
            <g transform={`translate(0 ${yOffset})`}>
                <text
                    x={-12}
                    y={rowHeight / 2 + 6}
                    textAnchor="end"
                    fontFamily={fonts.mono}
                    fontSize={20}
                    fontWeight={700}
                    fill={colors.mute}
                    letterSpacing="0.1em"
                    opacity={labelOpacity(delay)}
                >
                    {rowLabel.toUpperCase()}
                </text>
                <rect
                    x={0}
                    y={0}
                    width={width * drawT(delay)}
                    height={rowHeight}
                    fill={color}
                    rx={6}
                />
                <text
                    x={width + 14}
                    y={rowHeight / 2 + 8}
                    textAnchor="start"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={36}
                    fill={colors.ink}
                    letterSpacing="-0.02em"
                    opacity={labelOpacity(delay)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {valueLabel}
                </text>
            </g>
        );

        return (
            <g transform={`translate(${x} ${y})`}>
                <Row
                    yOffset={0}
                    delay={0}
                    width={wPre}
                    color={colors.mute2}
                    rowLabel="Pre-money"
                    valueLabel={`$${preValue}${unit}`}
                />
                <Row
                    yOffset={rowHeight + rowGap}
                    delay={14}
                    width={wCash}
                    color={colors.pos}
                    rowLabel="+ Cash"
                    valueLabel={`$${cashValue}${unit}`}
                />
                <Row
                    yOffset={(rowHeight + rowGap) * 2}
                    delay={30}
                    width={wPost}
                    color={colors.accent}
                    rowLabel="Post-money"
                    valueLabel={`$${postValue}${unit}`}
                />
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<CapTable>` — animated holders ledger. Reveals one row per cue.
   ─────────────────────────────────────────────────────────────────── */
export type CapRow = {
    holder: string;
    shares: string; // pre-formatted, e.g. "6,000,000"
    pct: string; // pre-formatted, e.g. "60%"
    color?: string;
    /** Frame at which row reveals. */
    appearAt: number;
    /** Frame at which the highlight stripe fades off. */
    highlightUntil?: number;
};

export const CapTable: React.FC<{
    x: number;
    y: number;
    width?: number;
    rowHeight?: number;
    title?: string;
    rows: CapRow[];
    /** When set, shows a totals row at the bottom (always 100%). */
    showTotals?: boolean;
}> = ({
    x,
    y,
    width = 880,
    rowHeight = 60,
    title = "Cap table",
    rows,
    showTotals = true,
}) => {
        const frame = useCurrentFrame();

        const titleH = Math.round(rowHeight * 0.9);
        const headerH = rowHeight;
        const headerY = 0;
        const firstRowY = headerH + 8;
        const totalRowsCount = rows.length + (showTotals ? 1 : 0);
        const contentBottom = firstRowY + totalRowsCount * rowHeight; // y of last row's bottom edge
        const bottomPad = 12;
        const frameTop = -titleH;
        const frameHeight = titleH + contentBottom + bottomPad;

        return (
            <g transform={`translate(${x} ${y})`}>
                {/* Frame */}
                <rect
                    x={0}
                    y={frameTop}
                    width={width}
                    height={frameHeight}
                    rx={10}
                    fill={colors.card}
                    stroke={colors.line}
                    strokeWidth={2}
                />
                {/* Title */}
                <text
                    x={20}
                    y={-titleH / 2 + 10}
                    fontFamily={fonts.mono}
                    fontSize={26}
                    fontWeight={700}
                    fill={colors.mute}
                    letterSpacing="0.14em"
                >
                    {title.toUpperCase()}
                </text>
                {/* Header */}
                <g transform={`translate(0 ${headerY})`}>
                    <text x={20} y={rowHeight / 2 + 10} fontFamily={fonts.mono} fontSize={22} fill={colors.mute2} letterSpacing="0.1em">HOLDER</text>
                    <text x={width * 0.55} y={rowHeight / 2 + 10} fontFamily={fonts.mono} fontSize={22} fill={colors.mute2} letterSpacing="0.1em" textAnchor="end">SHARES</text>
                    <text x={width - 20} y={rowHeight / 2 + 10} fontFamily={fonts.mono} fontSize={22} fill={colors.mute2} letterSpacing="0.1em" textAnchor="end">%</text>
                </g>
                <line x1={12} x2={width - 12} y1={rowHeight + 4} y2={rowHeight + 4} stroke={colors.line} strokeWidth={1} />
                {/* Rows */}
                {rows.map((r, i) => {
                    const t = interpolate(frame - r.appearAt, [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...ease.quart),
                    });
                    if (t <= 0) return null;
                    const highlight =
                        r.highlightUntil !== undefined && frame < r.highlightUntil
                            ? interpolate(frame, [r.highlightUntil - 30, r.highlightUntil], [1, 0], {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            })
                            : 0;
                    const yRow = firstRowY + i * rowHeight;
                    return (
                        <g key={i} transform={`translate(0 ${yRow})`} opacity={t}>
                            {highlight > 0 && (
                                <rect
                                    x={4}
                                    y={2}
                                    width={width - 8}
                                    height={rowHeight - 4}
                                    rx={6}
                                    fill={r.color ?? colors.accent}
                                    opacity={0.15 * highlight}
                                />
                            )}
                            <rect
                                x={4}
                                y={2}
                                width={6}
                                height={rowHeight - 4}
                                fill={r.color ?? colors.accent}
                                rx={3}
                            />
                            <text x={20} y={rowHeight / 2 + 12} fontFamily={fonts.display} fontSize={34} fontWeight={700} fill={colors.ink}>{r.holder}</text>
                            <text x={width * 0.55} y={rowHeight / 2 + 12} fontFamily={fonts.mono} fontSize={28} fill={colors.ink} textAnchor="end" style={{ fontVariantNumeric: "tabular-nums" }}>{r.shares}</text>
                            <text x={width - 20} y={rowHeight / 2 + 12} fontFamily={fonts.display} fontSize={34} fontWeight={900} fill={r.color ?? colors.accent} textAnchor="end" style={{ fontVariantNumeric: "tabular-nums" }}>{r.pct}</text>
                        </g>
                    );
                })}
                {/* Totals row */}
                {showTotals && (() => {
                    const lastAppearAt = rows.length ? rows[rows.length - 1].appearAt : 0;
                    const t = interpolate(frame - (lastAppearAt + 14), [0, 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const yRow = firstRowY + rows.length * rowHeight;
                    return (
                        <g transform={`translate(0 ${yRow})`} opacity={t}>
                            <line x1={12} x2={width - 12} y1={2} y2={2} stroke={colors.line} strokeWidth={1} />
                            <text x={20} y={rowHeight / 2 + 12} fontFamily={fonts.mono} fontSize={24} fontWeight={700} fill={colors.mute} letterSpacing="0.1em">TOTAL</text>
                            <text x={width - 20} y={rowHeight / 2 + 12} fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.mute} textAnchor="end">100%</text>
                        </g>
                    );
                })()}
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<PriceTicker>` — large share-price counter that "rolls" between values.
   When `to` changes (driven by parent prop), the number swap animates:
     scale-down → swap → scale-up.
   ─────────────────────────────────────────────────────────────────── */
export const PriceTicker: React.FC<{
    x: number;
    y: number;
    /** Numeric value (interpolated). */
    value: number;
    /** Frame where current value should be reached. Pair with `from`. */
    rollAt?: number;
    rollFrom?: number;
    rollDuration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    fontSize?: number;
    color?: string;
    caption?: string;
}> = ({
    x,
    y,
    value,
    rollAt,
    rollFrom,
    rollDuration = 22,
    prefix = "$",
    suffix = " / share",
    decimals = 2,
    fontSize = 84,
    color = colors.ink,
    caption = "Share price",
}) => {
        const frame = useCurrentFrame();
        const v =
            rollAt !== undefined && rollFrom !== undefined
                ? interpolate(frame - rollAt, [0, rollDuration], [rollFrom, value], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...ease.quart),
                })
                : value;
        const pulse =
            rollAt !== undefined
                ? 1 +
                0.08 *
                Math.max(
                    0,
                    Math.sin(
                        interpolate(frame - rollAt, [0, rollDuration], [0, Math.PI], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                    )
                )
                : 1;
        return (
            <g transform={`translate(${x} ${y}) scale(${pulse})`}>
                <text
                    x={0}
                    y={-fontSize * 0.85}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={24}
                    fontWeight={700}
                    fill={colors.mute}
                    letterSpacing="0.18em"
                >
                    {caption.toUpperCase()}
                </text>
                <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={fontSize}
                    fill={color}
                    letterSpacing="-0.03em"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {prefix}
                    {v.toFixed(decimals)}
                    <tspan fontSize={fontSize * 0.36} fill={colors.mute}>{suffix}</tspan>
                </text>
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<StakeBar>` — labeled bar with animated height + value caption.
   Designed for the dilution-vs-value split (scene 8).
   ─────────────────────────────────────────────────────────────────── */
export const StakeBar: React.FC<{
    x: number;
    /** Baseline y (bar grows upward from this). */
    baseY: number;
    /** Final bar height in px. */
    height: number;
    width?: number;
    startFrame: number;
    color?: string;
    caption: string;
    valueLabel: string;
}> = ({
    x,
    baseY,
    height,
    width = 110,
    startFrame,
    color = colors.accent,
    caption,
    valueLabel,
}) => {
        const frame = useCurrentFrame();
        const t = interpolate(frame - startFrame, [0, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
        });
        const h = height * t;
        return (
            <g>
                <rect
                    x={x - width / 2}
                    y={baseY - h}
                    width={width}
                    height={h}
                    rx={6}
                    fill={color}
                />
                <text
                    x={x}
                    y={baseY - h - 12}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={28}
                    fill={colors.ink}
                    opacity={t}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {valueLabel}
                </text>
                <text
                    x={x}
                    y={baseY + 28}
                    textAnchor="middle"
                    fontFamily={fonts.mono}
                    fontSize={18}
                    fontWeight={700}
                    fill={colors.mute}
                    letterSpacing="0.1em"
                >
                    {caption.toUpperCase()}
                </text>
            </g>
        );
    };





/* ───────────────────────────────────────────────────────────────────
   `<DilutionPie>` — pie whose slice values animate from
   `valueFrom` → `valueTo` over a window. Used to *show* the moment
   investors join: existing slices contract while a new slice grows
   into the freed wedge. Math always sums to 100, so the pie remains
   a complete circle throughout.
   ─────────────────────────────────────────────────────────────────── */

export type DilutionSlice = {
    id: string;
    valueFrom: number;
    valueTo: number;
    color: string;
    label?: string;
    textColor?: string;
};

const arcPath = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
) => {
    const sx = cx + r * Math.cos(startAngle);
    const sy = cy + r * Math.sin(startAngle);
    const ex = cx + r * Math.cos(endAngle);
    const ey = cy + r * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    // Full circle edge-case: render as two half arcs.
    if (Math.abs(endAngle - startAngle) >= Math.PI * 2 - 0.001) {
        return `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} Z`;
    }
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
};

export const DilutionPie: React.FC<{
    cx: number;
    cy: number;
    r: number;
    slices: DilutionSlice[];
    /** Frame at which the dilution tween begins. */
    startFrame: number;
    /** Frames to hold valueFrom before the tween starts. */
    holdFrames?: number;
    /** Duration of the value tween. */
    tweenFrames?: number;
    /** Hide labels for slices below this %. */
    labelMinPct?: number;
    labelSize?: number;
}> = ({
    cx,
    cy,
    r,
    slices,
    startFrame,
    holdFrames = 0,
    tweenFrames = 32,
    labelMinPct = 5,
    labelSize = 22,
}) => {
        const frame = useCurrentFrame();
        const tweenStart = startFrame + holdFrames;
        const t = interpolate(
            frame - tweenStart,
            [0, tweenFrames],
            [0, 1],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.77, 0, 0.175, 1),
            }
        );

        // Compute current value per slice.
        const currentValues = slices.map((s) => s.valueFrom + (s.valueTo - s.valueFrom) * t);
        const total = currentValues.reduce((a, b) => a + b, 0) || 1;

        // Walk clockwise from 12 o'clock.
        let cursor = -Math.PI / 2;

        return (
            <g>
                {slices.map((slice, i) => {
                    const value = currentValues[i];
                    if (value <= 0.01) {
                        // Skip drawing zero slices but still advance cursor (no-op since 0).
                        return null;
                    }
                    const angle = (value / total) * Math.PI * 2;
                    const start = cursor;
                    const end = cursor + angle;
                    cursor = end;
                    const mid = (start + end) / 2;
                    const labelR = r * 0.62;
                    const lx = cx + labelR * Math.cos(mid);
                    const ly = cy + labelR * Math.sin(mid);
                    const pct = (value / total) * 100;
                    const isNew = slice.valueFrom <= 0.01 && slice.valueTo > 0;
                    // New-slice pulse: subtle stroke that fades out.
                    const newStrokeT = isNew
                        ? interpolate(frame - tweenStart, [0, tweenFrames, tweenFrames + 30], [0, 1, 0], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        })
                        : 0;
                    return (
                        <g key={slice.id}>
                            <path
                                d={arcPath(cx, cy, r, start, end)}
                                fill={slice.color}
                            />
                            {isNew && newStrokeT > 0 && (
                                <path
                                    d={arcPath(cx, cy, r, start, end)}
                                    fill="none"
                                    stroke={colors.paper}
                                    strokeWidth={6}
                                    opacity={newStrokeT * 0.9}
                                />
                            )}
                            {pct >= labelMinPct && slice.label && (
                                <g transform={`translate(${lx} ${ly})`}>
                                    <text
                                        textAnchor="middle"
                                        fontFamily={fonts.mono}
                                        fontWeight={700}
                                        fontSize={labelSize}
                                        fill={slice.textColor ?? colors.paper}
                                        letterSpacing="0.04em"
                                        style={{ fontVariantNumeric: "tabular-nums" }}
                                    >
                                        {slice.label}
                                    </text>
                                    <text
                                        y={labelSize + 6}
                                        textAnchor="middle"
                                        fontFamily={fonts.display}
                                        fontWeight={900}
                                        fontSize={labelSize * 1.4}
                                        fill={slice.textColor ?? colors.paper}
                                        letterSpacing="-0.03em"
                                        style={{ fontVariantNumeric: "tabular-nums" }}
                                    >
                                        {pct.toFixed(0)}%
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}
                {/* Center dot + paper-colored hub for editorial polish */}
                <circle cx={cx} cy={cy} r={r * 0.18} fill={colors.paper} />
                <circle cx={cx} cy={cy} r={4} fill={colors.accent} />
            </g>
        );
    };

/* ───────────────────────────────────────────────────────────────────
   `<InvestmentCheque>` — animated cheque-style card that flies in
   from offscreen-right with a spring, lands at (x, y), then pulses
   a soft glow. Designed to make funding-round investments feel
   tangible: a real cheque arriving from a real investor.
   ─────────────────────────────────────────────────────────────────── */

export const InvestmentCheque: React.FC<{
    /** Final centre x (after landing). */
    x: number;
    /** Final centre y. */
    y: number;
    width?: number;
    height?: number;
    /** Big number on the cheque, e.g. "$1M". */
    amount: string;
    /** Eyebrow label. */
    label?: string;
    /** Optional payee tag, e.g. "From: Three Angels". */
    payee?: string;
    startFrame: number;
    color?: string;
}> = ({
    x,
    y,
    width = 720,
    height = 220,
    amount,
    label = "INVESTMENT IN",
    payee,
    startFrame,
    color = colors.accent,
}) => {
        const frame = useCurrentFrame();

        // Spring-in from offscreen right.
        const enter = spring({
            frame: frame - startFrame,
            fps: 30,
            config: { damping: 14, stiffness: 110, mass: 0.9 },
        });
        const offset = (1 - enter) * 1400; // travels from +1400px → 0

        // Tilt: small rotation on entry that settles to 0.
        const tilt = interpolate(enter, [0, 0.6, 1], [-12, 4, 0]);

        // Glow pulse after landing.
        const glow = interpolate(
            frame - startFrame,
            [22, 32, 60, 80],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
            <g transform={`translate(${x + offset} ${y}) rotate(${tilt})`} opacity={enter}>
                {/* Glow halo */}
                {glow > 0 && (
                    <rect
                        x={-(width / 2) - 14}
                        y={-(height / 2) - 14}
                        width={width + 28}
                        height={height + 28}
                        rx={18}
                        fill={color}
                        opacity={0.18 * glow}
                    />
                )}
                {/* Card body */}
                <rect
                    x={-(width / 2)}
                    y={-(height / 2)}
                    width={width}
                    height={height}
                    rx={14}
                    fill={colors.card}
                    stroke={color}
                    strokeWidth={4}
                />
                {/* Cheque dotted top stripe */}
                <line
                    x1={-(width / 2) + 24}
                    y1={-(height / 2) + 44}
                    x2={width / 2 - 24}
                    y2={-(height / 2) + 44}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="6 8"
                    opacity={0.5}
                />
                {/* Eyebrow */}
                <text
                    x={-(width / 2) + 28}
                    y={-(height / 2) + 36}
                    fontFamily={fonts.mono}
                    fontWeight={700}
                    fontSize={26}
                    fill={color}
                    letterSpacing="0.22em"
                >
                    {label}
                </text>
                {/* Amount */}
                <text
                    x={0}
                    y={32}
                    textAnchor="middle"
                    fontFamily={fonts.display}
                    fontWeight={900}
                    fontSize={128}
                    fill={color}
                    letterSpacing="-0.04em"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {amount}
                </text>
                {/* Payee */}
                {payee && (
                    <text
                        x={width / 2 - 28}
                        y={height / 2 - 24}
                        textAnchor="end"
                        fontFamily={fonts.mono}
                        fontWeight={700}
                        fontSize={22}
                        fill={colors.mute}
                        letterSpacing="0.14em"
                    >
                        {payee.toUpperCase()}
                    </text>
                )}
            </g>
        );
    };
