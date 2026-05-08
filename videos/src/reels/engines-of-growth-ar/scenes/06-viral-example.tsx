import React from "react";
import type { Word } from "../data";
import { AudienceEconomy, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const ViralExampleScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const whyAt = wordCue(words, "ليه", 0);
    const accessAt = wordCue(words, "وصول", whyAt + 40);
    const buyersAt = wordCue(words, "amazon", accessAt + 25);
    const sellersAt = wordCue(words, "البياعين", buyersAt + 35);
    const mediaAt = wordCue(words, "youtube", sellersAt + 40);
    const sponsorsAt = wordCue(words, "المعلنين", mediaAt + 35);
    const productAt = wordCue(words, "المنتج", sponsorsAt + 30);

    return (
        <SceneShell active="viral">
            <AudienceEconomy whyAt={whyAt + 8} accessAt={accessAt} buyersAt={buyersAt} sellersAt={sellersAt} mediaAt={mediaAt} sponsorsAt={sponsorsAt} productAt={productAt} />
        </SceneShell>
    );
};
