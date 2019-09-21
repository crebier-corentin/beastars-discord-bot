"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const Mangadex_1 = require("../ExternalApi/Mangadex");
const types_1 = require("../types");
const GoogleDrive_1 = require("../ExternalApi/GoogleDrive");
const helpers_1 = require("../helpers");
const mangadex = new Mangadex_1.MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga) {
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
        const response = await mangadex.getChapterPageLink(chapter, page, manga);
        //Error message
        if (typeof response === "string") {
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
        //Download file
        const res = await axios_1.default.get(link, {
            responseType: "stream",
        });
        const tmpFile = helpers_1.tmpFilename(`bsr-${chapter}-${page}${helpers_1.mimetypeToExtension(res.headers["content-type"])}`);
        const fileStream = fs.createWriteStream(tmpFile);
        fileStream.on("finish", async () => {
            await msg.channel.send({ file: tmpFile });
        });
        res.data.pipe(fileStream);
    },
};
//# sourceMappingURL=ChapterCommands.js.map