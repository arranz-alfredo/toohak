import { Challenge, ChallengeConfig } from "./Challenge";

export interface MatchItem {
    text: string,
    index: number
}

export interface MatchChallengeConfig extends ChallengeConfig {
    answerFontSize: number,
    pairsCount: number
}

export interface MatchChallengePair {
    source: string,
    destination: string
}

export interface MatchChallenge extends Challenge {
    pairs: MatchChallengePair[],
    config: MatchChallengeConfig
}
