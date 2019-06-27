import {RichEmbed} from 'discord.js';
import {Context} from "../Context";
import {Command} from "../types";

export const HelpCommand: Command = {
    name: "help",
    desc: "Show this help message",
    usage: "help",
    aliases: ["h"],
    useDefaultPrefix: true,
    execute: function (msg) {

        const embed = new RichEmbed()
            .setTitle("Help");

        for (let i = 0; i < Context.commands.length; i++) {

            const command = Context.commands[i];

            //Title
            let title = "`";

            //Add default prefix
            if (command.useDefaultPrefix) {
                title += `${Context.prefix} `;
            }

            title += `${command.usage}\``;

            //Description
            let description = `${command.desc}`;

            //Example
            if (command.example != undefined) {

                let example = "`";
                //Add default prefix
                if (command.useDefaultPrefix) {
                    example += `${Context.prefix} `;
                }
                example += `${command.example}\``;

                description += `\n**Example :** \`${example}\``
            }

            //Add spacing if not last
            if (i != Context.commands.length - 1) {
                description += `\n${"=".repeat(50)}`;
            }

            embed.addField(title, description);


        }


        msg.channel.send({embed});

    }
};