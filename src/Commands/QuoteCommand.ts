import {Command} from "../types";
import {IncorrectBeastarsQuote} from "../ExternalApi/IncorrectBeastarsQuote";

export const QuoteComment: Command = {
    name: "quote",
    desc: "Send a random incorrect beastars quote (from incorrect-beastars.tumblr.com)",
    usage: "quote",
    aliases: ["q"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        const quote = await IncorrectBeastarsQuote.getRandomQuote();

        msg.channel.send(`<${quote.url}>`, {embed: {description: quote.text}});
    },
};
