import {MangadexWithCache} from "../ExternalApi/Mangadex";
import {Command, CommandError, Manga} from "../types";
import {GoogleDriveWithCache} from "../ExternalApi/GoogleDrive";
import {FileDownloader} from "../FileDownloader";

const nonSpoilerChannels: Set<string> = new Set(process.env.NON_SPOILER_CHANNELS.split(","));

const mangadex = new MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga: Manga, group: string | null = null) {
    const chapter = Number(args[0]);

    //Missing chapter number
    if (Number.isNaN(chapter)) {
        throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }

    //Beast Complex 7
    if (manga === Manga.BeastComplex && chapter === 7) {
        return await msg.channel.send("https://drive.google.com/folderview?id=1YSxes4C4YBz2CEoc4CoAvQHW9UZzBqeb");
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
        await msg.channel.send(`<${response.site}>`, {file});

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
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    async execute(msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.Beastars, "Hybridgumi");
    },
};

//Raw
const drive = new GoogleDriveWithCache();
export const ChapterBSRCommand: Command = {
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
            throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
        }

        //Missing page
        if (Number.isNaN(page)) {
            throw new CommandError(`Missing [page]\n\`${this.usage}\``);
        }

        const link = await drive.getPageLink(process.env.DRIVE_BEASTARS_FOLDER_ID, chapter, page);

        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);

        //Download file
        await msg.channel.send({files: [await FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "")]});
    },
};

//Viz
export const ChapterBSVCommand: Command = {
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
            throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
        }

        //Missing page
        if (Number.isNaN(page)) {
            throw new CommandError(`Missing [page]\n\`${this.usage}\``);
        }

        const link = await drive.getPageLink(process.env.DRIVE_BEASTARS_VIZ_FOLDER_ID, chapter, page);

        const isSpoiler = !nonSpoilerChannels.has(msg.channel.id);

        //Download file
        await msg.channel.send({files: [await FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "")]});
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
