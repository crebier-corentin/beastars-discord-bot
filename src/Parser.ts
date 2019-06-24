import {escapeRegExp} from "./helpers";
import {Action, ActionType} from "./types";

export default class Parser {
    prefix: string;

    helpRegex: RegExp = new RegExp(`^${this.prefix}\\s+(help|h)\\s?$`, "gi");
    chapterRegex: RegExp = new RegExp(`${this.prefix}\\s+(chapter|c)\\s+([0-9]+)\\s?$`, 'gi');

    constructor(prefix: string) {
        this.prefix = escapeRegExp(prefix);
    }

    parseCommand(command: string): Action {

        let match: RegExpExecArray;

        //Help
        if (this.helpRegex.test(command)) {
            return {type: ActionType.Help};
        }

        //Chapter
        if ((match = this.chapterRegex.exec(command)) != null) {
            return {type: ActionType.Chapter, chapter: Number(match[2])}
        }

        return {type: ActionType.Invalid};
    }

}