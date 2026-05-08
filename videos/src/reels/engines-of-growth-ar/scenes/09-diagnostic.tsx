import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { DiagnosticPath, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const DiagnosticScene: React.FC<{ words: Word[]; total: number }> = ({ words, total }) => {
    const askAt = wordCue(words, "اسأل", 8);
    const repeatAt = wordCue(words, "بيرجعوا", askAt + 50);
    const usersAt = wordCue(words, "المستخدمين", repeatAt + 85);
    const buyAt = wordCue(words, "تشتري", usersAt + 90);

    return (
        <SceneShell title="أنهي محرك مناسب؟" active={null}>
            <DiagnosticPath repeatAt={repeatAt} networkAt={usersAt} paidAt={buyAt} />
            <LessonBand at={buyAt + 54} size={52} color={colors.ink}>
                اختار المحرك الأول. وبعدين ظبط المعادلة.
            </LessonBand>
        </SceneShell>
    );
};
