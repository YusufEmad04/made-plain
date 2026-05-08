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
import { TAIL_FRAMES, type Manifest, type SceneId, type Word } from "./data";
import { GraveyardScene } from "./scenes/01-graveyard";
import { RuleScene } from "./scenes/02-rule";
import { TwoCustomersScene } from "./scenes/03-two-customers";
import { QuestionScene } from "./scenes/04-question";
import { ChallengeScene } from "./scenes/05-challenge";
import { OutroScene } from "./scenes/06-outro";

const manifest = manifestJson as Manifest;

export const CUSTOMER_PAIN_TEST_DURATION = manifest.totalFrames + TAIL_FRAMES;

type SceneProps = {
    id: SceneId;
    words: Word[];
    total: number;
};

const SceneRouter: React.FC<SceneProps> = ({ id, words, total }) => {
    switch (id) {
        case "01-graveyard":
            return <GraveyardScene words={words} total={total} />;
        case "02-rule":
            return <RuleScene words={words} total={total} />;
        case "03-two-customers":
            return <TwoCustomersScene words={words} total={total} />;
        case "04-question":
            return <QuestionScene words={words} total={total} />;
        case "05-challenge":
            return <ChallengeScene words={words} total={total} />;
        case "06-outro":
            return <OutroScene words={words} total={total} />;
        default:
            return null;
    }
};

export const CustomerPainTest: React.FC = () => {
    return (
        <AbsoluteFill>
            {/* Background music — same soft bed as Equity Journey. Ducks well
                under the voiceover. Fades in over 1s, fades out 0.8s before end. */}
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
                            CUSTOMER_PAIN_TEST_DURATION -
                            Math.round(REEL.fps * 0.8),
                            CUSTOMER_PAIN_TEST_DURATION,
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
                        <Audio
                            src={staticFile(
                                `customer-pain-test/voiceover/${scene.audio}`,
                            )}
                        />
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
