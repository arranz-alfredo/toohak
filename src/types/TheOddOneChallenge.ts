import { Challenge, ChallengeConfig } from "types";

export interface TheOddOneChallengeConfig extends ChallengeConfig {
    answerFontSize: number,
    seriesCount: number,
    seriesLength: number
}

export interface TheOddOneChallengeSerie {
    elements: string[],
    theOddOneIndex: number
}

export interface TheOddOneChallenge extends Challenge {
    series: TheOddOneChallengeSerie[],
    config: TheOddOneChallengeConfig
}
