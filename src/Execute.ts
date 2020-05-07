import {Message} from "discord.js";
import Parser from "./Parser";
import {CommandError} from "./types";
import {Context} from "./Context";
import {HelpCommand} from "./Commands/HelpCommand";
import {
    ChapterBCCommand,
    ChapterBSCommand,
    ChapterBSDCommand,
    ChapterBSRCommand,
    ChapterBSVCommand
} from "./Commands/ChapterCommands";
import {WikiCommand} from "./Commands/WikiCommand";
import {QuoteComment} from "./Commands/QuoteCommand";
import {LegStatsCommand, OfferLegCommand} from "./Commands/LegCommand";
import {escapeRegExp, isAdministrator} from "./helpers";
import {
    ImageAddCommand, ImageCommand, ImageListCommand, ImageRemoveCommand,
} from "./Commands/ImageCommands";
import {OocCommand} from "./Commands/OOCCommand";
import {InterviewCommand, MarkdownCommand, MobileSpoilerCommand, SpoilerCommand} from "./Commands/InfoCommands";

const prefix = process.env.PREFIX;

const commands = [
    HelpCommand,
    MarkdownCommand,
    SpoilerCommand,
    MobileSpoilerCommand,
    InterviewCommand,

    ChapterBSCommand,
    ChapterBCCommand,
    ChapterBSDCommand,
    ChapterBSVCommand,
    ChapterBSRCommand,

    WikiCommand,

    QuoteComment,
    OocCommand,

    OfferLegCommand,
    LegStatsCommand,

    ImageAddCommand,
    ImageRemoveCommand,
    ImageListCommand,
    ImageCommand,
];
const parser = new Parser(prefix, commands);

Context.prefix = prefix;
Context.commands = commands;

export function executeCommand(msg: Message) {
    const exceptionHandler = (e) => {
        //Respond with error message
        if (e instanceof CommandError) {
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
            const sebunCheeks = msg.guild?.emojis.find((emoji) => emoji.name == "Sebun_Cheeks");
            const legoshiLick = msg.guild?.emojis.find((emoji) => emoji.name == "Legoshi_Lick");

            //Emoji missing
            if (sebunCheeks == null || legoshiLick == null) return;

            const cheeksRegex = new RegExp(`(${escapeRegExp(sebunCheeks.toString())}\\s*){3}`);

            //React with Legoshi_Lick
            if (cheeksRegex.test(msg.content)) {
                msg.react(legoshiLick);
            }

            //Ignore non commands
            return;
        }

        //Check admin
        if (res.command.adminOnly && (msg.guild.id !== process.env.ADMIN_GUILD || !isAdministrator(msg.member))) {
            throw new CommandError("Only administrators from the admin server can use this command");
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
