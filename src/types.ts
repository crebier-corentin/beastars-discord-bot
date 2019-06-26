export enum Manga {
    Beastars = "20523",
    BeastComplex = "22194"
}

export class CommandError {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}