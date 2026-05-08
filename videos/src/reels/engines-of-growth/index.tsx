import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    interpolate,
} from "remotion";
import { REEL } from "../../brand/tokens";
import manifestJson from "./voiceover/manifest.json";
import type { Manifest, SceneId, Word } from "./data";
import { TAIL_FRAMES } from "./data";
import { ProblemScene } from "./scenes/01-problem";
import { FrameworkScene } from "./scenes/02-framework";
import { StickyScene } from "./scenes/03-sticky";
import { StickyExampleScene } from "./scenes/04-sticky-example";
import { ViralScene } from "./scenes/05-viral";
import { ViralExampleScene } from "./scenes/06-viral-example";
import { PaidScene } from "./scenes/07-paid";
import { TrapScene } from "./scenes/08-trap";
import { DiagnosticScene } from "./scenes/09-diagnostic";
import { OutroScene } from "./scenes/10-outro";

const manifest = manifestJson as Manifest;

export const ENGINES_OF_GROWTH_DURATION = manifest.totalFrames + TAIL_FRAMES;

type SceneProps = {
    id: SceneId;
    words: Word[];
    total: number;
};

const SceneRouter: React.FC<SceneProps> = ({ id, words, total }) => {
    switch (id) {
        case "01-problem":
            return <ProblemScene words={words} total={total} />;
        case "02-framework":
            return <FrameworkScene words={words} total={total} />;
        case "03-sticky":
            return <StickyScene words={words} total={total} />;
        case "04-sticky-example":
            return <StickyExampleScene words={words} total={total} />;
        case "05-viral":
            return <ViralScene words={words} total={total} />;
        case "06-viral-example":
            return <ViralExampleScene words={words} total={total} />;
        case "07-paid":
            return <PaidScene words={words} total={total} />;
        case "08-trap":
            return <TrapScene words={words} total={total} />;
        case "09-diagnostic":
            return <DiagnosticScene words={words} total={total} />;
        case "10-outro":
            return <OutroScene words={words} total={total} />;
        default:
            return null;
    }
};

export const EnginesOfGrowth: React.FC = () => {
    return (
        <AbsoluteFill>
            {/* Background music — same soft bed as Equity Journey. */}
            <Audio
                src={staticFile("equity-journey/music.mp3")}
                volume={(f) => {
                    const fadeIn = interpolate(f, [0, REEL.fps], [0, 0.06], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const fadeOut = interpolate(
                        f,
                        [
                            ENGINES_OF_GROWTH_DURATION -
                            Math.round(REEL.fps * 0.8),
                            ENGINES_OF_GROWTH_DURATION,
                        ],
                        [0.06, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    return Math.min(fadeIn, fadeOut);
                }}
            />
            {manifest.scenes.map((scene, index) => {
                const isLast = index === manifest.scenes.length - 1;
                const durationInFrames = isLast
                    ? scene.durationFrames + TAIL_FRAMES
                    : scene.durationFrames;

                return (
                    <Sequence
                        key={scene.id}
                        from={scene.startFrame}
                        durationInFrames={durationInFrames}
                        premountFor={REEL.fps}
                    >
                        <Audio src={staticFile(`engines-of-growth/voiceover/${scene.audio}`)} />
                        <SceneRouter
                            id={scene.id as SceneId}
                            words={scene.words}
                            total={scene.durationFrames}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
