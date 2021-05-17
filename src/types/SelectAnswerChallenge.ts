import { Challenge, ChallengeConfig, ChallengePicture } from "./Challenge";

export interface SelectAnswerChallengeConfig extends ChallengeConfig {
    answerFontSize: number,
    pictureCount: number,
    pictureLabel: boolean,
    multiselect: boolean
}

export interface SelectAnswerChallengeAnswer {
    text: string
    valid: boolean
}

export interface SelectAnswerChallenge extends Challenge {
    pictures: ChallengePicture[],
    answers: SelectAnswerChallengeAnswer[],
    config: SelectAnswerChallengeConfig
}
