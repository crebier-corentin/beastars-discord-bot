"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("./Commands");
const Parser_1 = require("./Parser");
const types_1 = require("./types");
const Context_1 = require("./Context");
const prefix = process.env.PREFIX;
const commands = [Commands_1.HelpCommand, Commands_1.ChapterBSCommand, Commands_1.ChapterBCCommand, Commands_1.WikiCommand];
const parser = new Parser_1.default(prefix, commands);
Context_1.Context.prefix = prefix;
Context_1.Context.commands = commands;
function executeCommand(msg) {
    const exceptionHandler = (e) => {
        //Respond with error message
        if (e instanceof types_1.CommandError) {
            msg.channel.send(`:x: ${e.message}`);
        }
        //Log error
        else {
            console.log(e);
        }
    };
    try {
        const res = parser.parseCommand(msg.content);
        //Ignore non commands
        if (!res.success)
            return;
        const promise = res.command.execute.call(res.command, msg, res.args);
        if (promise instanceof Promise) {
            promise.catch(exceptionHandler);
        }
    }
    catch (e) {
        exceptionHandler(e);
    }
}
exports.executeCommand = executeCommand;
//# sourceMappingURL=Execute.js.map