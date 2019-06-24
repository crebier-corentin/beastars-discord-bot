export enum Manga {
    Beastars = "20523",
    BeastComplex = "22194"
}

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
    manga: Manga;
}

export type Action = BasicAction | ChapterAction;