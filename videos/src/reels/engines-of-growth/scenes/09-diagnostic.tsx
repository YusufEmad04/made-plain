import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { DiagnosticPath, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const DiagnosticScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const askAt = wordCue(words, "asking", 8);
    const repeatAt = wordCue(words, "repeat", askAt + 50);
    const usersAt = wordCue(words, "users", repeatAt + 85);
    const buyAt = wordCue(words, "buy", usersAt + 90);

    return (
        <SceneShell title="WHICH ENGINE IS YOURS?" active={null}>
            <DiagnosticPath repeatAt={repeatAt} networkAt={usersAt} paidAt={buyAt} />
            <LessonBand at={buyAt + 54} size={52} color={colors.ink}>
                Pick the engine first. Then make the rule true.
            </LessonBand>
        </SceneShell>
    );
};
