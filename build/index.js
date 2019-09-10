"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Reddit_1 = require("./ExternalApi/Reddit");
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
    client.on('ready', async () => {
        //Set description
        await client.user.setPresence({ status: "online", game: { name: `Use ${Context_1.Context.prefix} help` } });
        const leaksRegex = /(informations?|raws?|leaks?)/i;
        //Start leaks watcher
        const redditWatcher = await Reddit_1.RedditUserWatcher.create(process.env.LEAKS_REDDIT_USERNAME, (submission => {
            //Check subreddit
            if (submission.subreddit_name_prefixed.toLocaleLowerCase() !== process.env.LEAKS_REDDIT_SUB.toLocaleLowerCase()) {
                return false;
            }
            //Check words
            return leaksRegex.test(submission.title);
        }));
        const leaksChannel = client.channels.find(channel => channel.id === process.env.LEAKS_CHANNEL_ID);
        //Leaks watcher interval
        setInterval(async () => {
            const submissions = await redditWatcher.getNewSubmissions();
            for (const submission of submissions) {
                await leaksChannel.send(`New leak from u/${process.env.LEAKS_REDDIT_USERNAME}\nhttps://www.reddit.com${submission.permalink}`);
            }
        }, 1000 * 30);
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
});
//# sourceMappingURL=index.js.map