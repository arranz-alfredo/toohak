import { ChallengeType } from "../enums/ChallengeType";
import { Language } from "../enums/Language";
import { PictureType } from "../enums/PictureType";

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
