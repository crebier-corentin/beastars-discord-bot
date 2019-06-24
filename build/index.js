"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const Discord = require("discord.js");
const Parser_1 = require("./Parser");
const Responder_1 = require("./Responder");
const prefix = process.env.PREFIX;
const parser = new Parser_1.default(prefix);
const responder = new Responder_1.default(prefix);
//Client
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Bot is ready`);
});
client.on('message', async (msg) => {
    //Is message command?
    if (msg.content.startsWith(prefix)) {
        const response = await responder.respond(parser.parseCommand(msg.content));
        msg.channel.send(response);
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