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
      transform={`translate(${x},${y}) scale(${(size / 100) * pulseScale}) translate(${
        -50 * (pulseScale - 1) * 0
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
          points={`${x + length},${y} ${x + length - head},${y - head * 0.6} ${
            x + length - head
          },${y + head * 0.6}`}
          fill={color}
          opacity={t}
        />
      )}
    </g>
  );
};


