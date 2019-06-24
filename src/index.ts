require("dotenv").config();
import Discord = require('discord.js');
import Parser from "./Parser";
import Responder from "./Responder";


const prefix = process.env.PREFIX;
const parser = new Parser(prefix);
const responder = new Responder(prefix);

//Client
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Bot is ready`);
});

client.on('message', async msg => {
    //Is message command?
    if (msg.content.startsWith(prefix)) {

        const response = await responder.respond(parser.parseCommand(msg.content));

        msg.channel.send(response);
    }
});

client.login(process.env.token);

//Keep awake
if (process.env.HEROKU_KEEP_AWAKE.toLowerCase() == "true") {
    var http = require("http");
    setInterval(function () {
        http.get(process.env.HEROKU_URL);
    }, 300000);
}