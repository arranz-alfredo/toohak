import { ChallengeConfig, PictureChallenge } from "types";

export interface TrueOrFalseChallengeConfig extends ChallengeConfig {
    pictureCount: number,
    pictureLabel: boolean
}

export interface TrueOrFalseChallenge extends PictureChallenge {
    answer: boolean,
    config: TrueOrFalseChallengeConfig
}
