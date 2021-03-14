require("dotenv").config();
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Context} from "./Context";
import {executeCommand} from "./Execute";
import Discord = require("discord.js");
import ormconfig = require("../ormconfig.js")

//Database
createConnection(ormconfig).then(() => {
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

process.on("uncaughtException", (e) => {
    console.error(`An error has occured. error is: ${e} and stack trace is: ${e.stack}`);
    process.exit(1);
});
process.on("unhandledRejection", (e) => {
    console.error(`An error has occured. error is: ${e}`);
    process.exit(1);
});



