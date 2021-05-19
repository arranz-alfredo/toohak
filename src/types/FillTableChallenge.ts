import { Challenge, ChallengeConfig } from "./Challenge";

export interface FillTableChallengeConfig extends ChallengeConfig {
    itemsFontSize: number,
    columnCount: number,
    rowCount: number,
    firstRowFixed: boolean,
    firstColumnFixed: boolean
}

export interface FillTableChallengeCell {
    text: string,
    hidden: boolean
}

export interface FillTableChallenge extends Challenge {
    items: FillTableChallengeCell[][],
    config: FillTableChallengeConfig
}
