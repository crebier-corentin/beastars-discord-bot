import {Command, CommandError} from "../types";
import {IncorrectBeastarsQuote} from "../ExternalApi/IncorrectBeastarsQuote";

export const QuoteComment: Command = {
    name: "quote",
    desc: "Send a random incorrect beastars quote (from incorrect-beastars.tumblr.com)",
    usage: "quote",
    aliases: ["q"],
    useDefaultPrefix: true,
    execute: async function (msg) {
        msg.channel.send({embed: {description: await IncorrectBeastarsQuote.getRandomQuote()}});
    }
};