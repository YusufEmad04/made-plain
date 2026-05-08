import React from "react";
import type { Word } from "../data";
import { PaidMachine, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const PaidScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const paidAt = wordCue(words, "paid", 6);
    const cacAt = wordCue(words, "cac", paidAt + 36);
    const spendAt = wordCue(words, "spend", cacAt + 30);
    const customerAt = wordCue(words, "shopify", spendAt + 40);
    const ltvAt = wordCue(words, "ltv", customerAt + 30);
    const monthAt = wordCue(words, "thirty", ltvAt + 40);
    const scaleAt = wordCue(words, "scale", monthAt + 90);
    const lossAt = wordCue(words, "ninety", scaleAt + 40);

    return (
        <SceneShell title="ENGINE 3" active="paid">
            <PaidMachine
                at={paidAt}
                cacAt={cacAt}
                spendAt={spendAt}
                customerAt={customerAt}
                ltvAt={ltvAt}
                monthAt={monthAt}
                scaleAt={scaleAt}
                lossAt={lossAt}
            />
        </SceneShell>
    );
};
