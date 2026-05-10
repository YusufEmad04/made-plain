import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBackground } from "./brand/motion";
import { colors, REEL } from "./brand/tokens";
import { fonts } from "./brand/fonts";

/* ───────────────────────────────────────────────────────────────────
   Made Plain — Reel Thumbnails (9:16, 1080x1920)
   One static cover image per reel. Common layout:
     - Top eyebrow: § CATEGORY
     - Center hook (text + visual)
     - Bottom wordmark: made plain · DotMark
   ─────────────────────────────────────────────────────────────────── */

const SAFE_X = 80;

// ─────────────────────────────────────────────────────────────────────
// Shared shell + atoms
// ─────────────────────────────────────────────────────────────────────

const ThumbShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AbsoluteFill style={{ backgroundColor: colors.paper }}>
        <PaperBackground />
        {children}
    </AbsoluteFill>
);

const TopEyebrow: React.FC<{ text: string; rtl?: boolean }> = ({ text, rtl }) => (
    <div
        style={{
            position: "absolute",
            top: 110,
            left: rtl ? "auto" : SAFE_X,
            right: rtl ? SAFE_X : "auto",
            fontFamily: fonts.mono,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 6,
            color: colors.accent,
            textTransform: "uppercase",
            direction: rtl ? "rtl" : "ltr",
        }}
    >
        {text}
    </div>
);

const Wordmark: React.FC<{ rtl?: boolean }> = ({ rtl }) => (
    <div
        style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <span
            style={{
                fontFamily: fonts.display,
                fontSize: 56,
                fontWeight: 700,
                color: colors.ink,
                letterSpacing: -1,
            }}
        >
            made&nbsp;
        </span>
        <span
            style={{
                fontFamily: fonts.display,
                fontSize: 56,
                fontWeight: 700,
                color: colors.accent,
                letterSpacing: -1,
            }}
        >
            plain.
        </span>
    </div>
);

// ─────────────────────────────────────────────────────────────────────
// 1 — Customer Pain Test
// ─────────────────────────────────────────────────────────────────────

export const CustomerPainTestThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ THE PAIN TEST" />

        {/* Center hook: PAIN / WISH contrast */}
        <div
            style={{
                position: "absolute",
                top: 460,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 220,
                lineHeight: 0.95,
                letterSpacing: -3,
                color: colors.accent,
            }}
        >
            PAIN
        </div>
        <div
            style={{
                position: "absolute",
                top: 730,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 56,
                color: colors.mute,
            }}
        >
            has a number.
        </div>

        <div
            style={{
                position: "absolute",
                top: 880,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 220,
                lineHeight: 0.95,
                letterSpacing: -3,
                color: "#7E776A",
            }}
        >
            WISH
        </div>
        <div
            style={{
                position: "absolute",
                top: 1150,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 56,
                color: colors.mute,
            }}
        >
            doesn't.
        </div>

        <Wordmark />
    </ThumbShell>
);

// ─────────────────────────────────────────────────────────────────────
// 2 — Business Three Jobs
// ─────────────────────────────────────────────────────────────────────

const JobCard: React.FC<{
    n: string;
    label: string;
    formal: string;
    color: string;
    x: number;
}> = ({ n, label, formal, color, x }) => (
    <div
        style={{
            position: "absolute",
            top: 720,
            left: x - 165,
            width: 330,
            background: color,
            borderRadius: 18,
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 0 0 #1A1712",
        }}
    >
        <div
            style={{
                fontFamily: fonts.mono,
                fontSize: 38,
                fontWeight: 700,
                color: colors.paper,
                opacity: 0.7,
            }}
        >
            {n}
        </div>
        <div
            style={{
                fontFamily: fonts.display,
                fontSize: 78,
                fontWeight: 900,
                color: colors.paper,
                letterSpacing: -1,
                lineHeight: 1,
            }}
        >
            {label}
        </div>
        <div
            style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                fontWeight: 600,
                color: colors.paper,
                letterSpacing: 3,
                opacity: 0.65,
                marginTop: 4,
            }}
        >
            {formal}
        </div>
    </div>
);

export const BusinessThreeJobsThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ THREE JOBS" />

        <div
            style={{
                position: "absolute",
                top: 280,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 110,
                lineHeight: 0.95,
                letterSpacing: -3,
                color: colors.ink,
                textAlign: "center",
            }}
        >
            Every business
            <br />
            has{" "}
            <span style={{ color: colors.accent }}>three jobs.</span>
        </div>

        <JobCard n="1" label="MAKE" formal="OPERATIONS" color={colors.accent} x={195} />
        <JobCard n="2" label="HAND OVER" formal="MARKETING" color="#3B7A57" x={540} />
        <JobCard n="3" label="KEEP" formal="FINANCE" color="#B8860B" x={885} />

        <div
            style={{
                position: "absolute",
                top: 1190,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 48,
                color: colors.mute,
                textAlign: "center",
                lineHeight: 1.3,
            }}
        >
            Drop one — and there's no business.
        </div>

        <Wordmark />
    </ThumbShell>
);

// ─────────────────────────────────────────────────────────────────────
// 3 — Engines of Growth
// ─────────────────────────────────────────────────────────────────────

const Flywheel: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
    // Three colored quadrants of a wheel: sticky (blue), viral (magenta), paid (gold)
    const blue = "#5B8FB9";
    const magenta = "#C13584";
    const gold = "#D4A24E";
    return (
        <svg
            style={{ position: "absolute", left: 0, top: 0 }}
            width={1080}
            height={1920}
        >
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.line} strokeWidth={3} strokeDasharray="6 8" />
            {/* Sticky arc */}
            <path
                d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r * Math.sin((Math.PI * 2) / 3)} ${cy - r * Math.cos((Math.PI * 2) / 3)} L ${cx} ${cy} Z`}
                fill={blue}
                opacity={0.85}
            />
            {/* Viral arc */}
            <path
                d={`M ${cx + r * Math.sin((Math.PI * 2) / 3)} ${cy - r * Math.cos((Math.PI * 2) / 3)} A ${r} ${r} 0 0 1 ${cx + r * Math.sin((Math.PI * 4) / 3)} ${cy - r * Math.cos((Math.PI * 4) / 3)} L ${cx} ${cy} Z`}
                fill={magenta}
                opacity={0.85}
            />
            {/* Paid arc */}
            <path
                d={`M ${cx + r * Math.sin((Math.PI * 4) / 3)} ${cy - r * Math.cos((Math.PI * 4) / 3)} A ${r} ${r} 0 0 1 ${cx} ${cy - r} L ${cx} ${cy} Z`}
                fill={gold}
                opacity={0.85}
            />
            {/* Hub */}
            <circle cx={cx} cy={cy} r={28} fill={colors.paper} stroke={colors.ink} strokeWidth={4} />
        </svg>
    );
};

const EnginePill: React.FC<{ label: string; color: string; x: number }> = ({
    label,
    color,
    x,
}) => (
    <div
        style={{
            position: "absolute",
            top: 1280,
            left: x - 145,
            width: 290,
            padding: "20px 0",
            background: color,
            borderRadius: 999,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 48,
            fontWeight: 800,
            color: colors.paper,
            letterSpacing: 2,
        }}
    >
        {label}
    </div>
);

export const EnginesOfGrowthThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ ENGINES OF GROWTH" />

        <div
            style={{
                position: "absolute",
                top: 270,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 116,
                lineHeight: 0.95,
                letterSpacing: -3,
                color: colors.ink,
                textAlign: "center",
            }}
        >
            Pick the engine
            <br />
            <span style={{ color: colors.accent }}>that fits.</span>
        </div>

        <Flywheel cx={540} cy={930} r={250} />

        <EnginePill label="STICKY" color="#5B8FB9" x={195} />
        <EnginePill label="VIRAL" color="#C13584" x={540} />
        <EnginePill label="PAID" color="#D4A24E" x={885} />

        <div
            style={{
                position: "absolute",
                top: 1410,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 44,
                color: colors.mute,
                textAlign: "center",
                lineHeight: 1.3,
            }}
        >
            Each one has a single rule.
        </div>

        <Wordmark />
    </ThumbShell>
);

// ─────────────────────────────────────────────────────────────────────
// 4 — Engines of Growth (Arabic)
// ─────────────────────────────────────────────────────────────────────

const EnginePillAR: React.FC<{ label: string; color: string; x: number }> = ({
    label,
    color,
    x,
}) => (
    <div
        style={{
            position: "absolute",
            top: 1280,
            left: x - 145,
            width: 290,
            padding: "20px 0",
            background: color,
            borderRadius: 999,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 56,
            fontWeight: 800,
            color: colors.paper,
            direction: "rtl",
        }}
    >
        {label}
    </div>
);

export const EnginesOfGrowthArThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ محركات النمو" rtl />

        <div
            style={{
                position: "absolute",
                top: 270,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 116,
                lineHeight: 1.05,
                color: colors.ink,
                textAlign: "center",
                direction: "rtl",
            }}
        >
            اختار المحرك
            <br />
            <span style={{ color: colors.accent }}>اللي يناسبك.</span>
        </div>

        <Flywheel cx={540} cy={930} r={250} />

        <EnginePillAR label="ولاء" color="#5B8FB9" x={195} />
        <EnginePillAR label="انتشار" color="#C13584" x={540} />
        <EnginePillAR label="مدفوع" color="#D4A24E" x={885} />

        <div
            style={{
                position: "absolute",
                top: 1410,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 44,
                color: colors.mute,
                textAlign: "center",
                lineHeight: 1.4,
                direction: "rtl",
            }}
        >
            كل واحد له قاعدة واحدة.
        </div>

        <Wordmark rtl />
    </ThumbShell>
);

// ─────────────────────────────────────────────────────────────────────
// 5 — Equity Journey
// ─────────────────────────────────────────────────────────────────────

const RisingArrow: React.FC = () => (
    <svg
        style={{ position: "absolute", left: 0, top: 0 }}
        width={1080}
        height={1920}
    >
        {/* Diagonal arrow */}
        <line
            x1={150}
            y1={1300}
            x2={930}
            y2={620}
            stroke={colors.accent}
            strokeWidth={10}
            strokeLinecap="round"
        />
        {/* Arrowhead */}
        <polygon
            points="930,620 880,632 900,672"
            fill={colors.accent}
        />
        {/* Faint milestone dots along the line */}
        {[
            { x: 270, y: 1196 },
            { x: 420, y: 1066 },
            { x: 580, y: 928 },
            { x: 740, y: 790 },
        ].map((p, i) => (
            <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={9}
                fill={colors.mute2}
            />
        ))}
    </svg>
);

export const EquityJourneyThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ EQUITY · A FULL JOURNEY" />

        {/* Origin label */}
        <div
            style={{
                position: "absolute",
                top: 1320,
                left: 70,
                fontFamily: fonts.mono,
                fontSize: 56,
                fontWeight: 700,
                color: colors.mute,
                letterSpacing: 2,
            }}
        >
            $0
        </div>

        <RisingArrow />

        {/* $500M tag at the top of the arrow */}
        <div
            style={{
                position: "absolute",
                top: 410,
                left: 0,
                right: 0,
                textAlign: "center",
            }}
        >
            <div
                style={{
                    display: "inline-block",
                    padding: "20px 36px",
                    background: colors.accent,
                    borderRadius: 14,
                    fontFamily: fonts.display,
                    fontSize: 100,
                    fontWeight: 900,
                    color: colors.paper,
                    letterSpacing: -2,
                }}
            >
                $500,000,000
            </div>
        </div>

        {/* Subtitle */}
        <div
            style={{
                position: "absolute",
                top: 1450,
                left: SAFE_X,
                right: SAFE_X,
                textAlign: "center",
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 88,
                lineHeight: 1,
                color: colors.ink,
                letterSpacing: -2,
            }}
        >
            Smaller slice.
            <br />
            <span style={{ color: colors.accent }}>Bigger pie.</span>
        </div>

        <Wordmark />
    </ThumbShell>
);

// ─────────────────────────────────────────────────────────────────────
// 6 — What A Business Actually Is
// ─────────────────────────────────────────────────────────────────────

const ValueTriangle: React.FC = () => {
    const cx = 540;
    const cy = 1020;
    const r = 280;
    const top = { x: cx, y: cy - r };
    const left = { x: cx - r * 0.866, y: cy + r * 0.5 };
    const right = { x: cx + r * 0.866, y: cy + r * 0.5 };

    return (
        <svg
            style={{ position: "absolute", left: 0, top: 0 }}
            width={1080}
            height={1920}
        >
            {/* Triangle outline */}
            <polygon
                points={`${top.x},${top.y} ${right.x},${right.y} ${left.x},${left.y}`}
                fill="none"
                stroke={colors.accent}
                strokeWidth={6}
                strokeLinejoin="round"
            />
            {/* Node circles */}
            {[top, left, right].map((p, i) => (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={28}
                    fill={colors.accent}
                />
            ))}
            {/* Labels */}
            <text
                x={top.x}
                y={top.y - 50}
                textAnchor="middle"
                fontFamily={fonts.display}
                fontWeight={900}
                fontSize={56}
                fill={colors.ink}
                letterSpacing="-0.02em"
            >
                CREATE
            </text>
            <text
                x={left.x - 30}
                y={left.y + 70}
                textAnchor="end"
                fontFamily={fonts.display}
                fontWeight={900}
                fontSize={56}
                fill={colors.ink}
                letterSpacing="-0.02em"
            >
                DELIVER
            </text>
            <text
                x={right.x + 30}
                y={right.y + 70}
                textAnchor="start"
                fontFamily={fonts.display}
                fontWeight={900}
                fontSize={56}
                fill={colors.ink}
                letterSpacing="-0.02em"
            >
                CAPTURE
            </text>
        </svg>
    );
};

export const WhatBusinessActuallyIsThumb: React.FC = () => (
    <ThumbShell>
        <TopEyebrow text="§ THE BUSINESS LOOP" />

        <div
            style={{
                position: "absolute",
                top: 270,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 110,
                lineHeight: 0.95,
                letterSpacing: -3,
                color: colors.ink,
                textAlign: "center",
            }}
        >
            What a business
            <br />
            <span style={{ color: colors.accent }}>actually is.</span>
        </div>

        <ValueTriangle />

        <div
            style={{
                position: "absolute",
                top: 1500,
                left: SAFE_X,
                right: SAFE_X,
                fontFamily: fonts.bodyItalic,
                fontStyle: "italic",
                fontSize: 48,
                color: colors.mute,
                textAlign: "center",
                lineHeight: 1.3,
            }}
        >
            One loop. Three sides.
        </div>

        <Wordmark />
    </ThumbShell>
);
