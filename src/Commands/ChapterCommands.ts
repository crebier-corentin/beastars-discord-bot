import MangadexLinkGetter from "../ExternalApi/MangadexLinkGetter";
import {Command, CommandError, Manga} from "../types";

const mangadex = new MangadexLinkGetter();
const chapterCommandExecute = async function (msg, args, manga: Manga) {

    const chapter = Number(args[0]);

    //Missing chapter number
    if (isNaN(chapter)) {
        throw new CommandError(`Missing [chapter]\n\`${this.usage}\``);
    }

    //Is page
    if (args.length >= 2) {

        const page = Number(args[1]);

        if (isNaN(page)) {
            throw new CommandError(`Invalid [page] (must be a number)\n\`${this.usage}\``);
        }

        const response = await mangadex.getChapterPageLink(chapter, page, manga);

        //Error message
        if (typeof response == "string") {
            throw new CommandError(response);
        }
        //Site link + Image link
        else {
            msg.channel.send(`<${response.site}>`, {file: response.image});
        }

    }
    else {
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
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.Beastars);
    }


};

export const ChapterBCCommand: Command = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: async function (msg, args) {
        await chapterCommandExecute.call(this, msg, args, Manga.BeastComplex);
    }
};