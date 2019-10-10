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

export const MobileSpoilerCommand: Command = {
    name: "markdown",
    desc: "Information on how to send an spoiler image on mobile",
    usage: "mobilespoiler",
    aliases: ["mobile", "mspoiler"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        await msg.channel.send(`\`\`\`Adding Spoiler tag on images on mobile
- Rename the file \`\`SPOILER_\`\`
-- rename, not add notes or caption 
-- SPOILER need needs to all caps
- EX: \`\`SPOILER_test\`\` \`\`\`
https://support.discordapp.com/hc/en-us/community/posts/360040470332-Image-spoiler-for-mobile`);
    },
};
