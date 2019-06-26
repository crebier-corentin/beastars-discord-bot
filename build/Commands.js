"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("./types");
const MangadexLinkGetter_1 = require("./MangadexLinkGetter");
const Wikia_1 = require("./Wikia");
const Context_1 = require("./Context");
exports.InvalidCommand = {
    name: "",
    desc: "",
    usage: "",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function () {
        throw new types_1.CommandError(`Invalid command, to see the list of commands use \`${Context_1.Context.prefix} help\``);
    }
};
exports.HelpCommand = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (msg) {
        let helpMessage = "";
        for (const command of Context_1.Context.commands) {
            helpMessage += "`";
            //Add default prefix
            if (command.useDefaultPrefix) {
                helpMessage += `${Context_1.Context.prefix} `;
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
        const embed = new discord_js_1.RichEmbed()
            .setTitle("This is your title, it can hold 256 characters")
            .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
            /*
             * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
             */
            .setColor(0x00AE86)
            .setDescription("This is the main body of text, it can hold 2048 characters.")
            .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
            .setImage("http://i.imgur.com/yVpymuV.png")
            .setThumbnail("http://i.imgur.com/p2qNFag.png")
            /*
             * Takes a Date object, defaults to current date.
             */
            .setTimestamp()
            .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
            .addField("This is a field title, it can hold 256 characters", "This is a field value, it can hold 1024 characters.")
            /*
             * Inline fields may not display as inline if the thumbnail and/or image is too big.
             */
            .addField("Inline Field", "They can also be inline.", true)
            /*
             * Blank field, useful to create some space.
             */
            .addBlankField(true)
            .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
        msg.channel.send(helpMessage);
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
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars);
    }
};
exports.ChapterBCCommand = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    useDefaultPrefix: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.BeastComplex);
    }
};
exports.WikiCommand = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
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