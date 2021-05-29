import { FillMethod } from "../enums/FillMethod";
import { Challenge, ChallengeConfig } from "./Challenge";

export interface FillGapsChallengeConfig extends ChallengeConfig {
    textFontSize: number,
    fillMethod: FillMethod
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
