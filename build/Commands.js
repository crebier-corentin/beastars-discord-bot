"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const MangadexLinkGetter_1 = require("./MangadexLinkGetter");
const Wikia_1 = require("./Wikia");
exports.InvalidCommand = {
    name: "",
    desc: "",
    usage: "",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (infos) {
        throw new types_1.CommandError(`Invalid command, to see the list of commands use \`${infos.prefix} help\``);
    }
};
exports.HelpCommand = {
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
const mangadex = new MangadexLinkGetter_1.default();
const chapterCommandExecute = async function (infos, msg, args, manga) {
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
    useDefaultPrefix: false,
    execute: async function (infos, msg, args) {
        await chapterCommandExecute.call(this, infos, msg, args, types_1.Manga.Beastars);
    }
};
exports.ChapterBCCommand = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    useDefaultPrefix: false,
    execute: async function (infos, msg, args) {
        await chapterCommandExecute.call(this, infos, msg, args, types_1.Manga.BeastComplex);
    }
};
exports.WikiCommand = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
    aliases: ["w"],
    useDefaultPrefix: true,
    execute: async function (infos, msg, args) {
        //Missing query
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [query]\n\`${this.usage}\``);
        }
        const query = args.join(" ");
        msg.channel.send(await Wikia_1.Wikia.searchFirstLink(query));
    }
};
//# sourceMappingURL=Commands.js.map