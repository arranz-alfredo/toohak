import { Challenge, ChallengeConfig, ChallengePicture } from "types";

export interface TrueOrFalseChallengeConfig extends ChallengeConfig {
    pictureCount: number,
    pictureLabel: boolean
}

export interface TrueOrFalseChallenge extends Challenge {
    pictures: ChallengePicture[],
    answer: boolean,
    config: TrueOrFalseChallengeConfig
}
