import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { LessonBand, SceneShell, TrapCarousel } from "../primitives";
import { wordCue } from "../timing";

export const TrapScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const adsAt = wordCue(words, "إعلانات", 52);
    const isolatedAt = wordCue(words, "لوحدهم", adsAt + 92);
    const viralAt = wordCue(words, "viral", isolatedAt + 92);
    const lossAt = wordCue(words, "بيخسر", viralAt + 50);

    return (
        <SceneShell title="الفخ" active={null}>
            <TrapCarousel adsAt={adsAt} networkAt={isolatedAt} viralAt={viralAt} />
            <LessonBand at={lossAt} size={50} color={colors.ink}>
                الحل لازم يناسب محرك النمو.
            </LessonBand>
        </SceneShell>
    );
};
