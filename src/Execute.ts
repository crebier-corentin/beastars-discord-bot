import {Message} from "discord.js";
import {ChapterBCCommand, ChapterBSCommand, HelpCommand} from "./Commands";
import Parser from "./Parser";

const prefix = process.env.PREFIX;

const commands = [HelpCommand, ChapterBSCommand, ChapterBCCommand];
const parser = new Parser(prefix, commands);

export function executeCommand(msg: Message) {
    try {
        const res = parser.parseCommand(msg.content);

        //Ignore non commands
        if (!res.success) return;

        res.command.execute.call(res.command, {prefix, commands}, msg, res.args);

    } catch (e) {
        console.log(e);
    }
}