import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import { HighlightSpan, QuestionCard, SceneShell } from "../primitives";
import { fade, qEase, wordCue, wordPhrase } from "../timing";

export const QuestionScene: React.FC<{ words: Word[]; total: number }> = ({
    words,
}) => {
    const frame = useCurrentFrame();
    const dontAskAt = wordCue(words, "dont", 49);
    const wouldYouPayAt = wordPhrase(words, "would you", 72);
    const sureAt = wordCue(words, "polite", 140);
    const askAt = wordCueNthSafe(words, "ask", 2, 161);
    const solveTodayAt = wordPhrase(words, "solve it today", 188);
    const numbersHighlightAt = wordCue(words, "numbers", 241);

    // Card 1 dims to ~35% once Card 2 begins entering, so attention flows to the right question.
    const dimT = interpolate(frame - askAt, [0, 14], [1, 0.35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });
    const card1Scale = interpolate(frame - askAt, [0, 14], [1, 0.92], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: qEase,
    });

    return (
        <SceneShell>
            {/* Card 1 — wrong question, dims when Card 2 lands */}
            <div
                style={{
                    opacity: dimT,
                    transform: `scale(${card1Scale})`,
                    transformOrigin: "center center",
                }}
            >
                <QuestionCard
                    at={dontAskAt}
                    mark="x"
                    title="Don't ask"
                    question='"Would you pay for this?"'
                    answer={'"Sure!" (lying to be polite)'}
                    verdict="LIE"
                    x={540}
                    y={250}
                    width={980}
                    answerAt={wouldYouPayAt + 14}
                    verdictAt={sureAt}
                />
            </div>

            {/* Card 2 — right question, gets the focus */}
            <QuestionCard
                at={askAt}
                mark="check"
                title="Ask this"
                question='"How do you solve it today?"'
                answer={
                    <>
                        "I use{" "}
                        <HighlightSpan at={numbersHighlightAt}>
                            3 spreadsheets
                        </HighlightSpan>
                        ,
                        <br />
                        <HighlightSpan at={numbersHighlightAt + 12}>
                            2 hours a day
                        </HighlightSpan>
                        ."
                    </>
                }
                verdict="REAL NUMBERS"
                x={540}
                y={1000}
                width={980}
                answerAt={solveTodayAt + 18}
                verdictAt={numbersHighlightAt + 30}
            />
        </SceneShell>
    );
};

function wordCueNthSafe(
    words: Word[],
    needle: string,
    n: number,
    fallback: number,
): number {
    const target = needle.toLowerCase();
    let seen = 0;
    for (const w of words) {
        const cleaned = w.word.toLowerCase().replace(/[.,!?;:'"()\-—–]/g, "");
        if (cleaned === target) {
            seen += 1;
            if (seen === n) return w.startFrame;
        }
    }
    return fallback;
}
