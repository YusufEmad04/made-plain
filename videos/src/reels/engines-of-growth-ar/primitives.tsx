import React from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { PaperBackground, DotMark } from "../../brand/motion";
import { colors, REEL } from "../../brand/tokens";
import { fonts } from "../../brand/fonts";
import { engineData, lessonColors, type EngineKind } from "./data";
import { fade, fadeOut, holdFade, pop, qEase, rise } from "./timing";

export const SAFE_X = 80;
export const TOP_Y = 54;
export const CONTENT_TOP = 235;
export const CONTENT_BOTTOM = 1680;

const baseText: React.CSSProperties = {
    margin: 0,
    letterSpacing: 0,
};

export const SceneShell: React.FC<{
    children: React.ReactNode;
    title?: string;
    active?: EngineKind | null;
    showProgress?: boolean;
}> = ({ children, title, active = null, showProgress = true }) => {
    return (
        <AbsoluteFill>
            <PaperBackground />
            {showProgress ? <ProgressStrip active={active} /> : null}
            {title && !showProgress ? <SceneTitle title={title} /> : null}
            {children}
        </AbsoluteFill>
    );
};

export const SceneTitle: React.FC<{ title: string }> = ({ title }) => {
    const frame = useCurrentFrame();
    return (
        <div
            style={{
                position: "absolute",
                left: SAFE_X,
                right: SAFE_X,
                top: showProgressOffset(),
                opacity: fade(frame, 4),
                transform: `translateY(${rise(frame, 4, 18)}px)`,
                fontFamily: fonts.mono,
                color: colors.accent,
                fontSize: 30,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0,
            }}
        >
            {title}
        </div>
    );
};

const showProgressOffset = () => 218;

export const ProgressStrip: React.FC<{ active: EngineKind | null }> = ({ active }) => {
    const frame = useCurrentFrame();
    return (
        <div
            style={{
                position: "absolute",
                top: TOP_Y,
                left: SAFE_X,
                right: SAFE_X,
                opacity: fade(frame, 0, 20),
            }}
        >
            <div
                style={{
                    fontFamily: fonts.mono,
                    color: colors.accent,
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: 0,
                    marginBottom: 10,
                }}
            >
                محركات النمو
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {(["sticky", "viral", "paid"] as EngineKind[]).map((kind) => {
                    const data = engineData[kind];
                    const lit = active === kind;
                    return (
                        <div
                            key={kind}
                            style={{
                                border: `3px solid ${lit ? data.color : lessonColors.softLine}`,
                                background: lit ? `${data.color}22` : "rgba(255,255,255,0.02)",
                                color: lit ? data.color : colors.mute2,
                                borderRadius: 6,
                                padding: "12px 16px 11px",
                                minHeight: 78,
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: fonts.display,
                                    fontSize: 32,
                                    fontWeight: 800,
                                    lineHeight: 0.95,
                                }}
                            >
                                {data.label}
                            </div>
                            <div
                                style={{
                                    marginTop: 7,
                                    fontFamily: fonts.mono,
                                    fontSize: 19,
                                    fontWeight: 600,
                                    letterSpacing: 2,
                                }}
                            >
                                {data.shortRule}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const BusinessSelector: React.FC<{
    subscriptionAt: number;
    socialAt: number;
    productAt: number;
    pickAt: number;
}> = ({ subscriptionAt, socialAt, productAt, pickAt }) => {
    const frame = useCurrentFrame();
    const cards = [
        { label: "اشتراك", brand: "Spotify", rule: "يفضل", color: engineData.sticky.color, at: subscriptionAt, kind: "card" },
        { label: "تطبيق اجتماعي", brand: "TikTok", rule: "يشارك", color: engineData.viral.color, at: socialAt, kind: "nodes" },
        { label: "متجر منتجات", brand: "Amazon", rule: "يرجع فلوسه", color: engineData.paid.color, at: productAt, kind: "box" },
    ];
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(80 360)">
                {cards.map((card, index) => {
                    const x = index * 320;
                    const enter = fade(frame, card.at, 14);
                    const lift = rise(frame, card.at, 22);
                    return (
                        <g key={card.label} opacity={enter} transform={`translate(${x} ${lift})`}>
                            <rect width="285" height="450" rx="14" fill={`${card.color}16`} stroke={card.color} strokeWidth="5" />
                            <text x="142" y="60" textAnchor="middle" fontFamily={fonts.display} fontSize="24" fontWeight="850" fill={card.color}>{card.label}</text>
                            <BusinessIcon kind={card.kind} color={card.color} x={142} y={170} />
                            <rect x="30" y="275" width="225" height="68" rx="6" fill={`${card.color}28`} stroke={card.color} strokeWidth="3" />
                            <text x="142" y="320" textAnchor="middle" fontFamily={fonts.display} fontSize="34" fontWeight="850" fill={card.color}>{card.brand}</text>
                            <text x="142" y="408" textAnchor="middle" fontFamily={fonts.display} fontSize="44" fontWeight="850" fill={colors.ink}>{card.rule}</text>
                        </g>
                    );
                })}
                <g opacity={fade(frame, pickAt, 14)}>
                    <path d="M 110 540 C 250 640, 690 640, 830 540" fill="none" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" strokeDasharray="18 16" />
                    <rect x="55" y="720" width="810" height="150" rx="12" fill={`${colors.accent}18`} stroke={colors.accent} strokeWidth="5" />
                    <text x="460" y="816" textAnchor="middle" fontFamily={fonts.display} fontSize="58" fontWeight="850" fill={colors.accent}>اختار المحرك</text>
                </g>
            </g>
        </svg>
    );
};

const BusinessIcon: React.FC<{ kind: string; color: string; x: number; y: number }> = ({ kind, color, x, y }) => {
    if (kind === "nodes") {
        return (
            <g transform={`translate(${x} ${y})`}>
                {[[-58, -35], [0, -68], [62, -25], [-30, 38], [42, 48]].map(([dx, dy], index) => (
                    <g key={index}>
                        <circle cx={dx} cy={dy} r="22" fill={color} />
                    </g>
                ))}
                <path d="M -58 -35 L 0 -68 L 62 -25 M -58 -35 L -30 38 L 42 48 L 62 -25" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
            </g>
        );
    }
    if (kind === "box") {
        return (
            <g transform={`translate(${x - 70} ${y - 62})`}>
                <path d="M 0 35 L 70 0 L 140 35 L 70 72 Z" fill={`${color}44`} stroke={color} strokeWidth="6" />
                <path d="M 0 35 L 0 115 L 70 154 L 70 72 Z" fill={`${color}22`} stroke={color} strokeWidth="6" />
                <path d="M 140 35 L 140 115 L 70 154 L 70 72 Z" fill={`${color}33`} stroke={color} strokeWidth="6" />
            </g>
        );
    }
    return (
        <g transform={`translate(${x - 70} ${y - 70})`}>
            <rect x="0" y="0" width="140" height="160" rx="18" fill={`${color}22`} stroke={color} strokeWidth="6" />
            <line x1="28" y1="48" x2="112" y2="48" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <line x1="28" y1="82" x2="100" y2="82" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
            <circle cx="70" cy="124" r="18" fill={color} />
        </g>
    );
};

export const EngineGaugeDashboard: React.FC<{
    stickyAt: number;
    viralAt: number;
    paidAt: number;
    testAt: number;
}> = ({ stickyAt, viralAt, paidAt, testAt }) => {
    const frame = useCurrentFrame();
    const panels: Array<{ kind: EngineKind; at: number; brand: string }> = [
        { kind: "sticky", at: stickyAt, brand: "SPOTIFY" },
        { kind: "viral", at: viralAt, brand: "TIKTOK" },
        { kind: "paid", at: paidAt, brand: "SHOPIFY ADS" },
    ];
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(80 360)">
                {panels.map((panel, index) => {
                    const data = engineData[panel.kind];
                    const x = index * 320;
                    const draw = fade(frame, panel.at, 18);
                    return (
                        <g key={panel.kind} opacity={draw} transform={`translate(${x} ${rise(frame, panel.at, 22)})`}>
                            <rect width="285" height="690" rx="14" fill={`${data.color}13`} stroke={data.color} strokeWidth="5" />
                            <text x="142" y="68" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="850" fill={data.color}>{data.label}</text>
                            <g transform="translate(142 320)">
                                <EngineTestDiagram kind={panel.kind} startAt={panel.at + 10} />
                            </g>
                            <rect x="22" y="500" width="241" height="68" rx="6" fill={`${data.color}28`} stroke={data.color} strokeWidth="3" />
                            <text x="142" y="547" textAnchor="middle" fontFamily={fonts.mono} fontSize="30" fontWeight="700" fill={data.color} letterSpacing="2">{data.shortRule}</text>
                            <text x="142" y="618" textAnchor="middle" fontFamily={fonts.display} fontSize="28" fontWeight="850" fill={colors.mute}>زي</text>
                            <text x="142" y="657" textAnchor="middle" fontFamily={fonts.display} fontSize="32" fontWeight="850" fill={colors.ink}>{panel.brand}</text>
                        </g>
                    );
                })}
                <g opacity={fade(frame, testAt, 14)}>
                    <rect x="30" y="760" width="860" height="118" rx="12" fill={`${colors.accent}14`} stroke={colors.accent} strokeWidth="5" />
                    <text x="460" y="836" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="850" fill={colors.accent}>اختبار واحد لكل محرك.</text>
                </g>
            </g>
        </svg>
    );
};

const EngineTestDiagram: React.FC<{ kind: EngineKind; startAt: number }> = ({ kind, startAt }) => {
    const frame = useCurrentFrame();
    const data = engineData[kind];
    if (kind === "sticky") {
        // Tilting scale: NEW pan heavier than CHURN pan
        const tilt = interpolate(frame - startAt, [0, 30], [0, -10], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: qEase,
        });
        return (
            <g>
                <line x1="0" y1="-90" x2="0" y2="60" stroke={data.color} strokeWidth="8" strokeLinecap="round" />
                <g transform={`rotate(${tilt})`}>
                    <line x1="-110" y1="-80" x2="110" y2="-80" stroke={data.color} strokeWidth="8" strokeLinecap="round" />
                    <g transform="translate(-110 -80)" opacity={fade(frame, startAt, 14)}>
                        <line x1="0" y1="0" x2="-30" y2="40" stroke={data.color} strokeWidth="5" />
                        <line x1="0" y1="0" x2="30" y2="40" stroke={data.color} strokeWidth="5" />
                        <rect x="-50" y="40" width="100" height="50" rx="6" fill={`${data.color}30`} stroke={data.color} strokeWidth="5" />
                        <text x="0" y="75" textAnchor="middle" fontFamily={fonts.mono} fontSize="26" fontWeight="700" fill={data.color}>NEW</text>
                    </g>
                    <g transform="translate(110 -80)" opacity={fade(frame, startAt + 8, 14)}>
                        <line x1="0" y1="0" x2="-22" y2="30" stroke={colors.neg} strokeWidth="5" />
                        <line x1="0" y1="0" x2="22" y2="30" stroke={colors.neg} strokeWidth="5" />
                        <rect x="-38" y="30" width="76" height="40" rx="6" fill={`${colors.neg}30`} stroke={colors.neg} strokeWidth="5" />
                        <text x="0" y="60" textAnchor="middle" fontFamily={fonts.mono} fontSize="22" fontWeight="700" fill={colors.neg}>CHURN</text>
                    </g>
                </g>
                <polygon points="-22,60 22,60 0,90" fill={data.color} />
            </g>
        );
    }
    if (kind === "viral") {
        // Branching tree 1->2->4
        const showRow1 = fade(frame, startAt + 4, 10);
        const showRow2 = fade(frame, startAt + 18, 10);
        const showRow3 = fade(frame, startAt + 32, 10);
        const dot = (cx: number, cy: number, op: number) => (
            <circle cx={cx} cy={cy} r="14" fill={data.color} opacity={op} />
        );
        return (
            <g>
                {dot(0, -80, showRow1)}
                <line x1="0" y1="-66" x2="-50" y2="-30" stroke={data.color} strokeWidth="4" opacity={showRow2} />
                <line x1="0" y1="-66" x2="50" y2="-30" stroke={data.color} strokeWidth="4" opacity={showRow2} />
                {dot(-50, -16, showRow2)}
                {dot(50, -16, showRow2)}
                <line x1="-50" y1="-2" x2="-90" y2="38" stroke={data.color} strokeWidth="4" opacity={showRow3} />
                <line x1="-50" y1="-2" x2="-20" y2="38" stroke={data.color} strokeWidth="4" opacity={showRow3} />
                <line x1="50" y1="-2" x2="20" y2="38" stroke={data.color} strokeWidth="4" opacity={showRow3} />
                <line x1="50" y1="-2" x2="90" y2="38" stroke={data.color} strokeWidth="4" opacity={showRow3} />
                {dot(-90, 52, showRow3)}
                {dot(-20, 52, showRow3)}
                {dot(20, 52, showRow3)}
                {dot(90, 52, showRow3)}
            </g>
        );
    }
    // paid: $40 in -> 1 person -> $120 out
    const pulse = (frame - startAt) % 50;
    return (
        <g>
            <g opacity={fade(frame, startAt, 12)}>
                <circle cx="-100" cy="-30" r="30" fill={`${colors.neg}33`} stroke={colors.neg} strokeWidth="5" />
                <text x="-100" y="-21" textAnchor="middle" fontFamily={fonts.display} fontSize="22" fontWeight="850" fill={colors.neg}>$40</text>
                <line x1="-66" y1="-30" x2="-30" y2="-30" stroke={data.color} strokeWidth="5" strokeLinecap="round" strokeDasharray="6 6" />
                <circle cx="0" cy="-30" r="22" fill={data.color} />
                <rect x="-16" y="-12" width="32" height="34" rx="12" fill={data.color} />
                <line x1="30" y1="-30" x2="66" y2="-30" stroke={lessonColors.success} strokeWidth="5" strokeLinecap="round" strokeDasharray="6 6" />
                <circle cx="100" cy="-30" r="30" fill={`${lessonColors.success}33`} stroke={lessonColors.success} strokeWidth="5" />
                <text x="100" y="-19" textAnchor="middle" fontFamily={fonts.display} fontSize="20" fontWeight="850" fill={lessonColors.success}>$120</text>
            </g>
            <g opacity={fade(frame, startAt + 18, 14)}>
                <text x="0" y="40" textAnchor="middle" fontFamily={fonts.mono} fontSize="22" fontWeight="700" fill={colors.mute} letterSpacing="2">SPEND</text>
                <text x="-100" y="40" textAnchor="middle" fontFamily={fonts.mono} fontSize="18" fontWeight="700" fill={colors.neg}>IN</text>
                <text x="100" y="40" textAnchor="middle" fontFamily={fonts.mono} fontSize="18" fontWeight="700" fill={lessonColors.success}>OUT</text>
                <circle cx={-100 + (pulse / 50) * 200} cy="68" r="6" fill={data.color} opacity={0.7} />
            </g>
        </g>
    );
};

export const BigStatement: React.FC<{
    children: React.ReactNode;
    at?: number;
    top: number;
    color?: string;
    size?: number;
    align?: "left" | "center";
    italic?: boolean;
}> = ({ children, at = 0, top, color = colors.ink, size = 92, align = "left", italic = false }) => {
    const frame = useCurrentFrame();
    return (
        <div
            style={{
                ...baseText,
                position: "absolute",
                left: SAFE_X,
                right: SAFE_X,
                top,
                opacity: fade(frame, at, 18),
                transform: `translateY(${rise(frame, at, 24)}px)`,
                color,
                fontFamily: italic ? fonts.body : fonts.display,
                fontStyle: italic ? "italic" : "normal",
                fontSize: size,
                fontWeight: italic ? 500 : 800,
                lineHeight: 0.98,
                textAlign: align,
            }}
        >
            {children}
        </div>
    );
};

export const ExplainerLine: React.FC<{
    children: React.ReactNode;
    at?: number;
    top: number;
    color?: string;
    size?: number;
    align?: "left" | "center";
}> = ({ children, at = 0, top, color = colors.mute, size = 46, align = "center" }) => {
    const frame = useCurrentFrame();
    return (
        <div
            style={{
                ...baseText,
                position: "absolute",
                left: SAFE_X,
                right: SAFE_X,
                top,
                opacity: fade(frame, at, 16),
                transform: `translateY(${rise(frame, at, 14)}px)`,
                color,
                fontFamily: fonts.body,
                fontSize: size,
                fontStyle: "italic",
                fontWeight: 500,
                lineHeight: 1.08,
                textAlign: align,
            }}
        >
            {children}
        </div>
    );
};

export const LessonBand: React.FC<{
    children: React.ReactNode;
    at?: number;
    color?: string;
    top?: number;
    size?: number;
}> = ({ children, at = 0, color = colors.ink, top = 1535, size = 54 }) => {
    const frame = useCurrentFrame();
    return (
        <div
            style={{
                position: "absolute",
                left: SAFE_X,
                right: SAFE_X,
                top,
                minHeight: 230,
                border: `3px solid ${lessonColors.softLine}`,
                background: "rgba(255,255,255,0.025)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 42px",
                boxSizing: "border-box",
                opacity: fade(frame, at, 16),
                transform: `translateY(${rise(frame, at, 16)}px)`,
                color,
                fontFamily: fonts.display,
                fontSize: size,
                fontWeight: 850,
                lineHeight: 1.04,
                textAlign: "center",
            }}
        >
            {children}
        </div>
    );
};

export const Pill: React.FC<{
    children: React.ReactNode;
    color?: string;
    fontSize?: number;
}> = ({ children, color = colors.accent, fontSize = 34 }) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 58,
            padding: "10px 20px",
            border: `3px solid ${color}`,
            background: `${color}22`,
            color,
            borderRadius: 6,
            fontFamily: fonts.mono,
            fontSize,
            fontWeight: 600,
            letterSpacing: 1,
            whiteSpace: "nowrap",
        }}
    >
        {children}
    </div>
);

export const EngineTile: React.FC<{
    kind: EngineKind;
    active?: boolean;
    at?: number;
    style?: React.CSSProperties;
}> = ({ kind, active = false, at = 0, style }) => {
    const frame = useCurrentFrame();
    const data = engineData[kind];
    return (
        <div
            style={{
                position: "absolute",
                opacity: fade(frame, at, 16),
                transform: `translateY(${rise(frame, at, 18)}px) scale(${active ? 1 : 0.96})`,
                border: `4px solid ${active ? data.color : lessonColors.softLine}`,
                background: active ? `${data.color}22` : "rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: 28,
                boxSizing: "border-box",
                ...style,
            }}
        >
            <div
                style={{
                    fontFamily: fonts.display,
                    color: active ? data.color : colors.mute,
                    fontSize: 62,
                    lineHeight: 0.94,
                    fontWeight: 850,
                }}
            >
                {data.label}
            </div>
            <div
                style={{
                    marginTop: 16,
                    fontFamily: fonts.body,
                    color: colors.ink,
                    fontSize: 34,
                    lineHeight: 1.1,
                }}
            >
                {data.question}
            </div>
            <div style={{ marginTop: 18 }}>
                <Pill color={data.color} fontSize={27}>{data.longRule}</Pill>
            </div>
        </div>
    );
};

export const Wheel: React.FC<{
    cx: number;
    cy: number;
    r: number;
    at?: number;
    jamAt?: number;
    spin?: boolean;
    color?: string;
}> = ({ cx, cy, r, at = 0, jamAt, spin = false, color = colors.ink }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = pop(frame, at, fps);
    const spinAngle = spin ? frame * 2.2 : 0;
    const jam = jamAt == null ? 0 : fade(frame, jamAt, 8);
    const shudder = jam > 0 && jam < 1 ? Math.sin(frame * 1.9) * 8 : 0;
    return (
        <svg
            viewBox="0 0 1080 1920"
            style={{ position: "absolute", inset: 0, opacity: fade(frame, at, 12) }}
        >
            <g transform={`translate(${cx + shudder}, ${cy}) scale(${enter})`}>
                <g transform={`rotate(${spinAngle})`}>
                    <circle cx={0} cy={0} r={r} fill="none" stroke={jam ? colors.neg : color} strokeWidth={8} />
                    <circle cx={0} cy={0} r={r * 0.14} fill={jam ? colors.neg : color} />
                    {[0, 60, 120, 180, 240, 300].map((angle) => {
                        const rad = (angle * Math.PI) / 180;
                        return (
                            <line
                                key={angle}
                                x1={Math.cos(rad) * r * 0.18}
                                y1={Math.sin(rad) * r * 0.18}
                                x2={Math.cos(rad) * (r - 16)}
                                y2={Math.sin(rad) * (r - 16)}
                                stroke={jam ? colors.neg : color}
                                strokeWidth={7}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </g>
                {jam > 0.2 ? (
                    <g opacity={jam}>
                        <line x1={-r * 0.55} y1={-r * 0.55} x2={r * 0.55} y2={r * 0.55} stroke={colors.neg} strokeWidth={14} strokeLinecap="round" />
                        <line x1={r * 0.55} y1={-r * 0.55} x2={-r * 0.55} y2={r * 0.55} stroke={colors.neg} strokeWidth={14} strokeLinecap="round" />
                    </g>
                ) : null}
            </g>
        </svg>
    );
};

export const CustomerToken: React.FC<{
    x: number;
    y: number;
    color?: string;
    label?: string;
    at?: number;
    scale?: number;
}> = ({ x, y, color = colors.ink, label, at = 0, scale = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = pop(frame, at, fps) * scale;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 110,
                height: 140,
                marginLeft: -55,
                marginTop: -70,
                opacity: fade(frame, at, 12),
                transform: `scale(${s})`,
                transformOrigin: "center",
            }}
        >
            <svg viewBox="0 0 110 140" width="110" height="140">
                <circle cx="55" cy="30" r="22" fill={color} />
                <rect x="28" y="58" width="54" height="64" rx="22" fill={color} />
            </svg>
            {label ? (
                <div
                    style={{
                        position: "absolute",
                        top: 125,
                        left: -60,
                        width: 230,
                        textAlign: "center",
                        fontFamily: fonts.mono,
                        fontSize: 24,
                        fontWeight: 600,
                        color,
                    }}
                >
                    {label}
                </div>
            ) : null}
        </div>
    );
};

export const BucketModel: React.FC<{
    at: number;
    joinAt: number;
    churnAt: number;
    successAt: number;
}> = ({ at, joinAt, churnAt, successAt }) => {
    const frame = useCurrentFrame();
    const color = engineData.sticky.color;
    const fillLevel = interpolate(frame - joinAt, [0, 45], [0.34, 0.76], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });
    const leak = fade(frame, churnAt, 12);
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: fade(frame, at, 14) }}>
            <g transform="translate(88 335)">
                <text x="0" y="-46" fontFamily={fonts.display} fontSize="72" fontWeight="850" fill={color}>STICKY</text>
                <text x="0" y="12" fontFamily={fonts.body} fontSize="42" fontStyle="italic" fill={colors.mute}>عملاء يفضلوا ويدفعوا تاني</text>
                <g transform="translate(55 185)">
                    <PillSvg x={0} y={-120} width={390} color={color} text="عملاء جداد داخلين" />
                    <line x1="195" y1="-60" x2="195" y2="25" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray="14 10" opacity={fade(frame, joinAt, 12)} />
                    <text x="430" y="-78" fontFamily={fonts.mono} fontSize="48" fontWeight="700" fill={lessonColors.success} opacity={fade(frame, joinAt, 12)}>+20</text>
                    <path d="M 20 40 L 390 40 L 350 560 L 60 560 Z" fill="none" stroke={colors.ink} strokeWidth="7" />
                    <clipPath id="bucketClip">
                        <path d="M 28 46 L 382 46 L 344 552 L 66 552 Z" />
                    </clipPath>
                    <rect x="28" y={552 - 506 * fillLevel} width="354" height={506 * fillLevel} fill={color} opacity="0.72" clipPath="url(#bucketClip)" />
                    <text x="205" y="305" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="800" fill={colors.ink}>عملاء</text>
                    <text x="205" y="360" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="800" fill={colors.ink}>لسه بيدفعوا</text>
                    <circle cx="80" cy="520" r="10" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
                    <circle cx="315" cy="500" r="10" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
                    <PillSvg x={440} y={430} width={320} color={colors.neg} text="CHURN / إلغاء" opacity={leak} />
                    <text x="785" y="480" fontFamily={fonts.mono} fontSize="46" fontWeight="700" fill={colors.neg} opacity={leak}>-8</text>
                    {[0, 1, 2].map((i) => (
                        <circle
                            key={i}
                            cx={80 + i * 118}
                            cy={560 + ((frame - churnAt + i * 8) % 38)}
                            r="7"
                            fill={colors.mute}
                            opacity={leak * 0.8}
                        />
                    ))}
                </g>
                <InequalitySvg x={0} y={880} left="20 داخلين" right="8 churn" color={lessonColors.success} at={successAt} />
            </g>
        </svg>
    );
};

const PillSvg: React.FC<{
    x: number;
    y: number;
    width: number;
    color: string;
    text: string;
    opacity?: number;
}> = ({ x, y, width, color, text, opacity = 1 }) => (
    <g opacity={opacity}>
        <rect x={x} y={y} width={width} height="70" rx="6" fill={`${color}22`} stroke={color} strokeWidth="4" />
        <text x={x + width / 2} y={y + 47} textAnchor="middle" fontFamily={fonts.mono} fontSize="31" fontWeight="700" fill={color}>{text}</text>
    </g>
);

const InequalitySvg: React.FC<{
    x: number;
    y: number;
    left: string;
    right: string;
    color: string;
    at: number;
}> = ({ x, y, left, right, color, at }) => {
    const frame = useCurrentFrame();
    return (
        <g opacity={fade(frame, at, 14)}>
            <rect x={x} y={y} width="920" height="104" rx="8" fill={`${color}22`} stroke={color} strokeWidth="4" />
            <text x={x + 460} y={y + 68} textAnchor="middle" fontFamily={fonts.display} fontSize="58" fontWeight="850" fill={color}>{left} &gt; {right}</text>
        </g>
    );
};

export const RecurringRevenueStack: React.FC<{
    introAt: number;
    mrrAt: number;
    millionAt: number;
    arrAt: number;
    churnAt: number;
}> = ({ introAt, mrrAt, millionAt, arrAt, churnAt }) => {
    const frame = useCurrentFrame();
    const magenta = engineData.sticky.color;
    const green = lessonColors.success;
    const red = colors.neg;
    const dots = Array.from({ length: 10 });

    const stageMillion = frame >= millionAt;
    const stageMrr = frame >= mrrAt;
    const userLabel = stageMillion ? "1,000,000 مستخدم" : stageMrr ? "10 مستخدمين" : "0 مستخدم";
    const mrrLabel = stageMillion ? "$10M" : stageMrr ? "$100" : "$0";
    const arrLabel = stageMillion ? "$120M / YEAR" : "$1,200 / YEAR";

    const mrrTarget = stageMillion ? 280 : stageMrr ? 80 : 0;
    const mrrCurrent = interpolate(
        frame - (stageMillion ? millionAt : mrrAt),
        [0, 24],
        [stageMillion ? 80 : 0, mrrTarget],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: qEase }
    );

    const churnFade = fade(frame, churnAt, 14);
    const isChurned = (i: number) => churnFade > 0.5 && i === 0;

    const coinNodes = [0, 1, 2].map((k) => {
        const start = mrrAt + 6 + k * 12;
        const t = Math.max(0, Math.min(1, (frame - start) / 26));
        if (t <= 0 || t >= 1 || frame > arrAt - 10) return null;
        const sx = 110 + k * 70;
        const sy = 140;
        const ex = 740;
        const ey = 240;
        const cx = sx + t * (ex - sx);
        const cy = sy + t * (ey - sy) - Math.sin(t * Math.PI) * 80;
        return (
            <g key={k} opacity={1 - t * 0.2}>
                <circle cx={cx} cy={cy} r="16" fill={`${magenta}55`} stroke={magenta} strokeWidth="3" />
                <text x={cx} y={cy + 6} textAnchor="middle" fontFamily={fonts.display} fontSize="16" fontWeight="850" fill={magenta}>$10</text>
            </g>
        );
    });

    const arrBricks = Array.from({ length: 12 }).map((_, i) => {
        const show = fade(frame, arrAt + i * 5, 9);
        const dim = churnFade > 0.5 ? 0.55 : 1;
        const x = 60 + i * 64;
        return (
            <g key={i} opacity={show * dim}>
                <rect x={x} y="170" width="56" height="84" rx="6" fill={`${green}33`} stroke={green} strokeWidth="3" />
                <text x={x + 28} y="223" textAnchor="middle" fontFamily={fonts.mono} fontSize="20" fontWeight="700" fill={green}>M{i + 1}</text>
            </g>
        );
    });

    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g opacity={fade(frame, introAt, 12)}>
                <text x="540" y="270" textAnchor="middle" fontFamily={fonts.display} fontSize="84" fontWeight="850" fill={magenta}>MRR · ARR</text>
                <text x="540" y="320" textAnchor="middle" fontFamily={fonts.body} fontSize="32" fontStyle="italic" fill={colors.mute}>إيراد بيتكرر وبيكبر</text>
                <text x="540" y="358" textAnchor="middle" fontFamily={fonts.display} fontSize="24" fontWeight="850" fill={colors.mute2}>مثال: Spotify</text>
            </g>

            <g transform="translate(80 380)" opacity={fade(frame, mrrAt - 6, 12)}>
                <rect x="0" y="0" width="920" height="420" rx="16" fill={`${magenta}10`} stroke={magenta} strokeWidth="4" />
                <text x="30" y="50" fontFamily={fonts.display} fontSize="28" fontWeight="850" fill={colors.mute}>المستخدمين</text>
                <text x="890" y="50" textAnchor="end" fontFamily={fonts.mono} fontSize="24" fontWeight="700" fill={colors.mute} letterSpacing="3">MRR / MONTH</text>

                {dots.map((_, i) => {
                    const col = i % 5;
                    const row = Math.floor(i / 5);
                    const cx = 80 + col * 64;
                    const cy = 110 + row * 70;
                    const dotColor = isChurned(i) ? red : magenta;
                    return (
                        <g key={i}>
                            <circle cx={cx} cy={cy} r="22" fill={dotColor} opacity={stageMrr ? 1 : 0} />
                            {isChurned(i) ? (
                                <g stroke={red} strokeWidth="5" strokeLinecap="round">
                                    <line x1={cx - 16} y1={cy - 16} x2={cx + 16} y2={cy + 16} />
                                    <line x1={cx + 16} y1={cy - 16} x2={cx - 16} y2={cy + 16} />
                                </g>
                            ) : null}
                        </g>
                    );
                })}
                <text x="80" y="320" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={magenta}>{userLabel}</text>
                <text x="80" y="370" fontFamily={fonts.display} fontSize="26" fontWeight="850" fill={colors.mute}>$10 / شهر لكل واحد</text>

                {coinNodes}

                <rect x="620" y="120" width="240" height="280" rx="10" fill="rgba(255,255,255,0.04)" stroke={magenta} strokeWidth="4" />
                <rect x="620" y={120 + 280 - mrrCurrent} width="240" height={mrrCurrent} rx="10" fill={magenta} opacity="0.85" />
                <text x="740" y="110" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="850" fill={magenta}>{mrrLabel}</text>
            </g>

            <g transform="translate(80 830)" opacity={fade(frame, arrAt, 14)}>
                <rect x="0" y="0" width="920" height="370" rx="16" fill={`${green}10`} stroke={green} strokeWidth="4" />
                <text x="460" y="68" textAnchor="middle" fontFamily={fonts.display} fontSize="46" fontWeight="850" fill={green}>ARR = MRR × 12</text>
                <text x="460" y="108" textAnchor="middle" fontFamily={fonts.display} fontSize="28" fontWeight="850" fill={colors.mute}>12 شهر متراكمين</text>
                {arrBricks}
                <text x="460" y="320" textAnchor="middle" fontFamily={fonts.display} fontSize="56" fontWeight="850" fill={green} opacity={fade(frame, arrAt + 70, 14)}>{arrLabel}</text>
            </g>

            <g transform="translate(80 1240)" opacity={fade(frame, churnAt, 14)}>
                <rect x="0" y="0" width="920" height="220" rx="16" fill={`${red}10`} stroke={red} strokeWidth="4" />
                <text x="460" y="86" textAnchor="middle" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={red}>CHURN واحد = خسارة 12 شهر</text>
                <text x="460" y="148" textAnchor="middle" fontFamily={fonts.body} fontSize="28" fontStyle="italic" fill={colors.mute}>كل user بيفضل بيكبر السنة كلها</text>
                <text x="460" y="190" textAnchor="middle" fontFamily={fonts.display} fontSize="26" fontWeight="850" fill={colors.mute2}>Spotify · Netflix بيعيشوا على ده</text>
            </g>
        </svg>
    );
};

export const CalendarRevenue: React.FC<{
    at: number;
    cancelAt: number;
}> = ({ at, cancelAt }) => {
    const frame = useCurrentFrame();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
    const color = engineData.sticky.color;
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 410, opacity: fade(frame, at, 14) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 54 }}>
                <div style={{ width: 310, minHeight: 420, position: "relative" }}>
                    <div
                        style={{
                            width: 300,
                            minHeight: 110,
                            border: `4px solid ${color}`,
                            background: `${color}18`,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            color,
                            fontFamily: fonts.display,
                            fontSize: 56,
                            lineHeight: 1.0,
                            fontWeight: 850,
                            letterSpacing: 1,
                        }}
                    >
                        NETFLIX
                    </div>
                    <CustomerToken x={150} y={270} color={color} at={at + 8} label="$12 / month" />
                </div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {months.map((month, i) => {
                        const isFuture = i >= 3;
                        const reveal = fade(frame, at + 16 + i * 10, 10);
                        const cancelled = isFuture ? fade(frame, cancelAt + (i - 3) * 8, 10) : 0;
                        const border = cancelled ? colors.neg : color;
                        return (
                            <div
                                key={month}
                                style={{
                                    minHeight: 132,
                                    border: `4px solid ${border}`,
                                    background: cancelled ? `${colors.neg}22` : `${color}22`,
                                    borderRadius: 8,
                                    opacity: Math.max(reveal, cancelled),
                                    padding: 12,
                                    boxSizing: "border-box",
                                }}
                            >
                                <div style={{ fontFamily: fonts.mono, fontSize: 28, color: colors.mute, fontWeight: 600 }}>{month}</div>
                                <div style={{ fontFamily: fonts.display, fontSize: cancelled ? 38 : 50, fontWeight: 850, color: border, lineHeight: 1.1 }}>
                                    {cancelled ? "missed" : "$12"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div
                style={{
                    opacity: fade(frame, cancelAt, 12),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 22,
                }}
            >
                <Pill color={colors.neg} fontSize={36}>CANCEL IN MARCH</Pill>
                <Pill color={colors.neg} fontSize={36}>FUTURE MONTHS DISAPPEAR</Pill>
            </div>
        </div>
    );
};

export const BranchingUsers: React.FC<{
    at: number;
    redAt: number;
}> = ({ at, redAt }) => {
    const frame = useCurrentFrame();
    const magenta = engineData.viral.color;
    const green = lessonColors.success;
    const red = colors.neg;
    const redMode = fade(frame, redAt, 12);
    const color = redMode > 0.4 ? red : magenta;
    const generations = [1, 2, 4, 8, 16];
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: fade(frame, at, 12) }}>
            <g transform="translate(80 350)">
                <text x="0" y="0" fontFamily={fonts.display} fontSize="76" fontWeight="850" fill={magenta}>VIRAL</text>
                <text x="0" y="60" fontFamily={fonts.body} fontSize="42" fontStyle="italic" fill={colors.mute}>مستخدمين يجيبوا مستخدمين</text>
                <PillSvg x={0} y={120} width={650} color={magenta} text="K = مستخدمين جداد من كل مستخدم" />
                {generations.map((count, gen) => {
                    const show = fade(frame, at + 30 + gen * 20, 12) * (1 - redMode * (gen > 1 ? 0.85 : 0));
                    const y = 285 + gen * 125;
                    const width = Math.min(850, Math.max(1, count - 1) * 68);
                    const startX = 460 - width / 2;
                    return (
                        <g key={gen} opacity={show}>
                            {Array.from({ length: count }).map((_, i) => {
                                const x = count === 1 ? 460 : startX + i * (width / (count - 1));
                                return <UserDot key={i} x={x} y={y} color={color} />;
                            })}
                            <text x="930" y={y + 16} fontFamily={fonts.mono} fontSize="42" fontWeight="700" fill={color}>{count}</text>
                        </g>
                    );
                })}
                <g opacity={fade(frame, redAt, 12)}>
                    <rect x="0" y="860" width="920" height="104" rx="8" fill={`${red}22`} stroke={red} strokeWidth="4" />
                    <text x="460" y="928" textAnchor="middle" fontFamily={fonts.display} fontSize="58" fontWeight="850" fill={red}>K = 0.6، السلسلة بتضعف</text>
                </g>
                <g opacity={fade(frame, at + 72, 12) * (1 - redMode)}>
                    <rect x="0" y="860" width="920" height="104" rx="8" fill={`${green}22`} stroke={green} strokeWidth="4" />
                    <text x="460" y="928" textAnchor="middle" fontFamily={fonts.display} fontSize="58" fontWeight="850" fill={green}>K = 1.3، الجمهور بيتضاعف</text>
                </g>
            </g>
        </svg>
    );
};

const UserDot: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
    <g transform={`translate(${x} ${y})`}>
        <circle cx="0" cy="0" r="22" fill={color} />
        <rect x="-18" y="24" width="36" height="34" rx="15" fill={color} />
    </g>
);

export const AudiencePanels: React.FC<{
    at: number;
    buyerAt: number;
}> = ({ at, buyerAt }) => {
    const frame = useCurrentFrame();
    const magenta = engineData.viral.color;
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 450, opacity: fade(frame, at, 14) }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
                <AudienceBox title="SMALL AUDIENCE" count="120 users" color={colors.neg} density={28} at={at + 12} />
                <AudienceBox title="LARGE AUDIENCE" count="1,200,000 users" color={magenta} density={110} at={at + 36} />
            </div>
            <div style={{ marginTop: 46, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, opacity: fade(frame, buyerAt - 20, 14) }}>
                {["USERS", "ATTENTION", "PLATFORM", "PAYING SIDE"].map((label, i) => (
                    <div key={label} style={{ minHeight: 104, border: `3px solid ${i === 3 ? lessonColors.success : magenta}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: i === 3 ? lessonColors.success : magenta, fontFamily: fonts.mono, fontSize: 28, fontWeight: 700, textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
                        {label}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 34, display: "flex", justifyContent: "center", opacity: fade(frame, buyerAt, 14) }}>
                <Pill color={lessonColors.success} fontSize={38}>the audience creates the value</Pill>
            </div>
        </div>
    );
};

export const AudienceEconomy: React.FC<{
    whyAt: number;
    accessAt: number;
    buyersAt: number;
    sellersAt: number;
    mediaAt: number;
    sponsorsAt: number;
    productAt: number;
}> = ({ whyAt, accessAt, buyersAt, sellersAt, mediaAt, sponsorsAt, productAt }) => {
    const frame = useCurrentFrame();
    const magenta = engineData.viral.color;
    const buyerDots = Array.from({ length: 14 });
    const attentionDots = Array.from({ length: 28 });
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(80 285)" opacity={fade(frame, whyAt, 12)}>
                <text x="460" y="0" textAnchor="middle" fontFamily={fonts.display} fontSize="74" fontWeight="850" fill={colors.accent}>ليه الجمهور؟</text>
                <g opacity={fade(frame, accessAt, 12)}>
                    <rect x="60" y="55" width="820" height="86" rx="10" fill={`${magenta}18`} stroke={magenta} strokeWidth="4" />
                    <text x="470" y="112" textAnchor="middle" fontFamily={fonts.display} fontSize="46" fontWeight="850" fill={magenta}>بتبيع وصول للجمهور</text>
                </g>
                <g transform="translate(0 195)">
                    <text x="0" y="0" fontFamily={fonts.display} fontSize="32" fontWeight="850" fill={magenta}>سوق</text>
                    <text x="918" y="0" textAnchor="end" fontFamily={fonts.mono} fontSize="24" fontWeight="600" fill={colors.mute} letterSpacing="3">AMAZON · ETSY</text>
                    <rect x="0" y="30" width="410" height="360" rx="12" fill={`${magenta}12`} stroke={magenta} strokeWidth="4" />
                    <rect x="510" y="30" width="410" height="360" rx="12" fill={`${lessonColors.success}12`} stroke={lessonColors.success} strokeWidth="4" />
                    <text x="205" y="86" textAnchor="middle" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={colors.ink}>مشترين</text>
                    <text x="715" y="86" textAnchor="middle" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={colors.ink}>بائعين</text>
                    {buyerDots.map((_, i) => {
                        const col = i % 5;
                        const row = Math.floor(i / 5);
                        return <circle key={i} cx={92 + col * 58} cy={155 + row * 58} r="17" fill={magenta} opacity={fade(frame, buyersAt + i * 3, 8)} />;
                    })}
                    {[0, 1, 2, 3].map((i) => (
                        <g key={i} transform={`translate(${595 + i * 72} ${165 + (i % 2) * 70})`} opacity={fade(frame, sellersAt + i * 6, 10)}>
                            <rect x="0" y="0" width="58" height="74" rx="8" fill={lessonColors.success} />
                            <line x1="12" y1="24" x2="46" y2="24" stroke={colors.paper} strokeWidth="6" strokeLinecap="round" />
                            <line x1="12" y1="44" x2="40" y2="44" stroke={colors.paper} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
                        </g>
                    ))}
                    <path d="M 412 215 C 446 190, 468 190, 486 215" fill="none" stroke={lessonColors.success} strokeWidth="8" strokeLinecap="round" opacity={fade(frame, sellersAt, 10)} />
                    <polygon points="510,215 486,201 486,229" fill={lessonColors.success} opacity={fade(frame, sellersAt, 10)} />
                </g>
                <g transform="translate(0 660)" opacity={fade(frame, mediaAt, 12)}>
                    <text x="0" y="0" fontFamily={fonts.display} fontSize="32" fontWeight="850" fill={magenta}>تطبيق ميديا</text>
                    <text x="918" y="0" textAnchor="end" fontFamily={fonts.mono} fontSize="24" fontWeight="600" fill={colors.mute} letterSpacing="3">YOUTUBE</text>
                    <rect x="0" y="30" width="590" height="320" rx="14" fill={`${magenta}14`} stroke={magenta} strokeWidth="4" />
                    {attentionDots.map((_, i) => {
                        const x = 55 + (i % 7) * 76;
                        const y = 95 + Math.floor(i / 7) * 58;
                        return <circle key={i} cx={x} cy={y} r="13" fill={magenta} opacity={fade(frame, mediaAt + i * 2, 7)} />;
                    })}
                    <text x="295" y="305" textAnchor="middle" fontFamily={fonts.display} fontSize="28" fontWeight="850" fill={magenta}>مشاهدين / attention</text>
                    <g transform="translate(660 70)" opacity={fade(frame, sponsorsAt, 12)}>
                        <rect x="0" y="0" width="260" height="170" rx="12" fill={`${lessonColors.success}20`} stroke={lessonColors.success} strokeWidth="5" />
                        <text x="130" y="72" textAnchor="middle" fontFamily={fonts.display} fontSize="46" fontWeight="850" fill={lessonColors.success}>معلن</text>
                        <text x="130" y="126" textAnchor="middle" fontFamily={fonts.display} fontSize="34" fontWeight="850" fill={lessonColors.success}>يدفع</text>
                    </g>
                    <path d="M 590 195 C 630 150, 642 145, 660 140" fill="none" stroke={lessonColors.success} strokeWidth="8" strokeLinecap="round" opacity={fade(frame, sponsorsAt, 12)} />
                </g>
                <g opacity={fade(frame, productAt, 14)}>
                    <rect x="60" y="1080" width="820" height="110" rx="12" fill={`${magenta}20`} stroke={magenta} strokeWidth="5" />
                    <text x="470" y="1148" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="850" fill={magenta}>الجمهور هو المنتج.</text>
                </g>
            </g>
        </svg>
    );
};

const AudienceBox: React.FC<{
    title: string;
    count: string;
    color: string;
    density: number;
    at: number;
}> = ({ title, count, color, density, at }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ minHeight: 600, border: `4px solid ${color}`, borderRadius: 10, background: `${color}16`, padding: 30, opacity: fade(frame, at, 14), boxSizing: "border-box" }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 30, color, fontWeight: 700, letterSpacing: 2 }}>{title}</div>
            <div style={{ fontFamily: fonts.display, fontSize: 58, color: colors.ink, fontWeight: 850, marginTop: 12 }}>{count}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8, marginTop: 34 }}>
                {Array.from({ length: density }).map((_, i) => (
                    <div key={i} style={{ width: 21, height: 21, borderRadius: "50%", background: color, opacity: 0.8 }} />
                ))}
            </div>
        </div>
    );
};

export const LedgerVisual: React.FC<{
    at: number;
    lossAt: number;
}> = ({ at, lossAt }) => {
    const frame = useCurrentFrame();
    const gold = engineData.paid.color;
    const loss = fade(frame, lossAt, 14);
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 465, opacity: fade(frame, at, 14) }}>
            <div style={{ fontFamily: fonts.display, fontSize: 76, fontWeight: 850, color: gold, marginBottom: 34 }}>PAID</div>
            <LedgerRow label="CAC" desc="cost to get one customer" amount={loss ? "-$90" : "-$40"} color={colors.neg} at={at + 14} />
            <LedgerRow label="LTV" desc="value from that customer over time" amount={loss ? "+$60" : "+$120"} color={lessonColors.success} at={at + 42} />
            <div style={{ height: 5, background: lessonColors.softLine, margin: "30px 0" }} />
            <LedgerRow label={loss ? "LOSS" : "PROFIT"} desc={loss ? "buying more customers buys more losses" : "paid acquisition can scale"} amount={loss ? "-$30" : "+$80"} color={loss ? colors.neg : lessonColors.success} at={at + 70} size="large" />
            <div style={{ marginTop: 38, opacity: fade(frame, lossAt, 14) }}>
                <Pill color={colors.neg} fontSize={40}>if CAC is bigger than LTV, growth is buying losses</Pill>
            </div>
        </div>
    );
};

export const PaidMachine: React.FC<{
    at: number;
    cacAt: number;
    spendAt: number;
    customerAt: number;
    ltvAt: number;
    monthAt: number;
    scaleAt: number;
    lossAt: number;
}> = ({ at, cacAt, spendAt, customerAt, ltvAt, monthAt, scaleAt, lossAt }) => {
    const frame = useCurrentFrame();
    const gold = engineData.paid.color;
    const lossMode = fade(frame, lossAt, 22);
    const isLoss = lossMode > 0.5;
    const cacAmount = isLoss ? "$90" : "$40";
    const monthlyAmount = isLoss ? "$15" : "$30";
    const ltvAmount = isLoss ? "$60" : "$120";
    const verdictColor = isLoss ? colors.neg : lessonColors.success;
    const verdictWord = isLoss ? "خسارة" : "نكبر";
    const brand = isLoss ? "BAD FUNNEL" : "SHOPIFY + GOOGLE ADS";
    // running month index for the timeline
    const elapsed = frame - monthAt;
    const monthsShown = Math.max(0, Math.min(4, Math.floor(elapsed / 14) + 1));
    const totalAmount = isLoss ? monthsShown * 15 : monthsShown * 30;
    const totalFill = monthsShown / 4;

    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            {/* Title */}
            <g opacity={fade(frame, at, 12)}>
                <text x="540" y="275" textAnchor="middle" fontFamily={fonts.display} fontSize="76" fontWeight="850" fill={gold}>PAID</text>
                <text x="540" y="325" textAnchor="middle" fontFamily={fonts.body} fontSize="32" fontStyle="italic" fill={colors.mute}>تحويل الفلوس لعملاء مربحين</text>
                <text x="540" y="362" textAnchor="middle" fontFamily={fonts.display} fontSize="24" fontWeight="850" fill={colors.mute2}>مثال: {brand}</text>
            </g>

            {/* CAC SECTION */}
            <g opacity={fade(frame, cacAt, 14)}>
                <rect x="80" y="395" width="920" height="410" rx="14" fill={`${colors.neg}10`} stroke={colors.neg} strokeWidth="4" />
                <text x="540" y="445" textAnchor="middle" fontFamily={fonts.display} fontSize="40" fontWeight="850" fill={colors.neg}>CAC — تكلفة الاستحواذ على العميل</text>

                {/* SPEND label + coins falling */}
                <text x="180" y="500" fontFamily={fonts.mono} fontSize="22" fontWeight="700" fill={colors.neg} letterSpacing="3" opacity={fade(frame, spendAt, 10)}>صرف</text>
                {[0, 1, 2, 3].map((i) => {
                    const start = spendAt + i * 6;
                    const t = (frame - start) / 26;
                    const clamped = Math.max(0, Math.min(1, t));
                    const cy = 530 + clamped * 100;
                    const op = (frame >= start && frame <= start + 60) ? 1 : 0;
                    return (
                        <g key={i} opacity={op}>
                            <circle cx={170 + i * 50} cy={cy} r="24" fill={`${colors.neg}33`} stroke={colors.neg} strokeWidth="4" />
                            <text x={170 + i * 50} y={cy + 8} textAnchor="middle" fontFamily={fonts.display} fontSize="22" fontWeight="850" fill={colors.neg}>$10</text>
                        </g>
                    );
                })}

                {/* Funnel ADS */}
                <g transform="translate(440 540)">
                    <path d="M 0 0 L 220 0 L 174 110 L 46 110 Z" fill={`${gold}22`} stroke={gold} strokeWidth="6" />
                    <rect x="60" y="110" width="100" height="70" rx="10" fill={`${gold}22`} stroke={gold} strokeWidth="6" />
                    <text x="110" y="68" textAnchor="middle" fontFamily={fonts.display} fontSize="40" fontWeight="850" fill={gold}>ADS</text>
                </g>

                {/* Arrow + customer */}
                <path d="M 680 660 Q 760 686, 833 698" fill="none" stroke={gold} strokeWidth="7" strokeLinecap="round" opacity={fade(frame, customerAt, 10)} />
                <g transform="translate(852 702) rotate(22)" opacity={fade(frame, customerAt, 10)}>
                    <polygon points="0,0 -22,-10 -22,10" fill={gold} />
                </g>
                <g transform="translate(880 690)" opacity={fade(frame, customerAt, 12)}>
                    <circle cx="0" cy="0" r="26" fill={gold} />
                    <rect x="-30" y="34" width="60" height="72" rx="26" fill={gold} />
                    <text x="0" y="-42" textAnchor="middle" fontFamily={fonts.display} fontSize="28" fontWeight="850" fill={gold}>1 عميل</text>
                </g>

                {/* CAC total */}
                <g opacity={fade(frame, customerAt + 14, 12)}>
                    <rect x="120" y="700" width="220" height="86" rx="10" fill={`${colors.neg}18`} stroke={colors.neg} strokeWidth="4" />
                    <text x="230" y="738" textAnchor="middle" fontFamily={fonts.mono} fontSize="20" fontWeight="700" fill={colors.neg} letterSpacing="3">كاك</text>
                    <text x="230" y="775" textAnchor="middle" fontFamily={fonts.display} fontSize="38" fontWeight="850" fill={colors.neg}>{cacAmount}</text>
                </g>
            </g>

            {/* LTV SECTION */}
            <g opacity={fade(frame, ltvAt, 14)}>
                <rect x="80" y="840" width="920" height="410" rx="14" fill={`${lessonColors.success}10`} stroke={lessonColors.success} strokeWidth="4" />
                <text x="540" y="890" textAnchor="middle" fontFamily={fonts.display} fontSize="40" fontWeight="850" fill={lessonColors.success}>LTV — فلوس راجعة من العميل</text>

                {/* Customer on left */}
                <g transform="translate(155 990)">
                    <circle cx="0" cy="0" r="26" fill={lessonColors.success} />
                    <rect x="-30" y="34" width="60" height="68" rx="26" fill={lessonColors.success} />
                </g>

                {/* Month boxes */}
                <line x1="230" y1="1010" x2="960" y2="1010" stroke={lessonColors.success} strokeWidth="3" strokeDasharray="8 6" />
                {["M1", "M2", "M3", "M4"].map((label, i) => {
                    const cellAt = monthAt + i * 14;
                    const cellShow = fade(frame, cellAt, 10);
                    return (
                        <g key={label} opacity={cellShow} transform={`translate(${245 + i * 170} 950)`}>
                            <rect x="0" y="0" width="150" height="130" rx="10" fill={`${lessonColors.success}22`} stroke={lessonColors.success} strokeWidth="4" />
                            <text x="75" y="40" textAnchor="middle" fontFamily={fonts.mono} fontSize="22" fontWeight="700" fill={colors.mute} letterSpacing="2">{label}</text>
                            <text x="75" y="100" textAnchor="middle" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={lessonColors.success}>+{monthlyAmount}</text>
                        </g>
                    );
                })}

                {/* Running total bar */}
                <text x="120" y="1140" fontFamily={fonts.mono} fontSize="22" fontWeight="700" fill={colors.mute} letterSpacing="3">TOTAL</text>
                <rect x="120" y="1158" width="700" height="56" rx="8" fill="rgba(255,255,255,0.04)" stroke={lessonColors.success} strokeWidth="3" />
                <rect x="120" y="1158" width={Math.max(0, 700 * totalFill)} height="56" rx="8" fill={lessonColors.success} opacity="0.5" />
                <text x="880" y="1198" fontFamily={fonts.display} fontSize="42" fontWeight="850" fill={lessonColors.success}>${totalAmount}</text>
            </g>

            {/* Verdict bar */}
            <g opacity={fade(frame, scaleAt, 14)}>
                <rect x="80" y="1290" width="920" height="170" rx="14" fill={`${verdictColor}18`} stroke={verdictColor} strokeWidth="5" />
                <text x="540" y="1352" textAnchor="middle" fontFamily={fonts.display} fontSize="50" fontWeight="850" fill={verdictColor}>{cacAmount} IN  →  {ltvAmount} OUT</text>
                <text x="540" y="1418" textAnchor="middle" fontFamily={fonts.display} fontSize="56" fontWeight="850" fill={verdictColor}>{verdictWord}</text>
            </g>
        </svg>
    );
};

const Coin: React.FC<{ x: number; y: number; color: string; opacity: number; label?: string }> = ({ x, y, color, opacity, label }) => (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
        <circle cx="0" cy="0" r="29" fill={`${color}33`} stroke={color} strokeWidth="5" />
        <text x="0" y="10" textAnchor="middle" fontFamily={fonts.display} fontSize={label ? "24" : "32"} fontWeight="850" fill={color}>{label ?? "$"}</text>
    </g>
);

const LedgerRow: React.FC<{
    label: string;
    desc: string;
    amount: string;
    color: string;
    at: number;
    size?: "normal" | "large";
}> = ({ label, desc, amount, color, at, size = "normal" }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 210px", alignItems: "center", minHeight: size === "large" ? 148 : 132, border: `4px solid ${color}`, background: `${color}18`, borderRadius: 10, padding: "20px 24px", boxSizing: "border-box", marginBottom: 22, opacity: fade(frame, at, 12), transform: `translateY(${rise(frame, at, 18)}px)` }}>
            <div style={{ fontFamily: fonts.display, fontSize: size === "large" ? 64 : 58, fontWeight: 850, color }}>{label}</div>
            <div style={{ fontFamily: fonts.body, fontSize: 40, fontStyle: "italic", lineHeight: 1.05, color: colors.ink }}>{desc}</div>
            <div style={{ fontFamily: fonts.display, fontSize: size === "large" ? 66 : 60, fontWeight: 850, color, textAlign: "right" }}>{amount}</div>
        </div>
    );
};

export const TrapPanel: React.FC<{
    at: number;
    outAt: number;
    color: string;
    title: string;
    left: string;
    right: string;
    message: string;
    amount?: string;
}> = ({ at, outAt, color, title, left, right, message, amount }) => {
    const frame = useCurrentFrame();
    const opacity = Math.min(fade(frame, at, 14), interpolate(frame - outAt, [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: qEase }));
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 460, opacity, transform: `translateY(${rise(frame, at, 18)}px)` }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 32, color, fontWeight: 700, letterSpacing: 3, marginBottom: 26 }}>{title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr", gap: 18, alignItems: "center" }}>
                <TrapBox text={left} color={lessonColors.success} />
                <div style={{ fontFamily: fonts.display, fontSize: 70, fontWeight: 850, color: colors.neg, textAlign: "center" }}>but</div>
                <TrapBox text={right} color={colors.neg} />
            </div>
            {amount ? (
                <div style={{ marginTop: 48, fontFamily: fonts.display, fontSize: 76, fontWeight: 850, color: colors.neg, textAlign: "center" }}>{amount}</div>
            ) : null}
            <div style={{ marginTop: amount ? 42 : 80, minHeight: 210, border: `3px solid ${lessonColors.softLine}`, borderRadius: 10, background: "rgba(255,255,255,0.025)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 36px", boxSizing: "border-box", fontFamily: fonts.display, fontSize: 58, lineHeight: 1.03, fontWeight: 850, color: colors.ink, textAlign: "center" }}>{message}</div>
        </div>
    );
};

export const TrapCarousel: React.FC<{
    adsAt: number;
    networkAt: number;
    viralAt: number;
}> = ({ adsAt, networkAt, viralAt }) => {
    const frame = useCurrentFrame();
    const active = frame < networkAt - 4 ? 0 : frame < viralAt - 4 ? 1 : 2;
    const phaseAt = active === 0 ? adsAt : active === 1 ? networkAt : viralAt;
    const wipeA = holdFade(frame, networkAt - 10, networkAt + 4, 6);
    const wipeB = holdFade(frame, viralAt - 10, viralAt + 4, 6);
    const wipe = Math.max(wipeA, wipeB);
    const panels = [
        { title: "الإعلانات مش هتسد التسريب", color: engineData.sticky.color, type: "leak" },
        { title: "مستخدمين منفصلين مش شبكة", color: engineData.viral.color, type: "network" },
        { title: "VIRAL مش هيصلح حسابات خسرانة", color: engineData.paid.color, type: "loss" },
    ];
    const panel = panels[active];
    const panelEnterAt = active === 0 ? 8 : phaseAt - 20;
    const diagramAt = active === 0 ? 18 : phaseAt - 18;
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(80 285)">
                <text x="460" y="0" textAnchor="middle" fontFamily={fonts.display} fontSize="60" fontWeight="850" fill={colors.accent}>محرك غلط، إصلاح غلط</text>
                <g opacity={fade(frame, panelEnterAt, 8)} transform={`translate(${(1 - fade(frame, panelEnterAt, 10)) * 34} 0)`}>
                    <rect x="0" y="125" width="920" height="1020" rx="18" fill={`${panel.color}10`} stroke={panel.color} strokeWidth="5" />
                    <text x="460" y="215" textAnchor="middle" fontFamily={fonts.display} fontSize="34" fontWeight="850" fill={panel.color}>{panel.title}</text>
                    <TrapDiagram type={panel.type} color={panel.color} startAt={diagramAt} />
                </g>
                <g opacity={fade(frame, Math.min(adsAt + 18, 70), 10)}>
                    {[0, 1, 2].map((index) => (
                        <rect key={index} x={310 + index * 78} y="1205" width="54" height="16" rx="8" fill={index === active ? panel.color : lessonColors.softLine} />
                    ))}
                </g>
                <rect x={interpolate(wipe, [0, 1], [-40, 920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y="125" width="24" height="1020" fill={panel.color} opacity={wipe * 0.75} />
            </g>
        </svg>
    );
};

const TrapDiagram: React.FC<{ type: string; color: string; startAt: number }> = ({ type, color, startAt }) => {
    const frame = useCurrentFrame();
    if (type === "network") {
        return (
            <g transform="translate(105 330)">
                {[0, 1, 2, 3, 4].map((i) => {
                    const x = [80, 280, 520, 650, 390][i];
                    const y = [115, 300, 95, 325, 455][i];
                    return (
                        <g key={i} opacity={fade(frame, startAt + i * 8, 8)}>
                            <circle cx={x} cy={y} r="48" fill={`${color}30`} stroke={color} strokeWidth="6" />
                            <text x={x} y={y + 14} textAnchor="middle" fontFamily={fonts.display} fontSize="48" fontWeight="850" fill={color}>+</text>
                        </g>
                    );
                })}
                <path d="M 80 115 L 280 300 L 520 95 L 650 325 L 390 455" fill="none" stroke={colors.neg} strokeWidth="8" strokeDasharray="18 18" opacity={fade(frame, startAt + 38, 10)} />
                <text x="365" y="690" textAnchor="middle" fontFamily={fonts.display} fontSize="72" fontWeight="850" fill={colors.neg} opacity={fade(frame, startAt + 52, 10)}>مفيش روابط</text>
            </g>
        );
    }
    if (type === "loss") {
        return (
            <g transform="translate(105 330)">
                <rect x="180" y="20" width="380" height="180" rx="16" fill={`${colors.neg}18`} stroke={colors.neg} strokeWidth="6" />
                <text x="370" y="95" textAnchor="middle" fontFamily={fonts.display} fontSize="72" fontWeight="850" fill={colors.neg}>-$5</text>
                <text x="370" y="150" textAnchor="middle" fontFamily={fonts.display} fontSize="32" fontWeight="850" fill={colors.neg}>لكل بيعة</text>
                {["x10", "x100", "x1000"].map((label, i) => (
                    <g key={label} opacity={fade(frame, startAt + 22 + i * 18, 10)} transform={`translate(${90 + i * 230} ${310 + i * 48})`}>
                        <path d="M 0 0 L 124 0" stroke={color} strokeWidth="8" strokeLinecap="butt" />
                        <polygon points="150,0 124,-16 124,16" fill={color} />
                        <text x="75" y="72" textAnchor="middle" fontFamily={fonts.display} fontSize="60" fontWeight="850" fill={color}>{label}</text>
                    </g>
                ))}
                <text x="365" y="700" textAnchor="middle" fontFamily={fonts.display} fontSize="54" fontWeight="850" fill={colors.neg} opacity={fade(frame, startAt + 76, 10)}>طلب أكتر، خسارة أكتر</text>
            </g>
        );
    }
    return (
        <g transform="translate(105 300)">
            <g opacity={fade(frame, startAt + 10, 8)}>
                {[0, 1, 2].map((i) => <Coin key={i} x={90 + i * 70} y={115 + i * 34} color={engineData.paid.color} opacity={1} />)}
                <text x="105" y="260" textAnchor="middle" fontFamily={fonts.mono} fontSize="30" fontWeight="700" fill={engineData.paid.color}>إعلانات داخلة</text>
            </g>
            <defs>
                <clipPath id="leakBucketClip">
                    <path d="M 320 35 L 650 35 L 614 490 L 360 490 Z" />
                </clipPath>
            </defs>
            <g transform="translate(0 0)">
                <path d="M 320 35 L 650 35 L 614 490 L 360 490 Z" fill={`${color}18`} stroke={color} strokeWidth="7" />
                <rect x="320" y="260" width="330" height="230" fill={color} opacity="0.48" clipPath="url(#leakBucketClip)" />
                <text x="485" y="350" textAnchor="middle" fontFamily={fonts.display} fontSize="60" fontWeight="850" fill={colors.ink}>عملاء</text>
                <g opacity={fade(frame, startAt + 42, 8)}>
                    <path d="M 380 490 C 382 570, 450 590, 450 675" fill="none" stroke={colors.neg} strokeWidth="9" strokeLinecap="round" />
                    {[0, 1, 2].map((i) => <circle key={i} cx={428 + i * 34} cy={573 + ((frame + i * 8) % 54)} r="12" fill={colors.neg} />)}
                    <text x="495" y="735" textAnchor="middle" fontFamily={fonts.display} fontSize="66" fontWeight="850" fill={colors.neg}>CHURN خارج</text>
                </g>
            </g>
        </g>
    );
};

const TrapBox: React.FC<{ text: string; color: string }> = ({ text, color }) => (
    <div style={{ minHeight: 340, border: `4px solid ${color}`, background: `${color}18`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 26, boxSizing: "border-box", fontFamily: fonts.display, fontSize: 54, fontWeight: 850, lineHeight: 1.02, color, textAlign: "center" }}>
        {text}
    </div>
);

export const QuestionCard: React.FC<{
    at: number;
    outAt: number;
    question: string;
    kind: EngineKind;
    rule: string;
}> = ({ at, outAt, question, kind, rule }) => {
    const frame = useCurrentFrame();
    const data = engineData[kind];
    const opacity = Math.min(fade(frame, at, 14), interpolate(frame - outAt, [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: qEase }));
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 395, opacity, transform: `translateY(${rise(frame, at, 18)}px)` }}>
            <div style={{ minHeight: 445, border: `4px solid ${data.color}`, background: `${data.color}16`, borderRadius: 10, padding: 44, boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                <div style={{ fontFamily: fonts.display, fontSize: 78, fontWeight: 850, lineHeight: 1.02, color: colors.ink }}>{question}</div>
            </div>
            <div style={{ marginTop: 210, display: "grid", gridTemplateColumns: "350px 1fr", gap: 24, alignItems: "stretch" }}>
                <div style={{ minHeight: 290, border: `4px solid ${data.color}`, background: `${data.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontSize: 72, fontWeight: 850, color: data.color }}>{data.label}</div>
                <div style={{ minHeight: 290, border: `4px solid ${data.color}`, background: `${data.color}12`, borderRadius: 10, display: "flex", alignItems: "center", padding: "28px 34px", boxSizing: "border-box", fontFamily: fonts.display, fontSize: 62, lineHeight: 1.02, fontWeight: 850, color: data.color }}>{rule}</div>
            </div>
        </div>
    );
};

export const DiagnosticPath: React.FC<{
    repeatAt: number;
    networkAt: number;
    paidAt: number;
}> = ({ repeatAt, networkAt, paidAt }) => {
    const frame = useCurrentFrame();
    const steps = [
        { at: repeatAt, question: "العملاء بيرجعوا؟", kind: "sticky" as EngineKind, rule: "NEW > CHURN" },
        { at: networkAt, question: "المستخدمين يعملوا شبكة؟", kind: "viral" as EngineKind, rule: "K > 1" },
        { at: paidAt, question: "بتعرف تشتري عملاء؟", kind: "paid" as EngineKind, rule: "LTV > CAC" },
    ];
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(80 350)">
                <text x="460" y="0" textAnchor="middle" fontFamily={fonts.display} fontSize="78" fontWeight="850" fill={colors.accent}>اسأل سؤال واحد</text>
                <path d="M 160 150 L 160 1030" stroke={lessonColors.softLine} strokeWidth="8" strokeLinecap="round" />
                {steps.map((step, index) => {
                    const data = engineData[step.kind];
                    const y = 175 + index * 305;
                    const show = fade(frame, step.at, 12);
                    return (
                        <g key={step.kind} opacity={show} transform={`translate(${rise(frame, step.at, 18)} 0)`}>
                            <circle cx="160" cy={y + 80} r="42" fill={`${data.color}26`} stroke={data.color} strokeWidth="6" />
                            <text x="160" y={y + 98} textAnchor="middle" fontFamily={fonts.display} fontSize="58" fontWeight="850" fill={data.color}>{index + 1}</text>
                            <rect x="245" y={y} width="635" height="160" rx="14" fill={`${data.color}12`} stroke={data.color} strokeWidth="5" />
                            <text x="285" y={y + 64} fontFamily={fonts.display} fontSize="52" fontWeight="850" fill={colors.ink}>{step.question}</text>
                            <text x="285" y={y + 124} fontFamily={fonts.mono} fontSize="30" fontWeight="700" fill={data.color} letterSpacing="2">{data.label} · {step.rule}</text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

export const EquationLock: React.FC<{ engineAt: number; trueAt: number }> = ({ engineAt, trueAt }) => {
    const frame = useCurrentFrame();
    const equations = [
        { text: "NEW > CHURN", color: engineData.sticky.color, x: 85, y: 540 },
        { text: "K > 1", color: engineData.viral.color, x: 85, y: 760 },
        { text: "LTV > CAC", color: engineData.paid.color, x: 85, y: 980 },
    ];
    return (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
            <g opacity={fade(frame, engineAt, 12)}>
                {equations.map((eq, index) => (
                    <g key={eq.text} transform={`translate(${eq.x + rise(frame, engineAt + index * 8, 36)} ${eq.y})`} opacity={fade(frame, engineAt + index * 8, 10)}>
                        <rect width="910" height="150" rx="14" fill={`${eq.color}16`} stroke={eq.color} strokeWidth="5" />
                        <text x="455" y="96" textAnchor="middle" fontFamily={fonts.display} fontSize="70" fontWeight="850" fill={eq.color}>{eq.text}</text>
                    </g>
                ))}
            </g>
            <g opacity={fade(frame, trueAt, 12)}>
                <rect x="60" y="1245" width="960" height="220" rx="18" fill={`${colors.ink}08`} stroke={colors.ink} strokeWidth="5" />
                <text x="540" y="1340" textAnchor="middle" fontFamily={fonts.display} fontSize="54" fontWeight="850" fill={colors.ink}>خلّي المعادلة صح</text>
                <text x="540" y="1412" textAnchor="middle" fontFamily={fonts.mono} fontSize="34" fontWeight="700" fill={colors.accent} letterSpacing="3">____ &gt; ____</text>
            </g>
        </svg>
    );
};

export const OutroMark: React.FC<{ at: number }> = ({ at }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, bottom: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, opacity: fade(frame, at, 16) }}>
            <DotMark size={24} delay={at} />
            <div style={{ fontFamily: fonts.mono, fontSize: 34, color: colors.ink, fontWeight: 600, letterSpacing: 5 }}>MADE PLAIN</div>
        </div>
    );
};
