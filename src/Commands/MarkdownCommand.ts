import {Command} from "../types";

export const MarkdownCommand: Command = {
    name: "markdown",
    desc: "Link to the discord markdown help page",
    usage: "markdown",
    aliases: ["markdown101"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        await msg.channel.send("https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-");
    },
};
