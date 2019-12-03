"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Context_1 = require("../Context");
const helpers_1 = require("../helpers");
exports.HelpCommand = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    adminOnly: false,
    execute(msg) {
        const isAdmin = helpers_1.isAdministrator(msg.member) && msg.guild.id === process.env.ADMIN_GUILD;
        const embed = new discord_js_1.RichEmbed()
            .setTitle("Help");
        for (let i = 0; i < Context_1.Context.commands.length; i++) {
            const command = Context_1.Context.commands[i];
            //Ignore adminOnly commands if non admin
            if (!isAdmin && command.adminOnly) {
                continue;
            }
            let title = "";
            //Title
            if (command.adminOnly) {
                title += "**ADMIN ONLY**\n";
            }
            title += "`";
            //Add default prefix
            if (command.useDefaultPrefix) {
                title += `${Context_1.Context.prefix} `;
            }
            title += `${command.usage}\``;
            //Description
            let description = `${command.desc}`;
            //Example
            if (command.example != undefined) {
                let example = "`";
                //Add default prefix
                if (command.useDefaultPrefix) {
                    example += `${Context_1.Context.prefix} `;
                }
                example += `${command.example}\``;
                description += `\n**Example :** \`${example}\``;
            }
            //Add spacing if not last
            if (i != Context_1.Context.commands.length - 1) {
                description += `\n${"=".repeat(50)}`;
            }
            embed.addField(title, description);
        }
        msg.channel.send({ embed });
    },
};
//# sourceMappingURL=HelpCommand.js.map