import { Easing, interpolate, spring } from "remotion";
import { ease } from "../../brand/tokens";
import type { Word } from "./data";

export const cleanWord = (word: string) =>
    word.toLowerCase().replace(/[.,!?;:'"()]/g, "");

export const wordCue = (words: Word[], needle: string, fallback = 0): number => {
    const target = cleanWord(needle);
    for (const word of words) {
        if (cleanWord(word.word).includes(target)) {
            return word.startFrame;
        }
    }
    return fallback;
};

export const wordCueNth = (
    words: Word[],
    needle: string,
    count: number,
    fallback = 0,
): number => {
    const target = cleanWord(needle);
    let seen = 0;
    for (const word of words) {
        if (cleanWord(word.word).includes(target)) {
            seen += 1;
            if (seen === count) {
                return word.startFrame;
            }
        }
    }
    return fallback;
};

export const qEase = Easing.bezier(...ease.quart);

export const fade = (frame: number, at: number, duration = 18) =>
    interpolate(frame - at, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });

export const fadeOut = (frame: number, at: number, duration = 18) =>
    interpolate(frame - at, [0, duration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });

export const holdFade = (
    frame: number,
    inAt: number,
    outAt: number,
    duration = 14,
) => Math.min(fade(frame, inAt, duration), fadeOut(frame, outAt, duration));

export const rise = (frame: number, at: number, distance = 24, duration = 18) =>
    (1 - fade(frame, at, duration)) * distance;

export const pop = (frame: number, at: number, fps: number) =>
    spring({
        frame: frame - at,
        fps,
        durationInFrames: 22,
        config: { damping: 12, stiffness: 120 },
    });
