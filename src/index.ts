require('dotenv').config();
import "reflect-metadata";
import {createConnection, In} from "typeorm";

import {Context} from "./Context";
import {executeCommand} from "./Execute";
import {User} from "./db/entities/User";
import {asyncForEach} from "./helpers";

import Discord = require('discord.js');
import {Guild} from "discord.js";


//Database
createConnection().then(() => {

//Client
    const client = new Discord.Client();
    Context.client = client;

    const updateAllNicknames = async () => {

        let guildUsers: { guild: Guild, users: User[] }[] = [];

        //Get all users
        for (const guild of client.guilds.array()) {

            const ids = guild.members.array().map(m => m.id);

            const users = await User.find({where: {discordId: In(ids)}});

            if (users.length > 0) {
                guildUsers.push({guild, users});
            }
        }

        //Update nicknames
        await asyncForEach(guildUsers, async ({guild, users}) => {

            await asyncForEach(users, async user => {
                user.lastNickname = await user.getDiscordMember(guild).displayName;
                await user.save();
            });

        });
    };

    client.on('ready', async () => {
        await updateAllNicknames();

        setInterval(updateAllNicknames, 300000);

        console.log(`Bot is ready`);
    });

    client.on('message', async msg => {
        executeCommand(msg);
    });

    client.login(process.env.TOKEN);

//Keep awake
    if (process.env.HEROKU_KEEP_AWAKE.toLowerCase() == "true") {
        var http = require("http");
        setInterval(function () {
            http.get(process.env.HEROKU_URL);
        }, 300000);
    }

});