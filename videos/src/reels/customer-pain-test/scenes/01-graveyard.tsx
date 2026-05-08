import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts } from "../../../brand/fonts";
import { reelColors, type Word } from "../data";
import {
    DustPuff,
    FailureStamp,
    HugeLine,
    SceneShell,
    TombstoneCard,
} from "../primitives";
import { fade, wordCue, wordPhrase } from "../timing";

export const GraveyardScene: React.FC<{ words: Word[]; total: number }> = ({
    words,
}) => {
    const frame = useCurrentFrame();

    const productsAt = wordCue(words, "products", 10);
    const nobodyAt = wordCue(words, "nobody", 92);
    const notDesignAt = wordCue(words, "design", 155);
    const notMarketingAt = wordCue(words, "marketing", 192);
    const painWasntAt = wordPhrase(words, "pain wasnt", 218);

    const crumble1 = nobodyAt;
    const crumble2 = notDesignAt;
    const crumble3 = notMarketingAt;

    // One big central stamp lands once all three cards have fallen
    const stampAt = crumble3 + 14;

    return (
        <SceneShell>
            <HugeLine
                at={0}
                top={170}
                size={64}
                color={reelColors.mute}
                weight={500}
                italic
            >
                Most products die for one reason.
            </HugeLine>

            {/* Three product cards that crumble in sequence */}
            <TombstoneCard
                at={productsAt}
                crumbleAt={crumble1}
                x={250}
                y={620}
                width={250}
                height={340}
                color={reelColors.accent}
                rotate={-3}
            />
            <TombstoneCard
                at={productsAt + 6}
                crumbleAt={crumble2}
                x={540}
                y={640}
                width={250}
                height={340}
                color={reelColors.ink}
                rotate={2}
            />
            <TombstoneCard
                at={productsAt + 12}
                crumbleAt={crumble3}
                x={830}
                y={620}
                width={250}
                height={340}
                color={reelColors.accent}
                rotate={-1}
            />

            {/* Dust puffs at each card's base when it collapses */}
            <DustPuff at={crumble1 + 4} x={250} y={830} />
            <DustPuff at={crumble2 + 4} x={540} y={850} />
            <DustPuff at={crumble3 + 4} x={830} y={830} />

            {/* One central failure stamp lands AFTER all three crumble */}
            <FailureStamp
                at={stampAt}
                x={540}
                y={900}
                text="$0 · 0 BUYERS"
                fontSize={64}
                rotate={-4}
            />

            {/* Final headline */}
            <HugeLine at={painWasntAt} top={1210} size={156} weight={900} enter="slam">
                The pain
            </HugeLine>
            <HugeLine
                at={painWasntAt + 12}
                top={1410}
                size={156}
                weight={900}
                color={reelColors.accent}
                enter="slam"
            >
                wasn't real.
            </HugeLine>
        </SceneShell>
    );
};
