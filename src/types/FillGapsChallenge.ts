import { FillMethod } from "enums";
import { Challenge, ChallengeConfig } from "types";

export interface FillGapsChallengeConfig extends ChallengeConfig {
    textFontSize: number,
    fillMethod: FillMethod,
    checkCapitalLetters: boolean,
    checkAccentMarks: boolean
}

export interface FillGapsChallengeExpression {
    initPosition: number,
    wordCount: number,
    alternatives: string[]
}

export interface FillGapsChallengeSentence {
    text: string,
    hiddenExpressions: FillGapsChallengeExpression[]
}

export interface FillGapsChallenge extends Challenge {
    sentences: FillGapsChallengeSentence[],
    config: FillGapsChallengeConfig
}
