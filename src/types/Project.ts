import { Test } from "./Test";

export interface Project {
    id: string,
    name: string,
    description?: string,
    tests: Test[]
}
