import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { LessonBand, SceneShell, TrapCarousel } from "../primitives";
import { wordCue } from "../timing";

export const TrapScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const adsAt = wordCue(words, "ads", 52);
    const isolatedAt = wordCue(words, "isolated", adsAt + 92);
    const viralAt = wordCue(words, "viral", isolatedAt + 92);
    const lossAt = wordCue(words, "loses", viralAt + 50);

    return (
        <SceneShell title="THE TRAP" active={null}>
            <TrapCarousel adsAt={adsAt} networkAt={isolatedAt} viralAt={viralAt} />
            <LessonBand at={lossAt} size={50} color={colors.ink}>
                The fix has to match the engine.
            </LessonBand>
        </SceneShell>
    );
};
