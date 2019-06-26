"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("./Commands");
const Parser_1 = require("./Parser");
const prefix = process.env.PREFIX;
const commands = [Commands_1.HelpCommand, Commands_1.ChapterBSCommand, Commands_1.ChapterBCCommand, Commands_1.WikiCommand];
const parser = new Parser_1.default(prefix, commands);
function executeCommand(msg) {
    try {
        const res = parser.parseCommand(msg.content);
        //Ignore non commands
        if (!res.success)
            return;
        res.command.execute.call(res.command, { prefix, commands }, msg, res.args);
    }
    catch (e) {
        console.log(e);
    }
}
exports.executeCommand = executeCommand;
//# sourceMappingURL=Execute.js.map