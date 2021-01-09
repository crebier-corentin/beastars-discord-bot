import {MangadexWithCache} from "../ExternalApi/Mangadex";
import {Command, CommandError, Manga} from "../types";
import {GoogleDriveWithCache} from "../ExternalApi/GoogleDrive";
import {FileDownloader} from "../FileDownloader";
import {Message} from "discord.js";

const nonSpoilerChannels: Set<string> = new Set(process.env.NON_SPOILER_CHANNELS.split(","));

const mangadex = new MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga: Manga, group: string | null = null) {
    const chapter = Number(args[0]);

    //Missing chapter number
    if (Number.isNaN(chapter)) {
        throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }

    //Is page
    if (args.length >= 2) {
        const page = Number(args[1]);

        if (Number.isNaN(page)) {
            throw new CommandError(`Invalid [page] (must be a number)\n\`${this.usage}\``);
        }

        const response = await mangadex.getChapterPageLink(chapter, page, manga, group);

        //Add spoiler prefix if needed
        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
        const file = isSpoiler ? await FileDownloader.Download(response.image, "SPOILER_") : response.image;

        //Site link + Image link
        await msg.channel.send(`<${response.site}>`, {files : [file]});

    }
    else {
        //Chapter link
        msg.channel.send(await mangadex.getChapterLink(chapter, manga, group));
    }
};

export const ChapterBSCommand: Command = {
    name: "bs!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.Beastars);
    },


};

export const ChapterBCCommand: Command = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.BeastComplex);
    },
};

//Discord
export const ChapterBSDCommand: Command = {
    name: "bsd!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter] (Beastars Discord translation)",
    usage: "bsd! [chapter] (page)",
    example: "bsd! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.Beastars, "Hybridgumi");
    },
};

//Drive//
const drive = new GoogleDriveWithCache();
async function googleDriveChapterCommandExecute(msg: Message, args: string[], driveId: string) {
    const chapter = Number(args[0]);
    const page = Number(args[1]);

    //Missing chapter
    if (Number.isNaN(chapter)) {
        throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }

    //Missing page
    if (Number.isNaN(page)) {
        throw new CommandError(`Missing [page]\n\`${this.usage}\``);
    }

    const link = await drive.getPageLink(driveId, chapter, page);

    const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);

    //Download file
    await msg.channel.send({files: [await FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "")]});
}

//Beastars Drive HCS
export const ChapterBSGCommand: Command = {
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
export const ChapterBSDGCommand: Command = {
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
export const ChapterBSRCommand: Command = {
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
export const ChapterBSVCommand: Command = {
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

//Beast Complex Drive
export const ChapterBCGCommand: Command = {
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
export const ChapterBCRCommand: Command = {
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
export const ChapterBCVCommand: Command = {
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
export const ChapterPGCommand: Command = {
    name: "pg!",
    desc: "Post page Nº(page) from chapter (chapter) of Paru's Graffiti",
    usage: "pg! (chapter) (page)",
    example: "pg! 1 3",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.ParusGraffiti);
    },
};

