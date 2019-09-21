import {Command} from "../types";
import {Imgur} from "../ExternalApi/Imgur";

export const OocCommand: Command = {
    name: "ooc",
    desc: "Send a random out of context image from the manga",
    usage: "ooc",
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        const image = await Imgur.getRandomImageInAlbum("tCDHjVx");

        msg.channel.send({file: image});
    },
};
