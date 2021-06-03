import { Test } from "types";

export interface Project {
    id: string,
    name: string,
    description?: string,
    tests: Test[]
}
