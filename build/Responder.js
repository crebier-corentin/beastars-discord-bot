"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const MangadexLinkGetter_1 = require("./MangadexLinkGetter");
class Responder {
    constructor(prefix) {
        this.prefix = prefix;
        this.mangadex = new MangadexLinkGetter_1.default();
    }
    async respond(action) {
        switch (action.type) {
            case types_1.ActionType.Invalid:
                return this.invalidCommand();
            case types_1.ActionType.Help:
                return this.helpCommand();
            case types_1.ActionType.Chapter:
                const chapterAction = action;
                return await this.chapterCommand(chapterAction.chapter, chapterAction.manga);
        }
    }
    invalidCommand() {
        return `Invalid command, to see the list of commands use \`${this.prefix} help\``;
    }
    helpCommand() {
        const delimiter = "=====================================================================";
        return `
\`${this.prefix} help\` or \`${this.prefix} h\`
Show this help command
${delimiter}
\`bs! [chapter]\`
Send link to Beastars chapter Nº[chapter]

**Example :** \`bs! 10\`
${delimiter}
\`bc! [chapter]\`
Send link to Beast Complex chapter Nº[chapter]

**Example :** \`bc! 2\`
`;
    }
    async chapterCommand(chapter, manga) {
        return await this.mangadex.getPageLink(chapter, manga);
    }
}
exports.default = Responder;
//# sourceMappingURL=Responder.js.map