"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const Discord = require("discord.js");
const Execute_1 = require("./Execute");
//Client
const client = new Discord.Client();
client.on('ready', () => {
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
//# sourceMappingURL=index.js.map