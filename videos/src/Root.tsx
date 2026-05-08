import React from "react";
import { Composition, Folder } from "remotion";
import { REEL } from "./brand/tokens";
import { KitAd, KIT_AD_DURATION } from "./compositions/KitAd";
import { CACPayback, CAC_DURATION } from "./compositions/CACPayback";
import {
    LeakyBucket,
    LEAKY_BUCKET_DURATION,
} from "./compositions/LeakyBucket";
import { EquityJourney, EQUITY_JOURNEY_DURATION } from "./reels/equity-journey";
import {
    WhatBusinessActuallyIs,
    WHAT_BUSINESS_ACTUALLY_IS_DURATION,
} from "./reels/what-a-business-actually-is";
import {
    BusinessThreeJobs,
    BUSINESS_THREE_JOBS_DURATION,
} from "./reels/business-three-jobs";
import {
    EnginesOfGrowth,
    ENGINES_OF_GROWTH_DURATION,
} from "./reels/engines-of-growth";
import {
    EnginesOfGrowthArabic,
    ENGINES_OF_GROWTH_AR_DURATION,
} from "./reels/engines-of-growth-ar";
import {
    CustomerPainTest,
    CUSTOMER_PAIN_TEST_DURATION,
} from "./reels/customer-pain-test";

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
                    id="EquityJourney"
                    component={EquityJourney}
                    durationInFrames={EQUITY_JOURNEY_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
                <Composition
                    id="WhatBusinessActuallyIs"
                    component={WhatBusinessActuallyIs}
                    durationInFrames={WHAT_BUSINESS_ACTUALLY_IS_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
                <Composition
                    id="BusinessThreeJobs"
                    component={BusinessThreeJobs}
                    durationInFrames={BUSINESS_THREE_JOBS_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
                <Composition
                    id="EnginesOfGrowth"
                    component={EnginesOfGrowth}
                    durationInFrames={ENGINES_OF_GROWTH_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
                <Composition
                    id="EnginesOfGrowthArabic"
                    component={EnginesOfGrowthArabic}
                    durationInFrames={ENGINES_OF_GROWTH_AR_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
                <Composition
                    id="CustomerPainTest"
                    component={CustomerPainTest}
                    durationInFrames={CUSTOMER_PAIN_TEST_DURATION}
                    fps={REEL.fps}
                    width={REEL.width}
                    height={REEL.height}
                />
            </Folder>
        </>
    );
};
