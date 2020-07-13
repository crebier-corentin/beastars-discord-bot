import {Message} from "discord.js";

export enum Manga {
    Beastars = "20523",
    BeastComplex = "22194",
    ParusGraffiti = "42209"
}

export class CommandError {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export interface Command {
    name: string;
    desc: string;
    usage: string;
    example?: string;
    aliases?: string[];
    execute: (msg: Message, args: string[], fullArgs: string) => void | Promise<void>;

    useDefaultPrefix: boolean;
    customPrefix?: string;
    adminOnly: boolean;
}
