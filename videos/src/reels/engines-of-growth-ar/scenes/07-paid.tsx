import React from "react";
import type { Word } from "../data";
import { PaidMachine, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const PaidScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const paidAt = wordCue(words, "paid", 6);
    const cacAt = wordCue(words, "كاك", paidAt + 36);
    const spendAt = wordCue(words, "تدفع", cacAt + 30);
    const customerAt = wordCue(words, "shopify", spendAt + 40);
    const ltvAt = wordCue(words, "ltv", customerAt + 30);
    const monthAt = wordCue(words, "تلاتين", ltvAt + 40);
    const scaleAt = wordCue(words, "نكبر", monthAt + 90);
    const lossAt = wordCue(words, "تسعين", scaleAt + 40);

    return (
        <SceneShell title="المحرك 3" active="paid">
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
