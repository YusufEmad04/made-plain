import React from "react";
import type { Word } from "../data";
import { AudienceEconomy, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const ViralExampleScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const whyAt = wordCue(words, "why", 0);
    const accessAt = wordCue(words, "access", whyAt + 40);
    const buyersAt = wordCue(words, "amazon", accessAt + 25);
    const sellersAt = wordCue(words, "sellers", buyersAt + 35);
    const mediaAt = wordCue(words, "youtube", sellersAt + 40);
    const sponsorsAt = wordCue(words, "sponsors", mediaAt + 35);
    const productAt = wordCue(words, "product", sponsorsAt + 30);

    return (
        <SceneShell active="viral">
            <AudienceEconomy whyAt={whyAt + 8} accessAt={accessAt} buyersAt={buyersAt} sellersAt={sellersAt} mediaAt={mediaAt} sponsorsAt={sponsorsAt} productAt={productAt} />
        </SceneShell>
    );
};
