import { ChallengeConfig, PictureChallenge } from "types";

export interface SelectAnswerChallengeConfig extends ChallengeConfig {
    answerFontSize: number,
    pictureCount: number,
    pictureLabel: boolean,
    multiselect: boolean
}

export interface SelectAnswerChallengeAnswer {
    text: string,
    valid: boolean
}

export interface SelectAnswerChallenge extends PictureChallenge {
    answers: SelectAnswerChallengeAnswer[],
    config: SelectAnswerChallengeConfig
}
