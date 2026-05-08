import React from "react";
import { useCurrentFrame } from "remotion";
import { DotMark } from "../../../brand/motion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import { HugeLine, SceneShell } from "../primitives";
import { fade, wordCue, wordPhrase } from "../timing";

export const OutroScene: React.FC<{ words: Word[]; total: number }> = ({
    words,
}) => {
    const frame = useCurrentFrame();

    const aWishAt = wordPhrase(words, "a wish", 82);
    const dotAt = aWishAt + 16;

    return (
        <SceneShell>
            <HugeLine
                at={0}
                top={420}
                size={118}
                weight={900}
                paddingX={20}
                enter="slam"
            >
                <span style={{ color: reelColors.accent }}>PAIN</span> has a number.
            </HugeLine>

            <HugeLine
                at={aWishAt}
                top={760}
                size={118}
                weight={900}
                paddingX={20}
                enter="slam"
            >
                A <span style={{ color: reelColors.mute }}>WISH</span> doesn't.
            </HugeLine>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1180,
                    display: "flex",
                    justifyContent: "center",
                    opacity: fade(frame, dotAt, 14),
                }}
            >
                <DotMark size={64} pulse />
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1300,
                    textAlign: "center",
                    opacity: fade(frame, dotAt + 10, 14),
                    fontFamily: fonts.mono,
                    fontSize: 60,
                    letterSpacing: 8,
                    color: reelColors.accent,
                    fontWeight: 600,
                }}
            >
                MADE PLAIN
            </div>
        </SceneShell>
    );
};
