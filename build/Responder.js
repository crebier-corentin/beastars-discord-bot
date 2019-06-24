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
                return await this.chapterCommand(action.chapter);
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
\`${this.prefix} chapter [chapter]\` or \`${this.prefix} c [chapter]\`
Send link to chapter Nº[chapter]

**Example :** \`${this.prefix} chapter 10\`
`;
    }
    async chapterCommand(chapter) {
        return await this.mangadex.getPageLink(chapter);
    }
}
exports.default = Responder;
//# sourceMappingURL=Responder.js.map