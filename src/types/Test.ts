import { Language } from "enums";
import { Challenge } from "types";

export interface TestOptions {
    ignoreTimeLimit: boolean,
    autoNext: boolean
}
export interface Test {
    id: string,
    name: string,
    description?: string,
    challenges: Challenge[],
    language: Language
}
