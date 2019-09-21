"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IncorrectBeastarsQuote_1 = require("../ExternalApi/IncorrectBeastarsQuote");
exports.QuoteComment = {
    name: "quote",
    desc: "Send a random incorrect beastars quote (from incorrect-beastars.tumblr.com)",
    usage: "quote",
    aliases: ["q"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        const quote = await IncorrectBeastarsQuote_1.IncorrectBeastarsQuote.getRandomQuote();
        msg.channel.send(`<${quote.url}>`, { embed: { description: quote.text } });
    },
};
//# sourceMappingURL=QuoteCommand.js.map