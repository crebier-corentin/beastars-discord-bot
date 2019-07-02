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

    client.on('ready', async () => {
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