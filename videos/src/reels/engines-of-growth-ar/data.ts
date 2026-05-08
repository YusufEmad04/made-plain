import { colors } from "../../brand/tokens";

export type EngineKind = "sticky" | "viral" | "paid";

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

export const TAIL_FRAMES = 45;

export const engineData: Record<
    EngineKind,
    {
        label: string;
        formal: string;
        question: string;
        shortRule: string;
        longRule: string;
        color: string;
    }
> = {
    sticky: {
        label: "STICKY",
        formal: "Retention",
        question: "العملاء بيفضلوا؟",
        shortRule: "NEW > CHURN",
        longRule: "الجداد > CHURN",
        color: "#5B8FB9",
    },
    viral: {
        label: "VIRAL",
        formal: "Audience growth",
        question: "المستخدمين بيجيبوا مستخدمين؟",
        shortRule: "K > 1",
        longRule: "K > 1",
        color: "#C13584",
    },
    paid: {
        label: "PAID",
        formal: "Unit economics",
        question: "الاستحواذ بيرجع فلوسه؟",
        shortRule: "LTV > CAC",
        longRule: "LTV > CAC",
        color: "#D4A24E",
    },
};

export const lessonColors = {
    success: colors.pos,
    failure: colors.neg,
    muted: colors.mute,
    softLine: "rgba(241, 236, 223, 0.18)",
    panel: "#1A1712",
    panel2: "#211D16",
    ink: colors.ink,
    paper: colors.paper,
    accent: colors.accent,
};

export const sceneOrder = [
    "01-problem",
    "02-framework",
    "03-sticky",
    "04-sticky-example",
    "05-viral",
    "06-viral-example",
    "07-paid",
    "08-trap",
    "09-diagnostic",
    "10-outro",
] as const;

export type SceneId = (typeof sceneOrder)[number];
