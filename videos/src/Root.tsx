import React from "react";
import { Composition, Folder } from "remotion";
import { REEL } from "./brand/tokens";
import { KitAd, KIT_AD_DURATION } from "./compositions/KitAd";
import { CACPayback, CAC_DURATION } from "./compositions/CACPayback";
import {
  LeakyBucket,
  LEAKY_BUCKET_DURATION,
} from "./compositions/LeakyBucket";
import { CashCycle, CASH_CYCLE_DURATION } from "./reels/cash-cycle";
import { Bottleneck, BOTTLENECK_DURATION } from "./reels/bottleneck";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Made-Plain">
        <Composition
          id="KitAd"
          component={KitAd}
          durationInFrames={KIT_AD_DURATION}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
        />
        <Composition
          id="CACPayback"
          component={CACPayback}
          durationInFrames={CAC_DURATION}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
        />
        <Composition
          id="LeakyBucket"
          component={LeakyBucket}
          durationInFrames={LEAKY_BUCKET_DURATION}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
        />
        <Composition
          id="CashCycle"
          component={CashCycle}
          durationInFrames={CASH_CYCLE_DURATION}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
        />
        <Composition
          id="Bottleneck"
          component={Bottleneck}
          durationInFrames={BOTTLENECK_DURATION}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
        />
      </Folder>
    </>
  );
};
