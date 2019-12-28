require("dotenv").config();

import {MangadexWatcher} from "./ExternalApi/Mangadex";
import {RedditUserWatcher} from "./ExternalApi/Reddit";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Context} from "./Context";
import {executeCommand} from "./Execute";
import {TextChannel} from "discord.js";
import {Manga} from "./types";
import Discord = require("discord.js");

//Database
createConnection().then(() => {
    //Client
    const client = new Discord.Client();
    Context.client = client;

    client.on("ready", async () => {
        //Set description
        await client.user.setPresence({status: "online", game: {name: `Use ${Context.prefix} help`}});

        //Reddit leaks and mangadex watchers
        await (async function watchers() {
            const leaksRegex = /(informations?|infos?|raws?|leaks?)/i;

            //Reddit leaks watcher
            const redditWatcher = await RedditUserWatcher.create(process.env.LEAKS_REDDIT_USERNAME, ((submission) => {
                //Check subreddit
                if (submission.subreddit_name_prefixed.toLocaleLowerCase() !== process.env.LEAKS_REDDIT_SUB.toLocaleLowerCase()) {
                    return false;
                }

                //Check words
                return leaksRegex.test(submission.title);
            }));
            const redditLeaksChannel = <TextChannel>client.channels.find((channel) => channel.id === process.env.LEAKS_CHANNEL_ID);

            //Mangadex watcher
            const mangadexWatcher = await MangadexWatcher.create(Manga.Beastars);
            const newChapterChannel = <TextChannel>client.channels.find((channel) => channel.id === process.env.NEW_CHAPTER_CHANNEL);


            //Watchers interval
            setInterval(async () => {
                //Reddit Leaks
                const submissions = await redditWatcher.getNewSubmissions();
                for (const submission of submissions) {
                    await redditLeaksChannel.send(`New leak from u/${process.env.LEAKS_REDDIT_USERNAME}\nhttps://www.reddit.com${submission.permalink}`);
                }

                //Mangadex leaks
                const chapters = await mangadexWatcher.getNewChapters();
                for (const chapter of chapters) {
                    await newChapterChannel.send(`<@&${process.env.NEW_CHAPTER_ROLE}>\nNew Beastars chapter !\nhttps://mangadex.org/chapter/${chapter.id}`);
                }
            }, 1000 * 30);
        }());

        console.log("Bot is ready");
    });

    client.on("message", async (msg) => {
        executeCommand(msg);
    });

    client.login(process.env.TOKEN);
});
