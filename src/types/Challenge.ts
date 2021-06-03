import { ChallengeType, Language, PictureType } from "enums";

export interface ChallengeConfig {
    timeLimit: number,
    questionFontSize: number
}

export interface ChallengePicture {
    type: PictureType,
    data: string
}

export interface ChallengeOptions {
    language: Language,
    ignoreTimeLimit: boolean
}

export interface Challenge {
    id: string,
    type: ChallengeType,
    question: string,
    config: ChallengeConfig
}
