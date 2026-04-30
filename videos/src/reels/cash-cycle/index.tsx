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
import { Pipeline, TweenedCoin, Arrow } from "../../brand/svg";
import { colors, space, ease } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import manifestJson from "./voiceover/manifest.json";

const manifest = manifestJson as Manifest;

/* ───────────────────────────────────────────────────────────────────
   Cash Conversion Cycle — narrated reel.
   Durations come from `voiceover/manifest.json` — never edit by hand.
   See PLAN.md for the scene-by-scene scenario.
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

export const CASH_CYCLE_DURATION = manifest.totalFrames;

/** Find the start frame (scene-local) of the first word containing `needle`. */
function wordCue(words: Word[], needle: string, fallback = 0): number {
  const n = needle.toLowerCase();
  for (const w of words) {
    if (w.word.toLowerCase().includes(n)) return w.startFrame;
  }
  return fallback;
}

/* ─── Scene 01 — Title ────────────────────────────────────────────── */
const TitleScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(8, 14, total);
  const profitCue = wordCue(words, "profit", 4);
  const cashCue = wordCue(words, "cash", profitCue + 30);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad>
        <Eyebrow delay={2}>UNIT ECONOMICS · MADE PLAIN</Eyebrow>
        <Hairline delay={16} color={colors.line} />
        <div style={{ marginTop: space.s7 }}>
          <InkWipeLine
            text="Profit is opinion."
            delay={profitCue}
            size={108}
            stagger={2.4}
          />
          <div style={{ marginTop: space.s4 }}>
            <InkWipeLine
              text="Cash is timing."
              delay={cashCue}
              size={108}
              color={colors.accent}
              stagger={2.4}
            />
          </div>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

/* ─── Scene 02 — Pipeline introduction ────────────────────────────── */
const PipelineScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(8, 14, total);
  const drawCue = 4;
  const supplierCue = wordCue(words, "supplier", 50);
  const inventoryCue = wordCue(words, "inventory", supplierCue + 24);
  const paidCue = wordCue(words, "paid", inventoryCue + 24);

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={2}>EVERY BUSINESS</Eyebrow>
        <Hairline delay={14} color={colors.line} />
        <div style={{ marginTop: space.s5 }}>
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: 92,
              color: colors.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
            }}
          >
            is a pipeline.
          </span>
        </div>
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <Pipeline
          x={90}
          y={1100}
          width={900}
          stops={[
            { label: "Pay supplier", t: 0.0, appearAt: supplierCue },
            { label: "Hold inventory", t: 0.5, appearAt: inventoryCue },
            { label: "Get paid", t: 1.0, appearAt: paidCue },
          ]}
          delay={drawCue}
          duration={42}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 03 — Coin flow + trap zone ────────────────────────────── */
const CoinFlowScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(8, 14, total);
  const frame = useCurrentFrame();
  const gapCue = wordCue(words, "gap", 8);
  const cycleCue = wordCue(words, "cycle", 80);
  const coinStart = 20;
  const coinEnd = total - 30;

  // Counter ticking up to 60
  const counterProgress = interpolate(
    frame - cycleCue,
    [0, 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const days = Math.round(60 * counterProgress);

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={2} color={colors.accent}>THE GAP</Eyebrow>
        <Hairline delay={14} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <Pipeline
          x={90}
          y={1100}
          width={900}
          stops={[
            { label: "Pay supplier", t: 0.0, appearAt: 0 },
            { label: "Hold inventory", t: 0.5, appearAt: 0 },
            { label: "Get paid", t: 1.0, appearAt: 0 },
          ]}
          delay={0}
          duration={1}
          trap={{
            from: 0.0,
            to: 1.0,
            color: colors.accent,
            appearAt: gapCue,
            label: "CASH TRAPPED",
          }}
        />

        {/* Day-0 → Day-60 numerals */}
        <text
          x={90}
          y={1240}
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.mute2}
          letterSpacing="0.08em"
          opacity={interpolate(frame - gapCue, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          DAY 0
        </text>
        <text
          x={990}
          y={1240}
          textAnchor="end"
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.mute2}
          letterSpacing="0.08em"
          opacity={interpolate(frame - gapCue, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          DAY 60
        </text>

        {/* $1 in, $1.20 out */}
        <TweenedCoin
          fromX={70}
          fromY={1100}
          toX={1010}
          toY={1100}
          startFrame={coinStart}
          endFrame={coinEnd}
          arcHeight={-110}
          label="$1"
          r={48}
          fill={colors.ink}
          textColor={colors.paper}
        />
      </svg>

      {/* Trapped-days counter */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 700,
          textAlign: "center",
          opacity: interpolate(frame - cycleCue, [0, 14], [0, 1], {
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
            letterSpacing: "0.14em",
          }}
        >
          CASH CONVERSION CYCLE
        </span>
        <div
          style={{
            marginTop: 6,
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 220,
            color: colors.accent,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {days}
          <span style={{ fontSize: 64, color: colors.mute, marginLeft: 12 }}>days</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 04 — Two businesses ───────────────────────────────────── */
const TwoBusinessesScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(10, 14, total);
  const floatsCue = wordCue(words, "float", 70);
  const drownsCue = wordCue(words, "drown", floatsCue + 30);

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={2}>SAME P&L · DIFFERENT LIVES</Eyebrow>
        <Hairline delay={14} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* TOP: Apple-style — get paid first, pay later */}
        <text
          x={90}
          y={620}
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.pos}
          letterSpacing="0.12em"
          fontWeight={600}
          opacity={interpolate(useCurrentFrame() - 4, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          NEGATIVE CYCLE
        </text>
        <Pipeline
          x={90}
          y={760}
          width={900}
          stops={[
            { label: "Get paid", t: 0.0, appearAt: 6 },
            { label: "Hold inventory", t: 0.6, appearAt: 18 },
            { label: "Pay supplier", t: 1.0, appearAt: 30 },
          ]}
          delay={6}
          duration={32}
          pipeColor={colors.ink}
          stopColor={colors.pos}
          trap={{
            from: 0.0,
            to: 1.0,
            color: colors.pos,
            appearAt: floatsCue,
            label: "−30 DAYS · CASH FLOATS",
          }}
        />

        {/* BOTTOM: Corner store */}
        <text
          x={90}
          y={1260}
          fontFamily={fonts.mono}
          fontSize={26}
          fill={colors.neg}
          letterSpacing="0.12em"
          fontWeight={600}
          opacity={interpolate(useCurrentFrame() - 38, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          POSITIVE CYCLE
        </text>
        <Pipeline
          x={90}
          y={1400}
          width={900}
          stops={[
            { label: "Pay supplier", t: 0.0, appearAt: 40 },
            { label: "Hold inventory", t: 0.5, appearAt: 52 },
            { label: "Get paid", t: 1.0, appearAt: 64 },
          ]}
          delay={40}
          duration={32}
          pipeColor={colors.ink}
          stopColor={colors.neg}
          trap={{
            from: 0.0,
            to: 1.0,
            color: colors.neg,
            appearAt: drownsCue,
            label: "+60 DAYS · CASH DROWNS",
          }}
        />
      </svg>

      {/* Centered punchline */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1620,
          textAlign: "center",
          opacity: interpolate(useCurrentFrame() - drownsCue - 30, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.bodyItalic,
            fontStyle: "italic",
            fontSize: 42,
            lineHeight: 1.25,
            color: colors.mute,
          }}
        >
          Same{" "}
          <span style={{ fontFamily: fonts.mono, color: colors.ink, fontStyle: "normal" }}>
            $1M/mo
          </span>{" "}
          revenue. Same margins.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 05 — Formula ──────────────────────────────────────────── */
const FormulaScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(8, 14, total);
  const frame = useCurrentFrame();
  const inventoryCue = wordCue(words, "inventory", 6);
  const customersCue = wordCue(words, "customer", inventoryCue + 30);
  const suppliersCue = wordCue(words, "supplier", customersCue + 30);

  const dim = (cue: number) =>
    interpolate(frame - cue, [0, 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...ease.quart),
    });

  const dioP = dim(inventoryCue);
  const dsoP = dim(customersCue);
  const dpoP = dim(suppliersCue);
  const sumCue = suppliersCue + 22;
  const sumP = dim(sumCue);

  const Term: React.FC<{ label: string; value: string; color: string; p: number }> = ({
    label,
    value,
    color,
    p,
  }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 130,
          color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.mute,
          marginTop: 6,
          letterSpacing: "0.08em",
        }}
      >
        {value}
      </span>
    </div>
  );

  const Op: React.FC<{ symbol: string; p: number; color?: string }> = ({
    symbol,
    p,
    color = colors.mute2,
  }) => (
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: 100,
        color,
        opacity: p,
        margin: "0 12px",
        lineHeight: 1,
      }}
    >
      {symbol}
    </span>
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={2}>THE FORMULA</Eyebrow>
        <Hairline delay={14} color={colors.line} />
      </ScenePad>

      {/* Top equation */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Term label="DIO" value="days inventory" color={colors.ink} p={dioP} />
        <Op symbol="+" p={dsoP} />
        <Term label="DSO" value="days receivable" color={colors.ink} p={dsoP} />
        <Op symbol="−" p={dpoP} />
        <Term label="DPO" value="days payable" color={colors.ink} p={dpoP} />
      </div>

      {/* Concrete numbers */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1100,
          textAlign: "center",
          opacity: sumP,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 64,
            color: colors.mute,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          45 + 30 − 15 ={" "}
          <span style={{ color: colors.accent, fontWeight: 600 }}>60</span>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: fonts.bodyItalic,
            fontStyle: "italic",
            fontSize: 38,
            color: colors.mute2,
          }}
        >
          days of cash trapped in motion.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 06 — Three levers ─────────────────────────────────────── */
const LeversScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(8, 14, total);
  const frame = useCurrentFrame();
  const fasterCue = wordCue(words, "faster", 8);
  const soonerCue = wordCue(words, "sooner", fasterCue + 24);
  const laterCue = wordCue(words, "later", soonerCue + 24);
  const squeezeCue = wordCue(words, "squeeze", laterCue + 30);

  // Each lever pushes one stop. Stops shift over 22 frames after their cue.
  const fasterShift = interpolate(frame - fasterCue, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  const soonerShift = interpolate(frame - soonerCue, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });
  const laterShift = interpolate(frame - laterCue, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease.quart),
  });

  // Initial positions (corner store): supplier 0, inventory 0.5, paid 1.0
  // After: supplier slides right by 0.18, inventory left by 0.20, paid left by 0.32
  const supplierT = 0.0 + 0.18 * laterShift;
  const inventoryT = 0.5 - 0.20 * fasterShift;
  const paidT = 1.0 - 0.32 * soonerShift;

  // Trap zone shrinks
  const trapTo = paidT;
  const trapFrom = supplierT;
  const trapWidth = (trapTo - trapFrom).toFixed(2);
  const finalDays = Math.round(60 * (1 - 0.86 * Math.min(fasterShift, soonerShift, laterShift)));

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="start">
        <Eyebrow delay={2} color={colors.accent}>THREE LEVERS</Eyebrow>
        <Hairline delay={14} color={colors.line} />
      </ScenePad>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <Pipeline
          x={90}
          y={1180}
          width={900}
          stops={[
            { label: "Pay supplier", t: supplierT, appearAt: 0 },
            { label: "Hold inventory", t: inventoryT, appearAt: 0 },
            { label: "Get paid", t: paidT, appearAt: 0 },
          ]}
          delay={0}
          duration={1}
          trap={{
            from: trapFrom,
            to: trapTo,
            color: colors.accent,
            appearAt: 0,
          }}
        />

        {/* Push arrows */}
        <Arrow
          x1={90 + 900 * 0.5}
          y1={950}
          x2={90 + 900 * 0.32}
          y2={1170}
          delay={fasterCue - 2}
          duration={20}
          color={colors.ink}
        />
        <Arrow
          x1={90 + 900 * 1.0}
          y1={950}
          x2={90 + 900 * 0.74}
          y2={1170}
          delay={soonerCue - 2}
          duration={20}
          color={colors.ink}
        />
        <Arrow
          x1={90 + 900 * 0.0}
          y1={950}
          x2={90 + 900 * 0.16}
          y2={1170}
          delay={laterCue - 2}
          duration={20}
          color={colors.ink}
        />

        {/* Lever labels */}
        <text
          x={90 + 900 * 0.5}
          y={910}
          textAnchor="middle"
          fontFamily={fonts.mono}
          fontSize={28}
          fontWeight={600}
          fill={colors.ink}
          letterSpacing="0.04em"
          opacity={fasterShift}
        >
          SELL FASTER
        </text>
        <text
          x={90 + 900 * 1.0}
          y={910}
          textAnchor="end"
          fontFamily={fonts.mono}
          fontSize={28}
          fontWeight={600}
          fill={colors.ink}
          letterSpacing="0.04em"
          opacity={soonerShift}
        >
          GET PAID SOONER
        </text>
        <text
          x={90}
          y={910}
          fontFamily={fonts.mono}
          fontSize={28}
          fontWeight={600}
          fill={colors.ink}
          letterSpacing="0.04em"
          opacity={laterShift}
        >
          PAY LATER
        </text>
      </svg>

      {/* Days counter — shrinks from 60 to ~8 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 540,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 24,
            color: colors.mute,
            letterSpacing: "0.14em",
          }}
        >
          CASH TRAPPED
        </span>
        <div
          style={{
            marginTop: 6,
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 200,
            color: colors.accent,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {finalDays}
          <span style={{ fontSize: 56, color: colors.mute, marginLeft: 12 }}>days</span>
        </div>
      </div>

      {/* Punchline */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1500,
          textAlign: "center",
          opacity: interpolate(frame - squeezeCue, [0, 16], [0, 1], {
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
            lineHeight: 1.2,
            color: colors.ink,
          }}
        >
          The business{" "}
          <MarkerHighlight delay={squeezeCue + 12} duration={20} behind>
            funds itself.
          </MarkerHighlight>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 07 — Outro ───────────────────────────────────────────── */
const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
  const opacity = useSceneFade(6, 8, total);
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
          <div
            style={{
              marginTop: space.s5,
              fontFamily: fonts.bodyItalic,
              fontStyle: "italic",
              fontSize: 38,
              color: colors.mute,
            }}
          >
            Profit is opinion. Cash is timing.
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
    case "02-pipeline":
      return <PipelineScene {...props} />;
    case "03-coin-flow":
      return <CoinFlowScene {...props} />;
    case "04-two-businesses":
      return <TwoBusinessesScene {...props} />;
    case "05-formula":
      return <FormulaScene {...props} />;
    case "06-levers":
      return <LeversScene {...props} />;
    case "07-outro":
      return <OutroScene {...props} />;
    default:
      return null;
  }
};

export const CashCycle: React.FC = () => {
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
          <Audio src={staticFile(`cash-cycle/voiceover/${scene.audio}`)} />
          <SceneRouter scene={scene as SceneManifest} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
