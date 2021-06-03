import { Challenge, ChallengeConfig } from "types";

export interface SortChallengeConfig extends ChallengeConfig {
    itemsFontSize: number,
    itemCount: number
}

export interface SortChallenge extends Challenge {
    items: string[],
    config: SortChallengeConfig
}
