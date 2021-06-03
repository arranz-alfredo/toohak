import { Challenge, ChallengeConfig } from "types";

export interface ClassifyChallengeConfig extends ChallengeConfig {
    itemsFontSize: number,
    groupCount: number
}

export interface ClassifyChallengeGroup {
    name: string,
    items: string[]
}

export interface ClassifyChallenge extends Challenge {
    groups: ClassifyChallengeGroup[],
    config: ClassifyChallengeConfig
}
