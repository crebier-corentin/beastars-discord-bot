require('dotenv').config();

import {RedditUserWatcher} from "./ExternalApi/Reddit";
import "reflect-metadata";
import {createConnection, In} from "typeorm";

import {Context} from "./Context";
import {executeCommand} from "./Execute";

import Discord = require('discord.js');
import {TextChannel} from "discord.js";


//Database
createConnection().then(() => {

//Client
    const client = new Discord.Client();
    Context.client = client;

    client.on('ready', async () => {
        //Set description
        await client.user.setPresence({status: "online", game: {name: `Use ${Context.prefix} help`}});

        //Reddit leaks watcher
        (async function redditLeaksWatcher() {
            const leaksRegex = /(informations?|raws?|leaks?)/i;

            //Start leaks watcher
            const redditWatcher = await RedditUserWatcher.create(process.env.LEAKS_REDDIT_USERNAME, (submission => {
                //Check subreddit
                if (submission.subreddit_name_prefixed.toLocaleLowerCase() !== process.env.LEAKS_REDDIT_SUB.toLocaleLowerCase()) {
                    return false;
                }

                //Check words
                return leaksRegex.test(submission.title);

            }));

            const leaksChannel = <TextChannel>client.channels.find(channel => channel.id === process.env.LEAKS_CHANNEL_ID);

            //Leaks watcher interval
            setInterval(async () => {
                const submissions = await redditWatcher.getNewSubmissions();
                for (const submission of submissions) {
                    await leaksChannel.send(`New leak from u/${process.env.LEAKS_REDDIT_USERNAME}\nhttps://www.reddit.com${submission.permalink}`);
                }
            }, 1000 * 30);
        })();

        console.log(`Bot is ready`);
    });

    client.on('message', async msg => {
        executeCommand(msg);
    });

    client.login(process.env.TOKEN);

});