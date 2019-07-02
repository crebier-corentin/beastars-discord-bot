"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Context_1 = require("./Context");
const Execute_1 = require("./Execute");
const User_1 = require("./db/entities/User");
const helpers_1 = require("./helpers");
const Discord = require("discord.js");
//Database
typeorm_1.createConnection().then(() => {
    //Client
    const client = new Discord.Client();
    Context_1.Context.client = client;
    const updateAllNicknames = async () => {
        let guildUsers = [];
        //Get all users
        for (const guild of client.guilds.array()) {
            const ids = guild.members.array().map(m => m.id);
            const users = await User_1.User.find({ where: { discordId: typeorm_1.In(ids) } });
            if (users.length > 0) {
                guildUsers.push({ guild, users });
            }
        }
        //Update nicknames
        await helpers_1.asyncForEach(guildUsers, async ({ guild, users }) => {
            await helpers_1.asyncForEach(users, async (user) => {
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
    client.on('message', async (msg) => {
        Execute_1.executeCommand(msg);
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
//# sourceMappingURL=index.js.map