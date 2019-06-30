"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const types_1 = require("./types");
const Context_1 = require("./Context");
const HelpCommand_1 = require("./Commands/HelpCommand");
const ChapterCommands_1 = require("./Commands/ChapterCommands");
const WikiCommand_1 = require("./Commands/WikiCommand");
const QuoteCommand_1 = require("./Commands/QuoteCommand");
const LegCommand_1 = require("./Commands/LegCommand");
const prefix = process.env.PREFIX;
const commands = [HelpCommand_1.HelpCommand, ChapterCommands_1.ChapterBSCommand, ChapterCommands_1.ChapterBCCommand, WikiCommand_1.WikiCommand, QuoteCommand_1.QuoteComment, LegCommand_1.OfferLegCommand, LegCommand_1.LegStatsCommand];
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