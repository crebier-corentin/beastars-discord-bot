"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Context_1 = require("./Context");
const Execute_1 = require("./Execute");
const Discord = require("discord.js");
//Client
const client = new Discord.Client();
Context_1.Context.client = client;
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