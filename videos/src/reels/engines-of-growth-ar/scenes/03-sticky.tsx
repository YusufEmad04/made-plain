import React from "react";
import type { Word } from "../data";
import { BucketModel, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const StickyScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const stickyAt = wordCue(words, "sticky", 4);
    const newAt = wordCue(words, "جداد", stickyAt + 28);
    const churnAt = wordCue(words, "churn", newAt + 32);
    const twentyAt = wordCue(words, "عشرين", churnAt + 34);
    const beatAt = wordCue(words, "اكتر", twentyAt + 52);

    return (
        <SceneShell title="المحرك 1" active="sticky">
            <BucketModel at={stickyAt - 10} joinAt={newAt} churnAt={churnAt} successAt={beatAt} />
            <LessonBand at={newAt}>
                Sticky يشتغل لما الجداد يكونوا اكتر.
            </LessonBand>
        </SceneShell>
    );
};
