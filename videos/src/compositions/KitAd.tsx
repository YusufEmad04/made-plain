import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import {
  PaperBackground,
  Eyebrow,
  InkWipeLine,
  DotMark,
  Hairline,
  EditorialDivider,
  MarkerHighlight,
  ScenePad,
  useSceneFade,
} from "../brand/motion";
import { colors, space } from "../brand/tokens";
import { fonts } from "../brand/fonts";

/* ───────────────────────────────────────────────────────────────────
   Made Plain — Kit Ad Reel (15s, 1080x1920)
   Goal: Pitch the kit. One-promise headline. Real specs. Honest price.
   ─────────────────────────────────────────────────────────────────── */

export const KIT_AD_DURATION = 15 * 30; // 450 frames

const KIT_PIECES = [
  { name: "The Handbook", spec: "~150 pages" },
  { name: "The Connection Map", spec: "A1 poster + web" },
  { name: "30 Books, Distilled", spec: "~50 pages" },
  { name: "The Glossary", spec: "200 terms" },
  { name: "The Worksheet Pack", spec: "12 templates" },
  { name: "The Exercise Booklet", spec: "25 exercises" },
  { name: "Quick Start Paths", spec: "4 paths" },
];

/* Scene 1 — Eyebrow + headline (0–4.5s, 135f) */
const SceneOne: React.FC = () => {
  const opacity = useSceneFade(8, 12, 135);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad>
        <Eyebrow delay={4}>A KIT, NOT A LIBRARY</Eyebrow>
        <Hairline delay={20} thickness={1} color={colors.line} />
        <div style={{ marginTop: space.s5 }}>
          <InkWipeLine
            text="Everything in business."
            delay={28}
            size={120}
            color={colors.ink}
            stagger={3}
          />
          <div style={{ marginTop: space.s5 }}>
            <InkWipeLine
              text="In one weekend."
              delay={48}
              size={120}
              color={colors.accent}
              stagger={3}
            />
          </div>
        </div>
        <div style={{ marginTop: space.s7, display: "flex", alignItems: "center", gap: space.s4 }}>
          <DotMark size={20} delay={92} />
          <span
            style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: 28,
              color: colors.mute,
            }}
          >
            made plain
          </span>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

/* Scene 2 — The seven pieces (4.5–9.5s, 150f) */
const SceneTwo: React.FC = () => {
  const opacity = useSceneFade(10, 14, 150);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad>
        <Eyebrow delay={4} color={colors.accent}>
          7 PIECES · 1 WEEKEND
        </Eyebrow>
        <Hairline delay={22} color={colors.line} />
        <div
          style={{
            marginTop: space.s5,
            display: "flex",
            flexDirection: "column",
            gap: space.s4,
            width: "100%",
          }}
        >
          {KIT_PIECES.map((piece, i) => {
            const delay = 28 + i * 8;
            return (
              <Sequence key={i} from={delay} layout="none">
                <PieceRow piece={piece} />
              </Sequence>
            );
          })}
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

const PieceRow: React.FC<{ piece: { name: string; spec: string } }> = ({
  piece,
}) => {
  const opacity = useSceneFade(8, 0);
  return (
    <div
      style={{
        opacity,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: space.s4,
        paddingBottom: space.s3,
        borderBottom: `1px solid ${colors.line}`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 42,
          color: colors.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {piece.name}
      </span>
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 22,
          color: colors.mute,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {piece.spec}
      </span>
    </div>
  );
};

/* Scene 3 — The promise line (9.5–12s, 75f) */
const SceneThree: React.FC = () => {
  const opacity = useSceneFade(8, 10, 75);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad>
        <EditorialDivider delay={2} color={colors.line} />
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 64,
            lineHeight: 1.15,
            color: colors.ink,
            letterSpacing: "-0.01em",
            marginTop: space.s7,
          }}
        >
          <InkWipeLine
            text="By Monday, you'll know"
            delay={14}
            size={64}
            weight={500}
            family={fonts.body}
            letterSpacing="-0.005em"
            stagger={3}
          />
          <div style={{ marginTop: space.s4 }}>
            <InkWipeLine
              text="how business actually works."
              delay={32}
              size={64}
              weight={500}
              italic
              family={fonts.bodyItalic}
              letterSpacing="-0.005em"
              stagger={3}
            />
          </div>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

/* Scene 4 — The price card (12–15s, 90f) */
const SceneFour: React.FC = () => {
  const opacity = useSceneFade(8, 0, 90);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ScenePad align="center">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: space.s5,
          }}
        >
          <Eyebrow delay={4} color={colors.mute}>
            FOUNDING WINDOW
          </Eyebrow>
          <Hairline delay={22} color={colors.line} />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: space.s3,
              marginTop: space.s4,
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 90,
                color: colors.accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $
            </span>
            <span
              style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 280,
                color: colors.ink,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              99
            </span>
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: 32,
              color: colors.mute,
              marginTop: -space.s4,
            }}
          >
            lifetime · first 300 buyers
          </div>
          <div style={{ marginTop: space.s5, display: "flex", alignItems: "center", gap: space.s3 }}>
            <DotMark size={28} delay={20} />
            <MarkerHighlight delay={30} duration={20} behind>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 56,
                  letterSpacing: "-0.01em",
                  padding: `${space.s2}px ${space.s4}px`,
                }}
              >
                Get the kit
              </span>
            </MarkerHighlight>
          </div>
          <div
            style={{
              marginTop: space.s5,
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.mute2,
              letterSpacing: "0.05em",
            }}
          >
            made-plain.com
          </div>
        </div>
      </ScenePad>
    </AbsoluteFill>
  );
};

export const KitAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperBackground />
      <Sequence durationInFrames={135} premountFor={1 * fps}>
        <SceneOne />
      </Sequence>
      <Sequence from={135} durationInFrames={150} premountFor={1 * fps}>
        <SceneTwo />
      </Sequence>
      <Sequence from={285} durationInFrames={75} premountFor={1 * fps}>
        <SceneThree />
      </Sequence>
      <Sequence from={360} durationInFrames={90} premountFor={1 * fps}>
        <SceneFour />
      </Sequence>
    </AbsoluteFill>
  );
};
