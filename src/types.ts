export enum ActionType {
    Invalid,
    Help,
    Chapter
}

export interface BasicAction {
    type: ActionType;
}

export interface ChapterAction {
    type: ActionType;
    chapter: number;
}

export type Action = BasicAction | ChapterAction;