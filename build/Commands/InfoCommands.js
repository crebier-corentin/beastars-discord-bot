"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownCommand = {
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
exports.SpoilerCommand = {
    name: "spoiler",
    desc: "Link to the discord spoiler help page",
    usage: "spoiler",
    aliases: ["spoilers", "mspoiler"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        await msg.channel.send("https://support.discordapp.com/hc/en-us/articles/360022320632-Spoiler-Tags-");
    },
};
exports.MobileSpoilerCommand = {
    name: "mobilespoiler",
    desc: "Information on how to send an spoiler image on mobile",
    usage: "mobilespoiler",
    aliases: ["mobile", "mspoiler"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        await msg.channel.send(`Adding Spoiler tag on images on mobile
- Rename the file \`\`SPOILER_\`\`
-- rename, not add notes or caption 
-- SPOILER need needs to all caps
- EX: \`\`SPOILER_test\`\`
https://support.discordapp.com/hc/en-us/community/posts/360040470332-Image-spoiler-for-mobile`);
    },
};
exports.InterviewCommand = {
    name: "interview",
    desc: "Information about a spanish beastars interview",
    usage: "interview",
    aliases: ["end", "vol20"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg) {
        await msg.channel.send(`September 2019 interview with Paru
<https://twitter.com/RamenParaDos/status/1171544074622558209?s=19>

<https://docs.google.com/document/d/1OFtZ5NSSlIVvovq5zOqM6DSs0cbBL7wcCIftMZ8YgWg/edit?usp=drivesdk>
Yes this mean Beastars may end around chapter 178
A volume typically has 9 chapters
Vol 1 has 7 due to chapter 1
Vol 14: 124

Estimation 
\`\`\`Vol 15: 133
Vol 16: 142
Vol 17: 151
Vol 18: 160
Vol 19: 169
Vol 20: 178 +/- 1 for long last chapter\`\`\``);
    },
};
//# sourceMappingURL=InfoCommands.js.map