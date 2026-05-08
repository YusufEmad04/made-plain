import React from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { PaperBackground } from "../../brand/motion";
import { fonts } from "../../brand/fonts";
import { reelColors } from "./data";
import { fade, fadeOut, grow, pop, qEase, rise } from "./timing";

// ─────────────────────────────────────────────────────────────────────
// Layout constants — REEL canvas is 1080x1920 (9:16)
// ─────────────────────────────────────────────────────────────────────

export const SAFE_X = 70;
export const TOP_Y = 60;

// ─────────────────────────────────────────────────────────────────────
// SceneShell + small eyebrow
// ─────────────────────────────────────────────────────────────────────

export const SceneShell: React.FC<{
    children: React.ReactNode;
    showEyebrow?: boolean;
}> = ({ children, showEyebrow = true }) => (
    <AbsoluteFill>
        <PaperBackground />
        {showEyebrow ? <Eyebrow /> : null}
        {children}
    </AbsoluteFill>
);

export const Eyebrow: React.FC = () => {
    const frame = useCurrentFrame();
    const op = fade(frame, 0, 18);
    return (
        <div
            style={{
                position: "absolute",
                top: TOP_Y,
                left: SAFE_X,
                right: SAFE_X,
                opacity: op,
                fontFamily: fonts.mono,
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 4,
                color: reelColors.accent,
                textTransform: "uppercase",
            }}
        >
            § THE PAIN TEST
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// HugeLine — single hero line, big font, fade+rise
// ─────────────────────────────────────────────────────────────────────

export const HugeLine: React.FC<{
    children: React.ReactNode;
    at: number;
    top: number;
    size?: number;
    color?: string;
    weight?: number;
    align?: "left" | "center" | "right";
    family?: string;
    italic?: boolean;
    paddingX?: number;
    lineHeight?: number;
    /** "rise" = slide up + fade (default). "slam" = scale-in spring overshoot. */
    enter?: "rise" | "slam" | "drop";
}> = ({
    children,
    at,
    top,
    size = 96,
    color = reelColors.ink,
    weight = 800,
    align = "center",
    family = fonts.display,
    italic = false,
    paddingX = SAFE_X,
    lineHeight = 1.05,
    enter = "rise",
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();
        const op = fade(frame, at, enter === "slam" ? 8 : 16);

        let transform = "";
        if (enter === "rise") {
            const yOff = rise(frame, at, 22);
            transform = `translateY(${yOff}px)`;
        } else if (enter === "slam") {
            // Scale-in with overshoot
            const s = pop(frame, at, fps);
            const scale = 0.7 + s * 0.3;
            transform = `scale(${scale})`;
        } else if (enter === "drop") {
            // Drop from above
            const dropY = (1 - fade(frame, at, 18)) * -40;
            transform = `translateY(${dropY}px)`;
        }

        return (
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top,
                    padding: `0 ${paddingX}px`,
                    opacity: op,
                    transform,
                    textAlign: align,
                    fontFamily: family,
                    fontStyle: italic ? "italic" : "normal",
                    fontSize: size,
                    fontWeight: weight,
                    color,
                    lineHeight,
                    letterSpacing: -1,
                    boxSizing: "border-box",
                }}
            >
                {children}
            </div>
        );
    };

// ─────────────────────────────────────────────────────────────────────
// HighlightSpan — accent marker fills behind text on cue
// ─────────────────────────────────────────────────────────────────────

export const HighlightSpan: React.FC<{
    children: React.ReactNode;
    at: number;
    color?: string;
    inkColor?: string;
}> = ({ children, at, color = reelColors.accent, inkColor = reelColors.accentInk }) => {
    const frame = useCurrentFrame();
    const t = interpolate(frame - at, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });
    return (
        <span
            style={{
                position: "relative",
                display: "inline-block",
                padding: "0 0.18em",
                color: t > 0.5 ? inkColor : "inherit",
            }}
        >
            <span
                aria-hidden
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    backgroundColor: color,
                    transform: `scaleX(${t})`,
                    transformOrigin: "left center",
                    zIndex: 0,
                    borderRadius: 4,
                }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────
// 01 — TombstoneCard (product mock that crumbles)
// ─────────────────────────────────────────────────────────────────────

export const TombstoneCard: React.FC<{
    at: number;
    crumbleAt: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    rotate?: number;
}> = ({
    at,
    crumbleAt,
    x,
    y,
    width = 230,
    height = 320,
    color = reelColors.accent,
    rotate = -3,
}) => {
        const frame = useCurrentFrame();
        const op = fade(frame, at, 14);
        const enter = pop(frame, at, 30);

        const tCrumble = interpolate(frame - crumbleAt, [0, 36], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: qEase,
        });
        const fallY = tCrumble * 180;
        const crumbleRotate = tCrumble * 38;
        const crumbleOp = 1 - tCrumble * 0.85;
        const crumbleScale = 1 - tCrumble * 0.22;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - width / 2,
                    top: y - height / 2,
                    width,
                    height,
                    opacity: op * crumbleOp,
                    transform: `translateY(${fallY}px) rotate(${rotate + crumbleRotate}deg) scale(${enter * crumbleScale})`,
                    transformOrigin: "center bottom",
                    background: color,
                    borderRadius: 12,
                    boxShadow: `0 8px 0 0 ${reelColors.panel}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 14,
                    padding: 24,
                }}
            >
                <div
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: reelColors.paper,
                        opacity: 0.5,
                    }}
                />
                <div
                    style={{
                        width: "85%",
                        height: 12,
                        background: reelColors.paper,
                        borderRadius: 6,
                        opacity: 0.4,
                    }}
                />
                <div
                    style={{
                        width: "55%",
                        height: 12,
                        background: reelColors.paper,
                        borderRadius: 6,
                        opacity: 0.4,
                    }}
                />
                {/* a big X overlay once crumbling has begun */}
                {tCrumble > 0.3 ? (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: fonts.display,
                            fontSize: 200,
                            fontWeight: 800,
                            color: reelColors.paper,
                            opacity: tCrumble - 0.3,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </div>
                ) : null}
            </div>
        );
    };

// ─────────────────────────────────────────────────────────────────────
// CrossOutMark — two diagonal strokes draw across a region to mark it wrong
// ─────────────────────────────────────────────────────────────────────

export const CrossOutMark: React.FC<{
    at: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    strokeWidth?: number;
    drawDuration?: number;
}> = ({
    at,
    x,
    y,
    width,
    height,
    color = reelColors.negBright,
    strokeWidth = 14,
    drawDuration = 12,
}) => {
        const frame = useCurrentFrame();

        // Stroke 1: top-left → bottom-right
        const t1 = interpolate(frame - at, [0, drawDuration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: qEase,
        });
        // Stroke 2: top-right → bottom-left (starts halfway through stroke 1)
        const stroke2Start = at + Math.floor(drawDuration * 0.55);
        const t2 = interpolate(frame - stroke2Start, [0, drawDuration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: qEase,
        });

        // Slight overshoot on stroke 1's tail
        const op = fade(frame, at, 4);

        return (
            <svg
                width={width}
                height={height}
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    opacity: op,
                    pointerEvents: "none",
                }}
            >
                {/* Stroke 1: TL → BR */}
                <line
                    x1={0}
                    y1={0}
                    x2={width * t1}
                    y2={height * t1}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Stroke 2: TR → BL */}
                <line
                    x1={width}
                    y1={0}
                    x2={width - width * t2}
                    y2={height * t2}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </svg>
        );
    };

// ─────────────────────────────────────────────────────────────────────
// FailureStamp — large red stamp text placed below a crumbling card
// ─────────────────────────────────────────────────────────────────────

export const FailureStamp: React.FC<{
    at: number;
    x: number;
    y: number;
    text: string;
    fontSize?: number;
    rotate?: number;
}> = ({ at, x, y, text, fontSize = 48, rotate = -6 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const op = fade(frame, at, 10);
    const s = pop(frame, at, fps);
    const scale = 0.4 + s * 0.6 + Math.max(0, 1 - s) * 0.6; // overshoot
    return (
        <div
            style={{
                position: "absolute",
                left: x - 200,
                top: y,
                width: 400,
                textAlign: "center",
                opacity: op,
                transform: `rotate(${rotate}deg) scale(${scale})`,
                fontFamily: fonts.display,
                fontSize,
                fontWeight: 900,
                color: reelColors.negBright,
                letterSpacing: 2,
                textTransform: "uppercase",
                border: `4px solid ${reelColors.negBright}`,
                borderRadius: 6,
                padding: "6px 14px",
                lineHeight: 1.1,
                background: "rgba(28, 22, 20, 0.92)",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.4)",
            }}
        >
            {text}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// DustPuff — small brown dust particles that puff outward at a moment
// ─────────────────────────────────────────────────────────────────────

export const DustPuff: React.FC<{
    at: number;
    x: number;
    y: number;
    count?: number;
    color?: string;
}> = ({ at, x, y, count = 8, color = "rgba(229, 87, 42, 0.55)" }) => {
    const frame = useCurrentFrame();
    const t = interpolate(frame - at, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });
    const op = (1 - t) * fade(frame, at, 4);
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 0,
                height: 0,
                opacity: op,
            }}
        >
            {Array.from({ length: count }).map((_, i) => {
                const angle = (i / count) * Math.PI * 2 + 0.3;
                const dist = 60 + (i % 3) * 30;
                const px = Math.cos(angle) * dist * t;
                const py = Math.sin(angle) * dist * t - 20 * t * t; // gravity-ish lift
                const r = 8 + (i % 3) * 4;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: px - r / 2,
                            top: py - r / 2,
                            width: r,
                            height: r,
                            borderRadius: "50%",
                            background: color,
                        }}
                    />
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// 03 — QuoteBubble + VerdictLabel
// ─────────────────────────────────────────────────────────────────────

export const PersonGlyph: React.FC<{
    at: number;
    x: number;
    y: number;
    color?: string;
}> = ({ at, x, y, color = reelColors.ink }) => {
    const frame = useCurrentFrame();
    const op = fade(frame, at, 14);
    const scale = 0.9 + pop(frame, at, 30) * 0.1;
    return (
        <svg
            width={120}
            height={120}
            viewBox="0 0 120 120"
            style={{
                position: "absolute",
                left: x - 60,
                top: y - 60,
                opacity: op,
                transform: `scale(${scale})`,
            }}
        >
            <circle cx={60} cy={42} r={26} fill={color} />
            <path
                d="M 14 110 Q 60 64 106 110"
                stroke={color}
                strokeWidth={10}
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
};

export const QuoteBubble: React.FC<{
    at: number;
    children: React.ReactNode;
    x: number;
    y: number;
    width?: number;
    fontSize?: number;
    italic?: boolean;
    slideFrom?: "left" | "right" | "none";
}> = ({
    at,
    children,
    x,
    y,
    width = 820,
    fontSize = 60,
    italic = true,
    slideFrom = "right",
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();
        const op = fade(frame, at, 14);
        const s = pop(frame, at, fps);
        const slideX =
            slideFrom === "right"
                ? (1 - s) * 80
                : slideFrom === "left"
                    ? -(1 - s) * 80
                    : 0;
        return (
            <div
                style={{
                    position: "absolute",
                    left: x - width / 2,
                    top: y,
                    width,
                    opacity: op,
                    transform: `translateX(${slideX}px) scale(${0.92 + s * 0.08})`,
                    background: reelColors.panel,
                    border: `3px solid ${reelColors.panelBorder}`,
                    borderRadius: 22,
                    padding: "36px 42px",
                    fontFamily: italic ? fonts.bodyItalic : fonts.body,
                    fontStyle: italic ? "italic" : "normal",
                    fontSize,
                    color: reelColors.ink,
                    lineHeight: 1.2,
                    textAlign: "center",
                    boxSizing: "border-box",
                }}
            >
                {children}
            </div>
        );
    };

export const VerdictLabel: React.FC<{
    at: number;
    text: string;
    x: number;
    y: number;
    color?: string;
    fontSize?: number;
    align?: "left" | "center" | "right";
}> = ({ at, text, x, y, color = reelColors.ink, fontSize = 64, align = "center" }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const op = fade(frame, at, 12);
    const s = pop(frame, at, fps);
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y,
                textAlign: align,
                paddingLeft: align === "left" ? x : 0,
                paddingRight: align === "right" ? 1080 - x : 0,
                opacity: op,
                transform: `scale(${0.85 + s * 0.15})`,
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize,
                letterSpacing: 4,
                textTransform: "uppercase",
                color,
            }}
        >
            {text}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// 04 — QuestionCard
// ─────────────────────────────────────────────────────────────────────

export const QuestionCard: React.FC<{
    at: number;
    mark: "x" | "check";
    title: string;
    question: string;
    answer: React.ReactNode;
    verdict: string;
    x: number;
    y: number;
    width?: number;
    answerAt?: number;
    verdictAt?: number;
}> = ({
    at,
    mark,
    title,
    question,
    answer,
    verdict,
    x,
    y,
    width = 980,
    answerAt,
    verdictAt,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();
        const op = fade(frame, at, 14);
        const s = pop(frame, at, fps);
        const isBad = mark === "x";
        const markColor = isBad ? reelColors.negBright : reelColors.posBright;
        const verdictColor = isBad ? reelColors.negBright : reelColors.accent;
        const ansAt = answerAt ?? at + 16;
        const verdAt = verdictAt ?? ansAt + 14;
        const ansS = pop(frame, ansAt, fps);
        const verdS = pop(frame, verdAt, fps);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - width / 2,
                    top: y,
                    width,
                    opacity: op,
                    transform: `scale(${0.9 + s * 0.1})`,
                    background: reelColors.panel,
                    border: `4px solid ${isBad ? reelColors.negBright : reelColors.accent}`,
                    borderRadius: 24,
                    padding: "32px 40px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 22,
                    }}
                >
                    <div
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: 14,
                            background: markColor,
                            color: reelColors.accentInk,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: fonts.display,
                            fontWeight: 800,
                            fontSize: 74,
                            lineHeight: 1,
                            transform: `scale(${0.6 + s * 0.4})`,
                        }}
                    >
                        {isBad ? "×" : "✓"}
                    </div>
                    <div
                        style={{
                            fontFamily: fonts.mono,
                            fontSize: 50,
                            fontWeight: 700,
                            letterSpacing: 4,
                            color: markColor,
                            textTransform: "uppercase",
                        }}
                    >
                        {title}
                    </div>
                </div>
                <div
                    style={{
                        fontFamily: fonts.display,
                        fontSize: 72,
                        fontWeight: 700,
                        color: reelColors.ink,
                        lineHeight: 1.15,
                        letterSpacing: -0.5,
                    }}
                >
                    {question}
                </div>
                <div
                    style={{
                        opacity: fade(frame, ansAt, 14),
                        transform: `translateX(${(1 - ansS) * 30}px)`,
                        fontFamily: fonts.bodyItalic,
                        fontStyle: "italic",
                        fontSize: 60,
                        color: reelColors.mute,
                        lineHeight: 1.25,
                        marginTop: 4,
                    }}
                >
                    {answer}
                </div>
                <div
                    style={{
                        opacity: fade(frame, verdAt, 12),
                        transform: `scale(${0.85 + verdS * 0.15})`,
                        transformOrigin: "left center",
                        fontFamily: fonts.mono,
                        fontWeight: 700,
                        fontSize: 52,
                        letterSpacing: 4,
                        color: verdictColor,
                        textTransform: "uppercase",
                        marginTop: 8,
                    }}
                >
                    → {verdict}
                </div>
            </div>
        );
    };

// ─────────────────────────────────────────────────────────────────────
// 05 — ChallengeList
// ─────────────────────────────────────────────────────────────────────

export const ChallengeLine: React.FC<{
    at: number;
    children: React.ReactNode;
    fontSize?: number;
    color?: string;
    weight?: number;
}> = ({ at, children, fontSize = 64, color = reelColors.ink, weight = 700 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const op = fade(frame, at, 14);
    const s = pop(frame, at, fps);
    return (
        <div
            style={{
                opacity: op,
                transform: `scale(${0.82 + s * 0.18})`,
                fontFamily: fonts.display,
                fontWeight: weight,
                fontSize,
                color,
                lineHeight: 1.2,
                letterSpacing: -0.5,
                textAlign: "center",
            }}
        >
            {children}
        </div>
    );
};
