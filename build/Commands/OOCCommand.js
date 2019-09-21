"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Imgur_1 = require("../ExternalApi/Imgur");
exports.OocCommand = {
    name: "ooc",
    desc: "Send a random out of context image from the manga",
    usage: "ooc",
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        const image = await Imgur_1.Imgur.getRandomImageInAlbum("tCDHjVx");
        msg.channel.send({ file: image });
    },
};
//# sourceMappingURL=OOCCommand.js.map