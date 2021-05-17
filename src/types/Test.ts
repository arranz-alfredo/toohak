import { Language } from "../enums/Language";
import { Challenge } from "./Challenge";

export interface Test {
    id: string,
    name: string,
    description?: string,
    challenges: Challenge[],
    language: Language
}
