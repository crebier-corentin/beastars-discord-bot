"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterPGCommand = exports.ChapterBCVCommand = exports.ChapterBCRCommand = exports.ChapterBCGCommand = exports.ChapterBSVCommand = exports.ChapterBSRCommand = exports.ChapterBSDGCommand = exports.ChapterBSGCommand = exports.ChapterBSDCommand = exports.ChapterBCCommand = exports.ChapterBSCommand = void 0;
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
        await msg.channel.send(`<${response.site}>`, { files: [file] });
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
    usage: "bsd! [chapter] (page)",
    example: "bsd! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars, "Hybridgumi");
    },
};
//Drive//
const drive = new GoogleDrive_1.GoogleDriveWithCache();
async function googleDriveChapterCommandExecute(msg, args, driveId) {
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
    const link = await drive.getPageLink(driveId, chapter, page);
    const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
    //Download file
    await msg.channel.send({ files: [await FileDownloader_1.FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "")] });
}
//Beastars Drive HCS
exports.ChapterBSGCommand = {
    name: "bsg!",
    desc: "Post page Nº(page) from chapter (chapter) HCS translation from Google Drive",
    usage: "bsg! (chapter) (page)",
    example: "bsg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_HCS_FOLDER_ID);
    },
};
//Beastars Drive Discord
exports.ChapterBSDGCommand = {
    name: "bsdg!",
    desc: "Post page Nº(page) from chapter (chapter) Beastars Discord translation translation from Google Drive",
    usage: "bsdg! (chapter) (page)",
    example: "bsdg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_DISCORD_FOLDER_ID);
    },
};
//Beastars Raw
exports.ChapterBSRCommand = {
    name: "bsr!",
    desc: "Post page Nº(page) from chapter (chapter)",
    usage: "bsr! (chapter) (page)",
    example: "bsr! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_FOLDER_ID);
    },
};
//Beastars Viz
exports.ChapterBSVCommand = {
    name: "bsv!",
    desc: "Post page Nº(page) from chapter (chapter) Viz translation",
    usage: "bsv! (chapter) (page)",
    example: "bsv! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_VIZ_FOLDER_ID);
    },
};
//Beast Complex Raw
exports.ChapterBCGCommand = {
    name: "bcg!",
    desc: "Post page Nº(page) from chapter (chapter) (Beast Complex) from Google Drive",
    usage: "bcg! (chapter) (page)",
    example: "bcg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_FOLDER_ID);
    },
};
//Beast Complex Raw
exports.ChapterBCRCommand = {
    name: "bcr!",
    desc: "Post page Nº(page) from chapter (chapter) (Beast Complex)",
    usage: "bcr! (chapter) (page)",
    example: "bcr! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_RAW_FOLDER_ID);
    },
};
//Beast Complex Viz
exports.ChapterBCVCommand = {
    name: "bcv!",
    desc: "Post page Nº(page) from chapter (chapter) Viz translation (Beast Complex)",
    usage: "bcv! (chapter) (page)",
    example: "bcv! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_VIZ_FOLDER_ID);
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