require('dotenv').config();
import "reflect-metadata";
import {createConnection} from "typeorm";


import {Context} from "./Context";
import {executeCommand} from "./Execute";

import Discord = require('discord.js');

//Database
createConnection().then(() => {

//Client
    const client = new Discord.Client();
    Context.client = client;

    client.on('ready', () => {
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