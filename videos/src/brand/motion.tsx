import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, ease, space } from "./tokens";
import { fonts } from "./fonts";

/* ───────────────────────────────────────────────────────────────────
   Made Plain — Brand Motion Primitives
   These are the standardized animations shared across every reel.
   See design-system/motion.md for the editorial intent behind each.
   ─────────────────────────────────────────────────────────────────── */

/**
 * `<PaperBackground>` — the reel's "page". Warm near-black with a faint
 * paper grain noise overlay. Always mount once at the root of a comp.
 */
export const PaperBackground: React.FC<{ tone?: "paper" | "sand" | "card" }> = ({
  tone = "paper",
}) => {
  const bg =
    tone === "paper" ? colors.paper : tone === "sand" ? colors.sand : colors.card;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <AbsoluteFill
        style={{
          opacity: 0.06,
          mixBlendMode: "screen",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "400px 400px",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * `<Hairline>` — 1px line that strokes in from `from` ("left"|"center"|"right").
 * The brand's structural element. Used between sections, under eyebrows,
 * and as the spine of any "before/after" comparison.
 */
export const Hairline: React.FC<{
  delay?: number;
  duration?: number;
  width?: number | string;
  thickness?: number;
  color?: string;
  from?: "left" | "center" | "right";
}> = ({
  delay = 0,
  duration = 24,
  width = "100%",
  thickness = 1,
  color = colors.ink,
  from = "left",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  const transformOrigin =
    from === "left" ? "left center" : from === "right" ? "right center" : "center center";
  return (
    <div
      style={{
        width,
        height: thickness,
        backgroundColor: color,
        transform: `scaleX(${progress})`,
        transformOrigin,
      }}
    />
  );
};

/**
 * `<DotMark>` — the brand's signature terracotta period.
 * Drops in with a tiny over-shoot, then breathes (subtle pulse).
 * Used as: section punctuation, end-of-line emphasis, the "made-plain" mark.
 */
export const DotMark: React.FC<{
  size?: number;
  delay?: number;
  pulse?: boolean;
  color?: string;
}> = ({ size = 32, delay = 0, pulse = true, color = colors.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8 }, // bouncy entrance
    durationInFrames: 24,
  });

  const breathe = pulse
    ? 1 + Math.sin(((frame - delay) / fps) * Math.PI * 0.8) * 0.06
    : 1;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        transform: `scale(${enter * breathe})`,
        opacity: interpolate(frame - delay, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

/**
 * `<Eyebrow>` — section label. Section symbol § strokes in, then the label
 * types in plainly — never animated character-by-character with opacity.
 * The hairline beneath strokes in last.
 */
export const Eyebrow: React.FC<{
  children: string;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = colors.accent }) => {
  const frame = useCurrentFrame();
  const visible = Math.max(0, frame - delay);

  // Reveal section symbol first, then characters
  const symProgress = interpolate(visible, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  const charsToShow = Math.max(
    0,
    Math.min(children.length, Math.floor((visible - 6) * 1.6))
  );

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: space.s3,
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
      }}
    >
      <span
        style={{
          display: "inline-block",
          opacity: symProgress,
          transform: `translateX(${(1 - symProgress) * -12}px)`,
        }}
      >
        §
      </span>
      <span style={{ color: colors.ink }}>
        {children.slice(0, charsToShow)}
        <span
          style={{
            display: "inline-block",
            width: charsToShow < children.length ? 2 : 0,
            height: "0.9em",
            verticalAlign: "-0.05em",
            backgroundColor: colors.ink,
            marginLeft: 2,
            opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
          }}
        />
      </span>
    </div>
  );
};

/**
 * `<InkWipeLine>` — the headline reveal. Each word of a line slides up
 * from a horizontal mask and settles. Used for hero/display lines.
 *
 * Words animate in stagger so the eye scans left→right naturally.
 */
export const InkWipeLine: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  weight?: number;
  color?: string;
  italic?: boolean;
  family?: string;
  align?: "left" | "center" | "right";
  letterSpacing?: number | string;
  stagger?: number;
}> = ({
  text,
  delay = 0,
  size = 96,
  weight = 700,
  color = colors.ink,
  italic = false,
  family = fonts.display,
  align = "left",
  letterSpacing = "-0.02em",
  stagger = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.28em",
        justifyContent:
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        fontFamily: family,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing,
        color,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 200 },
          durationInFrames: 22,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.05em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - progress) * size * 0.95}px)`,
                opacity: progress,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/**
 * `<MarkerHighlight>` — accent marker pen sweeps under or behind the word.
 * Inline span. Pass `behind` to draw a block fill instead of an underline.
 */
export const MarkerHighlight: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  color?: string;
  behind?: boolean;
}> = ({ children, delay = 0, duration = 16, color = colors.accent, behind = false }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: behind ? "0 0.12em" : 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: behind ? 0 : "0.04em",
          top: behind ? 0 : "auto",
          height: behind ? "100%" : "0.18em",
          backgroundColor: color,
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          color: behind && progress > 0.5 ? colors.accentInk : "inherit",
        }}
      >
        {children}
      </span>
    </span>
  );
};

/**
 * `<TabularTicker>` — counts a number from `from` → `to` using JetBrains Mono
 * with tabular figures, so the digits never jiggle. The brand uses real
 * numbers; this is how they appear.
 */
export const TabularTicker: React.FC<{
  from?: number;
  to: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
  weight?: number;
  decimals?: number;
}> = ({
  from = 0,
  to,
  delay = 0,
  duration = 30,
  prefix = "",
  suffix = "",
  size = 120,
  color = colors.ink,
  weight = 600,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  const value = from + (to - from) * progress;
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      style={{
        fontFamily: fonts.mono,
        fontWeight: weight,
        fontSize: size,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

/**
 * `<EditorialDivider>` — centered DotMark with hairlines either side.
 * Only used between major scenes inside a single composition.
 */
export const EditorialDivider: React.FC<{ delay?: number; color?: string }> = ({
  delay = 0,
  color = colors.ink,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: space.s5,
        width: "100%",
      }}
    >
      <div style={{ flex: 1 }}>
        <Hairline delay={delay} from="right" color={color} />
      </div>
      <DotMark size={14} delay={delay + 8} pulse={false} />
      <div style={{ flex: 1 }}>
        <Hairline delay={delay} from="left" color={color} />
      </div>
    </div>
  );
};

/**
 * `<ScenePad>` — standardized reel padding. Matches the editorial gutter
 * the website uses. Reels live in 9:16, so we keep generous side breath.
 */
export const ScenePad: React.FC<{
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}> = ({ children, align = "center" }) => {
  const justify =
    align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  return (
    <AbsoluteFill
      style={{
        padding: `${space.s10}px ${space.s8}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: "flex-start",
        gap: space.s7,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Lightweight scene fade. Reels never slide; pages cross-fade like the site.
 */
export const useSceneFade = (
  inFrames = 8,
  outFrames = 8,
  totalFrames?: number
) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, inFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (totalFrames === undefined || outFrames <= 0) return fadeIn;
  const fadeOut = interpolate(
    frame,
    [totalFrames - outFrames, totalFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return Math.min(fadeIn, fadeOut);
};
