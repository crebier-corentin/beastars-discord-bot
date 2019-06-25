import {ChapterBCCommand, ChapterBSCommand, HelpCommand} from "./Commands";

require("dotenv").config();
import Discord = require('discord.js');
import Parser from "./Parser";

const prefix = process.env.PREFIX;

const commands = [HelpCommand, ChapterBSCommand, ChapterBCCommand];
const parser = new Parser(prefix, commands);

//Client
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Bot is ready`);
});

client.on('message', async msg => {

    try {
        const res = parser.parseCommand(msg.content);

        //Ignore non commands
        if (!res.success) return;

        res.command.execute.call(res.command, {prefix, commands}, msg, res.args);

    } catch (e) {
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