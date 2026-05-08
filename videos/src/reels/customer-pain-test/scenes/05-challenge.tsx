import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import { ChallengeLine, HugeLine, SceneShell } from "../primitives";
import { fade, wordCue, wordPhrase } from "../timing";

export const ChallengeScene: React.FC<{ words: Word[]; total: number }> = ({
    words,
}) => {
    const fivePeopleAt = wordPhrase(words, "five people", 42);
    const askAt = wordPhrase(words, "ask the question", 66);
    const numbersAt = wordCue(words, "numbers", 174);
    const threeOfFiveAt = wordCue(words, "three", 117);

    return (
        <SceneShell>
            <HugeLine
                at={0}
                top={200}
                size={78}
                color={reelColors.mute}
                weight={500}
                italic
            >
                Try it this week.
            </HugeLine>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 470,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 70,
                }}
            >
                <ChallengeLine at={fivePeopleAt} fontSize={134} weight={900}>
                    <span style={{ color: reelColors.accent }}>5</span> people.
                </ChallengeLine>
                <ChallengeLine at={askAt} fontSize={98}>
                    Ask the question.
                </ChallengeLine>
                <ChallengeLine at={numbersAt} fontSize={98}>
                    Listen for numbers.
                </ChallengeLine>
                <ChallengeLine
                    at={threeOfFiveAt}
                    fontSize={164}
                    weight={900}
                    color={reelColors.accent}
                >
                    3 / 5 = signal.
                </ChallengeLine>
            </div>
        </SceneShell>
    );
};
