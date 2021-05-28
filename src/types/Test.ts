import { Language } from "../enums/Language";
import { Challenge } from "./Challenge";

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
