import React from "react";
import { colors } from "../../../brand/tokens";
import type { Word } from "../data";
import { BigStatement, EngineGaugeDashboard, LessonBand, SceneShell } from "../primitives";
import { wordCue } from "../timing";

export const FrameworkScene: React.FC<{ words: Word[]; total: number }> = ({ words }) => {
    const stickyAt = wordCue(words, "sticky", 30);
    const viralAt = wordCue(words, "viral", stickyAt + 42);
    const paidAt = wordCue(words, "paid", viralAt + 42);
    const testAt = wordCue(words, "اختبار", paidAt + 70);

    return (
        <SceneShell active={null} showProgress={false}>
            <BigStatement top={155} at={0} color={colors.accent} size={82} align="center">
                3 محركات. 3 اختبارات.
            </BigStatement>
            <EngineGaugeDashboard stickyAt={stickyAt} viralAt={viralAt} paidAt={paidAt} testAt={testAt} />
            <LessonBand top={1530} at={testAt} size={56} color={colors.ink}>
                اختار الاختبار المناسب للمشروع.
            </LessonBand>
        </SceneShell>
    );
};
