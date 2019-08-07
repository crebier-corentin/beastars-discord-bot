"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Imgur_1 = require("../ExternalApi/Imgur");
exports.OOCCOmannd = {
    name: "ooc",
    desc: "Send a random out of context image from the manga",
    usage: "ooc",
    useDefaultPrefix: true,
    adminOnly: false,
    execute: async function (msg) {
        const image = await Imgur_1.Imgur.getRandomImageInAlbum("a");
        msg.channel.send({ file: image });
    }
};
//# sourceMappingURL=OOCCommand.js.map