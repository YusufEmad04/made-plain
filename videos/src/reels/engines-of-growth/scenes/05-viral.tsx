import React from "react";
import type { Word } from "../data";
import { BranchingUsers, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const ViralScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const viralAt = wordCue(words, "viral", 6);
    const kAt = wordCue(words, "k", viralAt + 32);
    const aboveAt = wordCue(words, "above", kAt + 45);
    const belowAt = wordCue(words, "below", aboveAt + 55);

    return (
        <SceneShell title="ENGINE 2" active="viral">
            <BranchingUsers at={viralAt} redAt={belowAt} />
            <LessonBand at={kAt} size={52}>
                Viral works when each user brings more than one new user.
            </LessonBand>
        </SceneShell>
    );
};
