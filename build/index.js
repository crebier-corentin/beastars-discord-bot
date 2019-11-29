"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const Mangadex_1 = require("./ExternalApi/Mangadex");
const Reddit_1 = require("./ExternalApi/Reddit");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Context_1 = require("./Context");
const Execute_1 = require("./Execute");
const types_1 = require("./types");
const Discord = require("discord.js");
//Database
typeorm_1.createConnection().then(() => {
    //Client
    const client = new Discord.Client();
    Context_1.Context.client = client;
    client.on("ready", async () => {
        //Set description
        await client.user.setPresence({ status: "online", game: { name: `Use ${Context_1.Context.prefix} help` } });
        //Reddit leaks and mangadex watchers
        (async function watchers() {
            const leaksRegex = /(informations?|infos?|raws?|leaks?)/i;
            //Reddit leaks watcher
            const redditWatcher = await Reddit_1.RedditUserWatcher.create(process.env.LEAKS_REDDIT_USERNAME, ((submission) => {
                //Check subreddit
                if (submission.subreddit_name_prefixed.toLocaleLowerCase() !== process.env.LEAKS_REDDIT_SUB.toLocaleLowerCase()) {
                    return false;
                }
                //Check words
                return leaksRegex.test(submission.title);
            }));
            const redditLeaksChannel = client.channels.find((channel) => channel.id === process.env.LEAKS_CHANNEL_ID);
            //Mangadex watcher
            const mangadexWatcher = await Mangadex_1.MangadexWatcher.create(types_1.Manga.Beastars);
            const newChapterChannel = client.channels.find((channel) => channel.id === process.env.NEW_CHAPTER_CHANNEL);
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
        //Reminders
        (async function reminders() {
            const sendFeedbackReminder = async (channel) => {
                await channel.send(`> This server is always looking for feedback on ways to improve. Suggestion are welcome either in #meta or as a DM to our staff. 
> However, if you have a feedback, but you wish to stay anonymous, we have a form for that. This form is also listed in #rules 
__Form:__
<https://docs.google.com/forms/d/1n5zAsDeFgZWLpzDlbXvYPIPXxPS4t82Kcw1FIQKF7mk>
__Current Feedback:__
<https://docs.google.com/spreadsheets/d/140xA8Qiazq6rlITZXmL0omRXSnxk49oBHRadcFvVqyA/edit?usp=sharing>`);
            };
            const sendArtReminder = async (channel) => {
                await channel.send("> Remember to credit the artist so people can find their artwork.");
            };
            //Load channels
            const feedbackReminderChannels = JSON.parse(process.env.FEEDBACK_REMINDER_CHANNELS);
            const artReminderChannels = JSON.parse(process.env.ART_REMINDER_CHANNELS);
            //Feedback
            for (const [channelId, interval] of feedbackReminderChannels) {
                const channel = client.channels.find(c => c.id === channelId);
                setInterval(sendFeedbackReminder.bind(null, channel), interval * 1000);
            }
            //Art
            for (const [channelId, interval] of artReminderChannels) {
                const channel = client.channels.find(c => c.id === channelId);
                setInterval(sendArtReminder.bind(null, channel), interval * 1000);
            }
        })();
        console.log("Bot is ready");
    });
    client.on("message", async (msg) => {
        Execute_1.executeCommand(msg);
    });
    client.login(process.env.TOKEN);
});
//# sourceMappingURL=index.js.map