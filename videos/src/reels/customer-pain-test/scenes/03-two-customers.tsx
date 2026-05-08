import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import {
    CrossOutMark,
    HighlightSpan,
    PersonGlyph,
    QuoteBubble,
    SceneShell,
    VerdictLabel,
} from "../primitives";
import { fade, wordCue, wordPhrase } from "../timing";

export const TwoCustomersScene: React.FC<{
    words: Word[];
    total: number;
}> = ({ words }) => {
    const frame = useCurrentFrame();
    const firstSaysAt = wordPhrase(words, "first says", 51);
    const aQuoteAt = wordPhrase(words, "love a", 90);
    const noNumberAt = wordPhrase(words, "no number", 121);
    const inconvenienceAt = wordCue(words, "inconvenience", 194);
    const secondSaysAt = wordPhrase(words, "second says", 234);
    const sixHoursQuoteAt = wordPhrase(words, "six hours", 278);
    const sixHoursEmphasisAt = wordPhrase(words, "six hours", 340);
    const realPainAt = wordPhrase(words, "real pain", 411);

    // The X over the wrong quote draws when the verdict appears
    const crossAt = noNumberAt;

    // Customer A bubble dims slightly once Customer B arrives
    const aDim = frame >= secondSaysAt - 6 ? 0.55 : 1;

    return (
        <SceneShell>
            {/* Customer A — top half */}
            <PersonGlyph at={firstSaysAt} x={170} y={310} color={reelColors.mute} />

            <div style={{ opacity: aDim }}>
                <QuoteBubble
                    at={aQuoteAt}
                    x={620}
                    y={240}
                    width={870}
                    fontSize={76}
                    slideFrom="right"
                >
                    "I'd love a better tool."
                </QuoteBubble>
            </div>

            {/* Big X drawn across the wrong quote */}
            <CrossOutMark
                at={crossAt}
                x={185}
                y={240}
                width={870}
                height={185}
                strokeWidth={18}
            />

            <VerdictLabel
                at={inconvenienceAt}
                text="No number → Inconvenience"
                x={540}
                y={580}
                color={reelColors.negBright}
                fontSize={60}
            />

            {/* Divider */}
            <div
                style={{
                    position: "absolute",
                    left: 80,
                    right: 80,
                    top: 940,
                    height: 2,
                    background: reelColors.softLine,
                    opacity: fade(frame, secondSaysAt - 6, 14),
                }}
            />

            {/* Customer B — bottom half */}
            <PersonGlyph at={secondSaysAt} x={170} y={1180} color={reelColors.accent} />
            <QuoteBubble
                at={sixHoursQuoteAt}
                x={620}
                y={1080}
                width={870}
                fontSize={76}
                slideFrom="left"
            >
                "I lose{" "}
                <HighlightSpan at={sixHoursEmphasisAt}>6 hours</HighlightSpan>{" "}
                every Monday."
            </QuoteBubble>
            <VerdictLabel
                at={realPainAt}
                text="Number → Pain"
                x={540}
                y={1450}
                color={reelColors.accent}
                fontSize={80}
            />
        </SceneShell>
    );
};
