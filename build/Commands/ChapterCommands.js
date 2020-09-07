"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterPGCommand = exports.ChapterBSVCommand = exports.ChapterBSRCommand = exports.ChapterBSDCommand = exports.ChapterBCCommand = exports.ChapterBSCommand = void 0;
const Mangadex_1 = require("../ExternalApi/Mangadex");
const types_1 = require("../types");
const GoogleDrive_1 = require("../ExternalApi/GoogleDrive");
const FileDownloader_1 = require("../FileDownloader");
const nonSpoilerChannels = new Set(process.env.NON_SPOILER_CHANNELS.split(","));
const mangadex = new Mangadex_1.MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga, group = null) {
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
        const response = await mangadex.getChapterPageLink(chapter, page, manga, group);
        //Add spoiler prefix if needed
        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
        const file = isSpoiler ? await FileDownloader_1.FileDownloader.Download(response.image, "SPOILER_") : response.image;
        //Site link + Image link
        await msg.channel.send(`<${response.site}>`, { file });
    }
    else {
        //Chapter link
        msg.channel.send(await mangadex.getChapterLink(chapter, manga, group));
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
//Discord
exports.ChapterBSDCommand = {
    name: "bsd!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter] (Beastars Discord translation)",
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars, "Hybridgumi");
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
//Viz
exports.ChapterBSVCommand = {
    name: "bsv!",
    desc: "Post page Nº(page) from chapter (chapter) Viz translation",
    usage: "bsv! (chapter) (page)",
    example: "bsv! 1 10",
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
        const link = await drive.getPageLink(process.env.DRIVE_BEASTARS_VIZ_FOLDER_ID, chapter, page);
        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
        //Download file
        await msg.channel.send({ file: await FileDownloader_1.FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "") });
    },
};
//Paru's Graffiti
exports.ChapterPGCommand = {
    name: "pg!",
    desc: "Post page Nº(page) from chapter (chapter) of Paru's Graffiti",
    usage: "pg! (chapter) (page)",
    example: "pg! 1 3",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.ParusGraffiti);
    },
};
//# sourceMappingURL=ChapterCommands.js.map