import React from "react";
import type { Word } from "../data";
import { BranchingUsers, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const ViralScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const viralAt = wordCue(words, "viral", 6);
    const kAt = wordCue(words, "k", viralAt + 32);
    const aboveAt = wordCue(words, "أكبر", kAt + 45);
    const belowAt = wordCue(words, "أقل", aboveAt + 55);

    return (
        <SceneShell title="المحرك 2" active="viral">
            <BranchingUsers at={viralAt} redAt={belowAt} />
            <LessonBand at={kAt} size={52}>
                Viral يشتغل لما كل مستخدم يجيب أكتر من مستخدم جديد.
            </LessonBand>
        </SceneShell>
    );
};
