import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { BigStatement, BusinessSelector, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const ProblemScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const subscriptionAt = wordCue(words, "subscription", 34);
    const socialAt = wordCue(words, "social", subscriptionAt + 18);
    const productAt = wordCue(words, "product", socialAt + 18);
    const pickAt = wordCue(words, "pick", productAt + 52);

    return (
        <SceneShell showProgress={false}>
            <BigStatement top={105} at={0} color={colors.accent} size={88} align="center">
                Growth is not one thing.
            </BigStatement>
            <BusinessSelector subscriptionAt={subscriptionAt} socialAt={socialAt} productAt={productAt} pickAt={pickAt} />
            <LessonBand top={1510} at={pickAt} size={58} color={colors.ink}>
                Different businesses need different engines.
            </LessonBand>
        </SceneShell>
    );
};
