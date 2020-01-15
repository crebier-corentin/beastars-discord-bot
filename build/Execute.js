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
const helpers_1 = require("./helpers");
const ImageCommands_1 = require("./Commands/ImageCommands");
const OOCCommand_1 = require("./Commands/OOCCommand");
const InfoCommands_1 = require("./Commands/InfoCommands");
const prefix = process.env.PREFIX;
const commands = [
    HelpCommand_1.HelpCommand,
    InfoCommands_1.MarkdownCommand,
    InfoCommands_1.SpoilerCommand,
    InfoCommands_1.MobileSpoilerCommand,
    InfoCommands_1.InterviewCommand,
    ChapterCommands_1.ChapterBSCommand,
    ChapterCommands_1.ChapterBCCommand,
    ChapterCommands_1.ChapterBSVCommand,
    ChapterCommands_1.ChapterBSRCommand,
    WikiCommand_1.WikiCommand,
    QuoteCommand_1.QuoteComment,
    OOCCommand_1.OocCommand,
    LegCommand_1.OfferLegCommand,
    LegCommand_1.LegStatsCommand,
    ImageCommands_1.ImageAddCommand,
    ImageCommands_1.ImageRemoveCommand,
    ImageCommands_1.ImageListCommand,
    ImageCommands_1.ImageCommand,
];
const parser = new Parser_1.default(prefix, commands);
Context_1.Context.prefix = prefix;
Context_1.Context.commands = commands;
function executeCommand(msg) {
    var _a, _b;
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
        if (!res.success) {
            //Triple cheeks sebun
            const sebunCheeks = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.emojis.find((emoji) => emoji.name == "Sebun_Cheeks");
            const legoshiLick = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.emojis.find((emoji) => emoji.name == "Legoshi_Lick");
            //Emoji missing
            if (sebunCheeks == null || legoshiLick == null)
                return;
            const cheeksRegex = new RegExp(`(${helpers_1.escapeRegExp(sebunCheeks.toString())}\\s*){3}`);
            //React with Legoshi_Lick
            if (cheeksRegex.test(msg.content)) {
                msg.react(legoshiLick);
            }
            //Ignore non commands
            return;
        }
        //Check admin
        if (res.command.adminOnly && (msg.guild.id !== process.env.ADMIN_GUILD || !helpers_1.isAdministrator(msg.member))) {
            throw new types_1.CommandError("Only administrators from the admin server can use this command");
        }
        const promise = res.command.execute.call(res.command, msg, res.args, res.fullArgs);
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