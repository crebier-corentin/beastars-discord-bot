"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Context_1 = require("./Context");
const Execute_1 = require("./Execute");
const Discord = require("discord.js");
//Database
typeorm_1.createConnection().then(() => {
    //Client
    const client = new Discord.Client();
    Context_1.Context.client = client;
    client.on("ready", async () => {
        //Set description
        await client.user.setPresence({
            status: "online",
            activity: { name: `Use ${Context_1.Context.prefix} help`, type: "CUSTOM_STATUS" }
        });
        console.log("Bot is ready");
    });
    client.on("message", async (msg) => {
        Execute_1.executeCommand(msg);
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
//# sourceMappingURL=index.js.map