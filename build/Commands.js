"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("./types");
const MangadexLinkGetter_1 = require("./MangadexLinkGetter");
const Wikia_1 = require("./Wikia");
const Context_1 = require("./Context");
exports.HelpCommand = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (msg) {
        const embed = new discord_js_1.RichEmbed()
            .setTitle("Help");
        for (let i = 0; i < Context_1.Context.commands.length; i++) {
            const command = Context_1.Context.commands[i];
            //Title
            let title = "`";
            //Add default prefix
            if (command.useDefaultPrefix) {
                title += `${Context_1.Context.prefix} `;
            }
            title += `${command.usage}\``;
            //Description
            let description = `${command.desc}`;
            //Example
            if (command.example != undefined) {
                let example = "`";
                //Add default prefix
                if (command.useDefaultPrefix) {
                    example += `${Context_1.Context.prefix} `;
                }
                example += `${command.example}\``;
                description += `\n**Example :** \`${example}\``;
            }
            //Add spacing if not last
            if (i != Context_1.Context.commands.length - 1) {
                description += `\n${"=".repeat(50)}`;
            }
            embed.addField(title, description);
        }
        msg.channel.send({ embed });
    }
};
const mangadex = new MangadexLinkGetter_1.default();
const chapterCommandExecute = async function (msg, args, manga) {
    const chapter = Number(args[0]);
    //Missing chapter number
    if (isNaN(chapter)) {
        throw new types_1.CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }
    //Is page
    if (args.length >= 2) {
        const page = Number(args[1]);
        if (isNaN(page)) {
            throw new types_1.CommandError(`Invalid [page] (must be a number)\n\`${this.usage}\``);
        }
        const response = await mangadex.getChapterPageLink(chapter, page, manga);
        //Error message
        if (typeof response == "string") {
            throw new types_1.CommandError(response);
        }
        //Site link + Image link
        else {
            msg.channel.send(`<${response.site}>`, { file: response.image });
        }
    }
    else {
        //Chapter link
        msg.channel.send(await mangadex.getChapterLink(chapter, manga));
    }
};
exports.ChapterBSCommand = {
    name: "bs!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars);
    }
};
exports.ChapterBCCommand = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.BeastComplex);
    }
};
exports.WikiCommand = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
    example: "wiki Haru",
    aliases: ["w"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {
        //Missing query
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [query]\n\`${this.usage}\``);
        }
        const query = args.join(" ");
        msg.channel.send(await Wikia_1.Wikia.searchFirstLink(query));
    }
};
//# sourceMappingURL=Commands.js.map