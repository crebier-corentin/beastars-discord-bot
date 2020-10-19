require("dotenv").config();
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Context} from "./Context";
import {executeCommand} from "./Execute";
import Discord = require("discord.js");

//Database
createConnection().then(() => {
    //Client
    const client = new Discord.Client();
    Context.client = client;

    client.on("ready", async () => {
        //Set description
        await client.user.setPresence({
            status: "online",
            activity: {name: `Use ${Context.prefix} help`, type: "CUSTOM_STATUS"}
        });

        console.log("Bot is ready");
    });

    client.on("message", async (msg) => {
        executeCommand(msg);
    });

    client.login(process.env.TOKEN);
});

process.on("uncaughtException", function (e) {
    console.error(`An error has occured. error is: ${e} and stack trace is: ${e.stack}`);
    process.exit(1);
});
process.on("unhandledRejection", function (e) {
    console.error(`An error has occured. error is: ${e}`);
    process.exit(1);
});

