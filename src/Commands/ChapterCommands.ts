import axios, {AxiosResponse} from "axios";
import * as fs from "fs";
import {Stream} from "stream";
import {MangadexWithCache} from "../ExternalApi/Mangadex";
import {Command, CommandError, Manga} from "../types";
import {GoogleDriveWithCache} from "../ExternalApi/GoogleDrive";
import {mimetypeToExtension, tmpFilename} from "../helpers";

const mangadex = new MangadexWithCache();
const chapterCommandExecute = async function (msg, args, manga: Manga) {
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

        const response = await mangadex.getChapterPageLink(chapter, page, manga);

        //Error message
        if (typeof response === "string") {
            throw new CommandError(response);
        }
        //Site link + Image link
        else {
            msg.channel.send(`<${response.site}>`, {file: response.image});
        }
    } else {
    //Chapter link
        msg.channel.send(await mangadex.getChapterLink(chapter, manga));
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

        //Download file
        const res: AxiosResponse<Stream> = await axios.get(link, {
            responseType: "stream",
        });

        const tmpFile = tmpFilename(`bsr-${chapter}-${page}${mimetypeToExtension(res.headers["content-type"])}`);
        const fileStream = fs.createWriteStream(tmpFile);

        fileStream.on("finish", async () => {
            await msg.channel.send({file: tmpFile});
        });

        res.data.pipe(fileStream);
    },
};
