import {Message, RichEmbed} from "discord.js";
import {ChapterBCCommand, ChapterBSCommand, HelpCommand, WikiCommand} from "./Commands";
import Parser from "./Parser";
import {CommandError} from "./types";

const prefix = process.env.PREFIX;

const commands = [HelpCommand, ChapterBSCommand, ChapterBCCommand, WikiCommand];
const parser = new Parser(prefix, commands);

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

        //Ignore non commands
        if (!res.success) return;

        res.command.execute.call(res.command, {prefix, commands}, msg, res.args).catch(exceptionHandler);

    }
    catch (e) {
        exceptionHandler(e);
    }
}