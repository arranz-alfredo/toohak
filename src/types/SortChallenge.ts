import { ElementDirection } from "enums";
import { Challenge, ChallengeConfig } from "types";

export interface SortChallengeConfig extends ChallengeConfig {
    itemsFontSize: number,
    itemCount: number,
    elementsDirection: ElementDirection
}

export interface SortChallenge extends Challenge {
    items: string[],
    config: SortChallengeConfig
}
