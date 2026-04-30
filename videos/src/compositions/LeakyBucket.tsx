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
import { Bucket, DropStream, DropFall } from "../brand/svg";
import { colors, space, ease } from "../brand/tokens";
import { fonts } from "../brand/fonts";

/* ───────────────────────────────────────────────────────────────────
   Leaky Bucket — Retention vs Acquisition (≈18s, 540f, 1080x1920)
   See videos/PLAN.md for the full scenario.
   ─────────────────────────────────────────────────────────────────── */

export const LEAKY_BUCKET_DURATION = 540;

/* ─── Scene 1 — Title (0–75, 75f) ─────────────────────────────────── */
const TitleScene: React.FC = () => {
  const opacity = useSceneFade(8, 12, 75);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad>
        <Eyebrow delay={4}>RETENTION</Eyebrow>
        <Hairline delay={22} color={colors.line} />
        <div style={{ marginTop: space.s5 }}>
          <InkWipeLine text="Acquisition fills" delay={28} size={108} stagger={3} />
          <div style={{ marginTop: space.s3 }}>
            <InkWipeLine text="the bucket." delay={42} size={108} stagger={3} />
          </div>
          <div style={{ marginTop: space.s5 }}>
            <InkWipeLine
              text="Retention plugs"
              delay={58}
              size={108}
              color={colors.accent}
              stagger={3}
            />
          </div>
          <div style={{ marginTop: space.s3 }}>
            <InkWipeLine
              text="the holes."
              delay={70}
              size={108}
              color={colors.accent}
              stagger={3}
            />
          </div>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

/* ─── Scene 2 — Single bucket fills (75–180, 105f) ────────────────── */
const FillScene: React.FC = () => {
  const opacity = useSceneFade(8, 14, 105);
  const frame = useCurrentFrame();

  // Bucket geometry (centered)
  const bx = 340;
  const by = 720;
  const bw = 400;
  const bh = 540;

  const drawProgress = interpolate(frame - 6, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });

  // Water rises from frame 30 to 90, capping near 0.85
  const waterLevel = interpolate(frame, [30, 95], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={4}>HEALTHY</Eyebrow>
        <Hairline delay={22} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <Bucket
          x={bx}
          y={by}
          w={bw}
          h={bh}
          drawProgress={drawProgress}
          waterLevel={waterLevel}
          waterColor={colors.accent}
          strokeColor={colors.ink}
        />
        {/* Drops fall into bucket from above */}
        <DropStream
          fromX={bx + bw / 2}
          fromY={by - 220}
          toX={bx + bw / 2}
          toY={by + 30}
          startFrame={30}
          endFrame={105}
          every={6}
          fallDuration={16}
          size={16}
          color={colors.accent}
          jitter={60}
        />
      </svg>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1380,
          textAlign: "center",
          opacity: interpolate(frame - 50, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.bodyItalic,
            fontStyle: "italic",
            fontSize: 44,
            color: colors.mute,
            lineHeight: 1.3,
          }}
        >
          You acquire{" "}
          <span style={{ fontFamily: fonts.mono, color: colors.ink, fontStyle: "normal" }}>
            100
          </span>{" "}
          customers a month.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3 — Holes appear (180–285, 105f) ──────────────────────── */
const LeakScene: React.FC = () => {
  const opacity = useSceneFade(8, 14, 105);
  const frame = useCurrentFrame();

  const bx = 340;
  const by = 720;
  const bw = 400;
  const bh = 540;

  // Bucket starts already drawn and full from previous scene
  // Water level decays as holes appear
  const baseLevel = 0.85;
  // Three holes appear at 10, 30, 50
  const holeTimes = [10, 30, 50];
  // Each hole drains 8% from its appearance over 30 frames
  let drained = 0;
  holeTimes.forEach((t) => {
    drained += 0.08 * interpolate(frame - t, [0, 30], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });
  const waterLevel = Math.max(0.4, baseLevel - drained);

  const holes = [
    { yProp: 0.5, side: "right" as const, r: 11, appearAt: 10 },
    { yProp: 0.7, side: "left" as const, r: 11, appearAt: 30 },
    { yProp: 0.85, side: "right" as const, r: 11, appearAt: 50 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={4} color={colors.warn}>BUT…</Eyebrow>
        <Hairline delay={22} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <Bucket
          x={bx}
          y={by}
          w={bw}
          h={bh}
          drawProgress={1}
          waterLevel={waterLevel}
          waterColor={colors.accent}
          strokeColor={colors.ink}
          holes={holes}
        />
        {/* Drops still fall in from above */}
        <DropStream
          fromX={bx + bw / 2}
          fromY={by - 220}
          toX={bx + bw / 2}
          toY={by + 30}
          startFrame={0}
          endFrame={105}
          every={8}
          fallDuration={16}
          size={16}
          color={colors.accent}
          jitter={60}
        />
        {/* Leak streams from each hole */}
        {holes.map((hole, i) => {
          const sideX = hole.side === "right" ? bx + bw - bw * 0.07 * hole.yProp : bx + bw * 0.07 * hole.yProp;
          const cy = by + bh * hole.yProp;
          const dirX = hole.side === "right" ? 1 : -1;
          return (
            <DropStream
              key={i}
              fromX={sideX + dirX * 14}
              fromY={cy}
              toX={sideX + dirX * 220}
              toY={by + bh + 80}
              startFrame={(hole.appearAt ?? 0) + 6}
              endFrame={105}
              every={9}
              fallDuration={26}
              size={11}
              color={colors.accent}
              jitter={4}
              arc={dirX * 60}
            />
          );
        })}
      </svg>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1380,
          textAlign: "center",
          opacity: interpolate(frame - 18, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.bodyItalic,
            fontStyle: "italic",
            fontSize: 44,
            color: colors.mute,
            lineHeight: 1.3,
          }}
        >
          You lose{" "}
          <MarkerHighlight delay={36} duration={18} behind>
            5%
          </MarkerHighlight>{" "}
          a month.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4 — Two-bucket comparison (285–435, 150f) ─────────────── */
const CompareScene: React.FC = () => {
  const opacity = useSceneFade(10, 14, 150);
  const frame = useCurrentFrame();

  // Two side-by-side smaller buckets
  const lx = 90;
  const rx = 590;
  const by = 620;
  const bw = 400;
  const bh = 520;

  // Acquisition rate: 100/month => normalized fill rate per frame
  // Steady-state level: A / (A + churn*pool); we'll just simulate with a
  // simple recurrence approximation: level' = level + acqRate − churn*level.
  // Simulate over 12 months across ~120 frames after the appearance of buckets.
  const simStart = 18;
  const simEnd = 138;
  const simT = interpolate(frame, [simStart, simEnd], [0, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Customer count under 5% vs 1% churn, with 100/mo acquisition.
  // Closed-form steady-state for monthly model: N_t = A * (1-(1-c)^t) / c.
  const churnA = 0.05;
  const churnB = 0.01;
  const A = 100;
  const nA = (A * (1 - Math.pow(1 - churnA, simT))) / churnA;
  const nB = (A * (1 - Math.pow(1 - churnB, simT))) / churnB;

  // Fill levels: scale to a shared cap so we see real divergence.
  // At t=36mo: nA≈1685, nB≈3022 → ~1.8× visible, asymptote is 5×.
  const cap = 3500;
  const levelA = Math.min(0.92, nA / cap);
  const levelB = Math.min(0.92, nB / cap);

  const holesA = [
    { yProp: 0.6, side: "right" as const, r: 9, appearAt: 0 },
    { yProp: 0.75, side: "left" as const, r: 9, appearAt: 0 },
    { yProp: 0.85, side: "right" as const, r: 9, appearAt: 0 },
  ];
  const holesB = [
    { yProp: 0.85, side: "right" as const, r: 5, appearAt: 0 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={4}>SAME ACQUISITION</Eyebrow>
        <Hairline delay={22} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Left bucket — 5% churn */}
        <Bucket
          x={lx}
          y={by}
          w={bw}
          h={bh}
          drawProgress={interpolate(frame - 6, [0, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
          })}
          waterLevel={levelA}
          waterColor={colors.neg}
          strokeColor={colors.ink}
          holes={holesA}
        />
        {/* Right bucket — 1% churn */}
        <Bucket
          x={rx}
          y={by}
          w={bw}
          h={bh}
          drawProgress={interpolate(frame - 14, [0, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease.quart),
          })}
          waterLevel={levelB}
          waterColor={colors.pos}
          strokeColor={colors.ink}
          holes={holesB}
        />

        {/* Drops feed both equally */}
        <DropStream
          fromX={lx + bw / 2}
          fromY={by - 200}
          toX={lx + bw / 2}
          toY={by + 30}
          startFrame={20}
          endFrame={150}
          every={9}
          fallDuration={16}
          size={14}
          color={colors.ink}
          jitter={50}
        />
        <DropStream
          fromX={rx + bw / 2}
          fromY={by - 200}
          toX={rx + bw / 2}
          toY={by + 30}
          startFrame={20}
          endFrame={150}
          every={9}
          fallDuration={16}
          size={14}
          color={colors.ink}
          jitter={50}
        />

        {/* Leak streams on left bucket */}
        {holesA.map((h, i) => {
          const sideX = h.side === "right" ? lx + bw - bw * 0.07 * h.yProp : lx + bw * 0.07 * h.yProp;
          const cy = by + bh * h.yProp;
          const dirX = h.side === "right" ? 1 : -1;
          return (
            <DropStream
              key={`la-${i}`}
              fromX={sideX + dirX * 12}
              fromY={cy}
              toX={sideX + dirX * 140}
              toY={by + bh + 60}
              startFrame={24}
              endFrame={150}
              every={10}
              fallDuration={22}
              size={9}
              color={colors.neg}
              jitter={3}
              arc={dirX * 50}
            />
          );
        })}
        {/* Subtle drip from right bucket */}
        <DropStream
          fromX={rx + bw - bw * 0.07 * 0.85 + 12}
          fromY={by + bh * 0.85}
          toX={rx + bw - bw * 0.07 * 0.85 + 90}
          toY={by + bh + 60}
          startFrame={28}
          endFrame={150}
          every={28}
          fallDuration={26}
          size={7}
          color={colors.pos}
          jitter={2}
          arc={36}
        />

        {/* Labels under each bucket */}
        <text
          x={lx + bw / 2}
          y={by + bh + 80}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.neg}
          fontWeight={600}
          letterSpacing="0.04em"
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          5% CHURN
        </text>
        <text
          x={rx + bw / 2}
          y={by + bh + 80}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.pos}
          fontWeight={600}
          letterSpacing="0.04em"
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          1% CHURN
        </text>

        {/* Customer count tickers */}
        <text
          x={lx + bw / 2}
          y={by + bh + 130}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={48}
          fill={colors.ink}
          fontWeight={600}
          style={{ fontVariantNumeric: "tabular-nums" }}
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {Math.round(nA).toLocaleString()}
        </text>
        <text
          x={rx + bw / 2}
          y={by + bh + 130}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={48}
          fill={colors.ink}
          fontWeight={600}
          style={{ fontVariantNumeric: "tabular-nums" }}
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {Math.round(nB).toLocaleString()}
        </text>
        <text
          x={lx + bw / 2}
          y={by + bh + 162}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={20}
          fill={colors.mute}
          letterSpacing="0.08em"
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          CUSTOMERS
        </text>
        <text
          x={rx + bw / 2}
          y={by + bh + 162}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={20}
          fill={colors.mute}
          letterSpacing="0.08em"
          opacity={interpolate(frame - 26, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          CUSTOMERS
        </text>

        {/* Month indicator */}
        <text
          x={540}
          y={520}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={28}
          fill={colors.mute2}
          letterSpacing="0.12em"
          opacity={interpolate(frame - 18, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          MONTH {Math.min(36, Math.max(1, Math.ceil(simT)))}
        </text>
      </svg>

      {/* Punchline */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1500,
          textAlign: "center",
          opacity: interpolate(frame - 110, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 76,
            color: colors.ink,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          Same input.
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 76,
            color: colors.accent,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          2× the business.
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: fonts.bodyItalic,
            fontStyle: "italic",
            fontSize: 30,
            color: colors.mute,
            letterSpacing: "-0.01em",
          }}
        >
          (5× at steady state.)
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5 — Screenshot line (435–510, 75f) ────────────────────── */
const QuoteScene: React.FC = () => {
  const opacity = useSceneFade(8, 12, 75);
  const frame = useCurrentFrame();

  // A subtle bucket silhouette in background, very faint
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.06 }}
      >
        <Bucket
          x={340}
          y={520}
          w={400}
          h={540}
          drawProgress={interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          waterLevel={0}
          strokeColor={colors.ink}
        />
      </svg>

      {/* Single drop falling slowly behind text */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <DropFall
          fromX={540}
          fromY={300}
          toX={540}
          toY={1700}
          startFrame={6}
          endFrame={66}
          size={22}
          color={colors.accent}
        />
      </svg>

      <ScenePad align="start">
        <Eyebrow delay={4}>THE LESSON</Eyebrow>
        <Hairline delay={22} color={colors.line} />
        <div style={{ marginTop: space.s7 }}>
          <div
            style={{
              fontFamily: fonts.bodyItalic,
              fontStyle: "italic",
              fontSize: 64,
              lineHeight: 1.18,
              color: colors.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Acquisition is what you do
            <br />
            <span style={{ color: colors.mute }}>to survive.</span>
          </div>
          <div
            style={{
              marginTop: space.s6,
              fontFamily: fonts.bodyItalic,
              fontStyle: "italic",
              fontSize: 64,
              lineHeight: 1.18,
              color: colors.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Retention is what you do{" "}
            <MarkerHighlight delay={48} duration={20} behind>
              to win.
            </MarkerHighlight>
          </div>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

/* ─── Scene 6 — Brand outro (510–540, 30f) ────────────────────────── */
const OutroScene: React.FC = () => {
  const opacity = useSceneFade(6, 0, 30);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="center">
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: space.s5 }}>
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
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

export const LeakyBucket: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperBackground />
      <Sequence durationInFrames={75} premountFor={1 * fps}>
        <TitleScene />
      </Sequence>
      <Sequence from={75} durationInFrames={105} premountFor={1 * fps}>
        <FillScene />
      </Sequence>
      <Sequence from={180} durationInFrames={105} premountFor={1 * fps}>
        <LeakScene />
      </Sequence>
      <Sequence from={285} durationInFrames={150} premountFor={1 * fps}>
        <CompareScene />
      </Sequence>
      <Sequence from={435} durationInFrames={75} premountFor={1 * fps}>
        <QuoteScene />
      </Sequence>
      <Sequence from={510} durationInFrames={30} premountFor={1 * fps}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
