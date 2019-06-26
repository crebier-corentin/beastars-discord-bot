import {Client, Message, RichEmbed} from 'discord.js';
import {CommandError, Manga} from "./types";
import MangadexLinkGetter from "./MangadexLinkGetter";
import {Wikia} from "./Wikia";
import {Context} from "./Context";

export interface Command {
    name: string;
    desc: string;
    usage: string;
    example?: string;
    aliases?: string[];
    execute: (msg: Message, args: string[]) => void | Promise<void>;

    useDefaultPrefix: boolean;
    customPrefix?: string;
}

export const InvalidCommand: Command = {
    name: "",
    desc: "",
    usage: "",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function () {
        throw new CommandError(`Invalid command, to see the list of commands use \`${Context.prefix} help\``);
    }
};

export const HelpCommand: Command = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (msg) {

        const embed = new RichEmbed()
            .setTitle("Help")
            .setAuthor(Context.client.user.username, Context.client.user.avatar);

        for (let i = 0; i < Context.commands.length; i++) {

            const command = Context.commands[i];

            //Title
            let title = "`";

            //Add default prefix
            if (command.useDefaultPrefix) {
                title += `${Context.prefix} `;
            }

            title += `${command.usage}\``;

            //Description
            let description = `${command.desc}`;

            //Example
            if (command.example != undefined) {

                let example = "`";
                //Add default prefix
                if (command.useDefaultPrefix) {
                    example += `${Context.prefix} `;
                }
                example += `${command.example}\``;

                description += `\n**Example :** \`${example}\``
            }

            //Add spacing if not last
            if (i != Context.commands.length - 1) {
                description += `\n${"=".repeat(50)}`;
            }

            embed.addField(title, description);


        }


        msg.channel.send({embed});

    }
};

const mangadex = new MangadexLinkGetter();
const chapterCommandExecute = async function (msg, args, manga: Manga) {

    const chapter = Number(args[0]);

    //Missing chapter number
    if (isNaN(chapter)) {
        throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }

    //Is page
    if (args.length >= 2) {

        const page = Number(args[1]);

        if (isNaN(page)) {
            throw new CommandError(`Invalid [page] (must be a number)\n\`${this.usage}\``);
        }

        const response = await mangadex.getChapterPageLink(chapter, page, manga);

        //Error message
        if (typeof response == "string") {
            throw new CommandError(response);
        }
        //Site link + Image link
        else {
            msg.channel.send(`<${response.site}>`, {file: response.image});
        }

    }
    else {
        //Chapter link
        msg.channel.send(await mangadex.getChapterLink(chapter, manga));
    }
};


export const ChapterBSCommand: Command = {
    name: "bs!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.Beastars);
    }


};

export const ChapterBCCommand: Command = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.BeastComplex);
    }
};

export const WikiCommand: Command = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
    example: "wiki Haru",
    aliases: ["w"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {

        //Missing query
        if (args.length == 0) {

            throw new CommandError(`Missing [query]\n\`${this.usage}\``);
        }

        const query = args.join(" ");

        msg.channel.send(await Wikia.searchFirstLink(query));

    }
};