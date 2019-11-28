"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mangadex_1 = require("../ExternalApi/Mangadex");
const types_1 = require("../types");
const GoogleDrive_1 = require("../ExternalApi/GoogleDrive");
const FileDownloader_1 = require("../FileDownloader");
const nonSpoilerChannels = new Set(process.env.NON_SPOILER_CHANNELS.split(","));
const mangadex = new Mangadex_1.MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga) {
    const chapter = Number(args[0]);
    //Missing chapter number
    if (Number.isNaN(chapter)) {
        throw new types_1.CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }
    //Beast Complex 7
    if (manga === types_1.Manga.BeastComplex && chapter === 7) {
        return await msg.channel.send("https://drive.google.com/folderview?id=1YSxes4C4YBz2CEoc4CoAvQHW9UZzBqeb");
    }
    //Is page
    if (args.length >= 2) {
        const page = Number(args[1]);
        if (Number.isNaN(page)) {
            throw new types_1.CommandError(`Invalid [page] (must be a number)\n\`${this.usage}\``);
        }
        const response = await mangadex.getChapterPageLink(chapter, page, manga);
        //Add spoiler prefix if needed
        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
        const file = isSpoiler ? await FileDownloader_1.FileDownloader.Download(response.image, "SPOILER_") : response.image;
        //Site link + Image link
        await msg.channel.send(`<${response.site}>`, { file });
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
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars);
    },
};
exports.ChapterBCCommand = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.BeastComplex);
    },
};
//Raw
const drive = new GoogleDrive_1.GoogleDriveWithCache();
exports.ChapterBSRCommand = {
    name: "bsr!",
    desc: "Post page Nº(page) from chapter (chapter)",
    usage: "bsr! (chapter) (page)",
    example: "bsr! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        const chapter = Number(args[0]);
        const page = Number(args[1]);
        //Missing chapter
        if (Number.isNaN(chapter)) {
            throw new types_1.CommandError(`Missing [chapter]\n\`${this.usage}\``);
        }
        //Missing page
        if (Number.isNaN(page)) {
            throw new types_1.CommandError(`Missing [page]\n\`${this.usage}\``);
        }
        const link = await drive.getPageLink(process.env.DRIVE_BEASTARS_FOLDER_ID, chapter, page);
        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
        //Download file
        await msg.channel.send({ file: await FileDownloader_1.FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "") });
    },
};
//# sourceMappingURL=ChapterCommands.js.map