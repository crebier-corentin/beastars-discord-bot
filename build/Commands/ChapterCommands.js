"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MangadexLinkGetter_1 = require("../MangadexLinkGetter");
const types_1 = require("../types");
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
//# sourceMappingURL=ChapterCommands.js.map