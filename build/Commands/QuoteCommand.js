"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IncorrectBeastarsQuote_1 = require("../ExternalApi/IncorrectBeastarsQuote");
exports.QuoteComment = {
    name: "quote",
    desc: "Send a random incorrect beastars quote (from incorrect-beastars.tumblr.com)",
    usage: "quote",
    aliases: ["q"],
    useDefaultPrefix: true,
    execute: async function (msg) {
        msg.channel.send({ embed: { description: await IncorrectBeastarsQuote_1.IncorrectBeastarsQuote.getRandomQuote() } });
    }
};
//# sourceMappingURL=QuoteCommand.js.map