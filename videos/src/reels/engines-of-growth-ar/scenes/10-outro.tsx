import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { BigStatement, EquationLock, OutroMark, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const OutroScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const pickAt = wordCue(words, "اختار", 0);
    const trueAt = wordCue(words, "أكتر", Math.max(60, total - 35));

    return (
        <SceneShell showProgress={false}>
            <BigStatement top={155} at={pickAt} size={82} color={colors.accent} align="center">
                اختار محرك النمو.
            </BigStatement>
            <EquationLock engineAt={pickAt + 8} trueAt={trueAt} />
            <OutroMark at={trueAt + 30} />
        </SceneShell>
    );
};
