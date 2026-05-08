import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import { HugeLine, SceneShell } from "../primitives";
import { fade, pop, qEase, wordCue, wordPhrase } from "../timing";

export const RuleScene: React.FC<{ words: Word[]; total: number }> = ({
    words,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const realPainAt = wordPhrase(words, "real pain", 55);
    const hasAAt = wordPhrase(words, "has a", 71);
    const numberAt = wordCue(words, "number", 79);
    const onItAt = wordPhrase(words, "on it", 88);

    // Counter lands AFTER the rule has settled — during the silence pad,
    // so the rule reads cleanly first, then the counter punctuates.
    const counterAt = onItAt + 24;
    const counterT = interpolate(frame - counterAt, [0, 36], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });
    const counterValue = Math.round(counterT * 12345);
    const counterFormatted = `$${counterValue.toLocaleString("en-US")}`;
    const counterOp = fade(frame, counterAt, 14);
    const counterPop = pop(frame, counterAt, fps);

    return (
        <SceneShell>
            <HugeLine at={realPainAt} top={290} size={120} weight={900} enter="slam">
                A real pain
            </HugeLine>

            <HugeLine
                at={hasAAt}
                top={460}
                size={92}
                weight={700}
                color={reelColors.mute}
            >
                has a
            </HugeLine>

            <HugeLine
                at={numberAt}
                top={610}
                size={220}
                weight={900}
                color={reelColors.accent}
                enter="slam"
                paddingX={40}
            >
                NUMBER
            </HugeLine>

            <HugeLine at={onItAt} top={950} size={120} weight={900} enter="slam">
                on it.
            </HugeLine>

            {/* Counter that ticks up — visual proof of the rule */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1200,
                    textAlign: "center",
                    opacity: counterOp,
                    transform: `scale(${0.85 + counterPop * 0.15})`,
                    fontFamily: fonts.mono,
                    fontWeight: 700,
                    fontSize: 144,
                    color: reelColors.pos,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: -2,
                }}
            >
                {counterFormatted}
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 1380,
                    textAlign: "center",
                    opacity: counterOp,
                    fontFamily: fonts.bodyItalic,
                    fontStyle: "italic",
                    fontSize: 62,
                    color: reelColors.mute,
                }}
            >
                hours · dollars · customers
            </div>
        </SceneShell>
    );
};
