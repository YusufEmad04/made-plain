import { colors } from "../../brand/tokens";

export type Word = {
    word: string;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
};

export type SceneManifest = {
    id: string;
    audio: string;
    text: string;
    speechSeconds: number;
    durationSeconds: number;
    durationFrames: number;
    startFrame: number;
    words: Word[];
};

export type Manifest = {
    fps: number;
    totalSeconds: number;
    totalFrames: number;
    scenes: SceneManifest[];
};

export const TAIL_FRAMES = 30;

export const sceneOrder = [
    "01-graveyard",
    "02-rule",
    "03-two-customers",
    "04-question",
    "05-challenge",
    "06-outro",
] as const;

export type SceneId = (typeof sceneOrder)[number];

export const reelColors = {
    paper: colors.paper,
    ink: colors.ink,
    accent: colors.accent,
    accentInk: colors.accentInk,
    mute: colors.mute,
    mute2: colors.mute2,
    pos: colors.pos,
    neg: colors.neg,
    // brighter, more saturated red for "wrong / lie / inconvenience" cues
    negBright: "#E54B3F",
    // brighter green for "right" cues if needed
    posBright: "#52B07A",
    panel: "#1A1712",
    panelBorder: "rgba(241, 236, 223, 0.16)",
    softLine: "rgba(241, 236, 223, 0.18)",
};

// Mandatory minimum font sizes for this reel (px)
export const fontMin = {
    eyebrow: 24, // top-corner only
    body: 50,
    label: 48,
    quote: 56,
    listItem: 60,
    hero: 90,
};
