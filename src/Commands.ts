import {Message} from 'discord.js';
import {Manga} from "./types";
import MangadexLinkGetter from "./MangadexLinkGetter";

export interface Command {
    name: string;
    desc: string;
    usage: string;
    example?: string;
    aliases?: string[];
    execute: (infos: { prefix: string, commands: Command[] }, msg: Message, args: string[]) => void | Promise<void>;

    useDefaultPrefix: boolean;
    customPrefix?: string;
}

export const InvalidCommand: Command = {
    name: "",
    desc: "",
    usage: "",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (infos) {
        `Invalid command, to see the list of commands use \`${infos.prefix} help\``;
    }
};

export const HelpCommand: Command = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (infos, msg) {

        let helpMessage = "";

        for (const command of infos.commands) {

            helpMessage += "`";

            //Add default prefix
            if (command.useDefaultPrefix) {
                helpMessage += `${infos.prefix} `;
            }

            helpMessage += `${command.usage}\``;

            //Desc
            helpMessage += `\n${command.desc}`;

            //Example
            if (command.example != undefined) {
                helpMessage += `\n**Example :** ${command.example}`;
            }

            //Delimiter
            helpMessage += "\n=====================================================================\n\n";
        }

        msg.channel.send(helpMessage);

    }
};

const mangadex = new MangadexLinkGetter();

export const ChapterBSCommand: Command = {
    name: "bs!",
    desc: "Send link to Beastars chapter Nº[chapter]",
    usage: "bs! [chapter]",
    useDefaultPrefix: false,
    execute: async function (infos, msg, args) {

        const chapter = Number(args[0]);

        //Missing chapter number
        if (isNaN(chapter)) {
            msg.channel.send(`Missing chapter\n\`${this.usage}\``);
            return;
        }

        msg.channel.send(await mangadex.getPageLink(chapter, Manga.Beastars));
    }

};

export const ChapterBCCommand: Command = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter]",
    usage: "bc! [chapter]",
    useDefaultPrefix: false,
    execute: async function (infos, msg, args) {

        const chapter = Number(args[0]);

        //Missing chapter number
        if (isNaN(chapter)) {
            msg.channel.send(`Missing chapter\n\`${this.usage}\``);
            return;
        }

        msg.channel.send(await mangadex.getPageLink(chapter, Manga.BeastComplex));
    }

};
