import React from "react";
import type { Word } from "../data";
import { RecurringRevenueStack, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const StickyExampleScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const introAt = wordCue(words, "sticky", 0);
    const mrrAt = wordCue(words, "mrr", introAt + 30);
    const millionAt = wordCue(words, "million", mrrAt + 70);
    const arrAt = wordCue(words, "arr", millionAt + 70);
    const churnAt = wordCue(words, "churn", arrAt + 90);

    return (
        <SceneShell title="WHY STICKY WINS" active="sticky">
            <RecurringRevenueStack
                introAt={introAt}
                mrrAt={mrrAt}
                millionAt={millionAt}
                arrAt={arrAt}
                churnAt={churnAt}
            />
        </SceneShell>
    );
};
