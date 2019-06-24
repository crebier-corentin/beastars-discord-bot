"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const types_1 = require("./types");
class Parser {
    constructor(prefix) {
        this.prefix = helpers_1.escapeRegExp(prefix);
        this.helpRegex = new RegExp(`^${this.prefix}\\s+(help|h)\\s*$`, "gi");
        this.chapterRegex = new RegExp(`^(bs|bc)!\\s+([0-9]+)\\s*$`, 'gi');
    }
    parseCommand(command) {
        //Reset last index
        this.helpRegex.lastIndex = 0;
        this.chapterRegex.lastIndex = 0;
        let match;
        //Help
        if (this.helpRegex.test(command)) {
            return { type: types_1.ActionType.Help };
        }
        //Chapter
        if ((match = this.chapterRegex.exec(command)) != null) {
            return {
                type: types_1.ActionType.Chapter,
                chapter: Number(match[2]),
                manga: match[1].toLowerCase() == "bs" ? types_1.Manga.Beastars : types_1.Manga.BeastComplex
            };
        }
        return { type: types_1.ActionType.Invalid };
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map