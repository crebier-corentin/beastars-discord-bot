import {escapeRegExp} from "./helpers";
import {Action, ActionType, Manga} from "./types";

export default class Parser {
    prefix: string;

    helpRegex: RegExp;
    chapterRegex: RegExp;

    constructor(prefix: string) {
        this.prefix = escapeRegExp(prefix);

        this.helpRegex = new RegExp(`^${this.prefix}\\s+(help|h)\\s*$`, "gi");
        this.chapterRegex = new RegExp(`^(bs|bc)!\\s+([0-9]+)\\s*$`, 'gi');

    }

    parseCommand(command: string): Action {

        //Reset last index
        this.helpRegex.lastIndex = 0;
        this.chapterRegex.lastIndex = 0;

        let match: RegExpExecArray;

        //Help
        if (this.helpRegex.test(command)) {
            return {type: ActionType.Help};
        }

        //Chapter
        if ((match = this.chapterRegex.exec(command)) != null) {
            return {
                type: ActionType.Chapter,
                chapter: Number(match[2]),
                manga: match[1].toLowerCase() == "bs" ? Manga.Beastars : Manga.BeastComplex
            }
        }

        return {type: ActionType.Invalid};
    }

}