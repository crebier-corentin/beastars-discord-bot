"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("./Commands");
require("dotenv").config();
const Discord = require("discord.js");
const Parser_1 = require("./Parser");
const prefix = process.env.PREFIX;
const commands = [Commands_1.HelpCommand, Commands_1.ChapterBSCommand, Commands_1.ChapterBCCommand];
const parser = new Parser_1.default(prefix, commands);
//Client
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Bot is ready`);
});
client.on('message', async (msg) => {
    try {
        const res = parser.parseCommand(msg.content);
        //Ignore non commands
        if (!res.success)
            return;
        res.command.execute.call(res.command, { prefix, commands }, msg, res.args);
    }
    catch (e) {
        console.log(e);
    }
});
client.login(process.env.TOKEN);
//Keep awake
if (process.env.HEROKU_KEEP_AWAKE.toLowerCase() == "true") {
    var http = require("http");
    setInterval(function () {
        http.get(process.env.HEROKU_URL);
    }, 300000);
}
//# sourceMappingURL=index.js.map