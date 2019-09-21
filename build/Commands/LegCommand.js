"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const types_1 = require("../types");
const helpers_1 = require("../helpers");
const User_1 = require("../db/entities/User");
const Context_1 = require("../Context");
const findMemberByUsernameWithError = (guild, username) => {
    const receiverMembers = helpers_1.findMemberByUsername(guild, username);
    //Can't find member
    if (receiverMembers.length == 0) {
        throw new types_1.CommandError(`Unable to find user ${username}`);
    }
    //Ambiguous
    if (receiverMembers.length > 1) {
        //Bold
        const names = receiverMembers.map((member) => `**${member.displayName}** (${member.user.username}#${member.user.discriminator})`);
        throw new types_1.CommandError(`Ambiguous user between : \n${names.join("\n")}`);
    }
    return receiverMembers[0];
};
exports.OfferLegCommand = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer [username]",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg, args, fullArgs) {
        //Missing username
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [username]\n\`${Context_1.Context.prefix} ${this.usage}\``);
        }
        const giveLeg = async (msg, username) => {
            const giverMember = msg.member;
            //24h join cooldown
            const cooldownEnd = moment(giverMember.joinedAt).add(24, "hours");
            const now = moment();
            if (now < cooldownEnd) {
                const diff = moment.duration(cooldownEnd.diff(now));
                throw new types_1.CommandError(`You need to wait 24h after joining this server before you can offer your leg to someone (${diff.hours()} hours and ${diff.minutes()} minutes remaining).`);
            }
            const receiverMember = (() => {
                //Try with mention
                if (msg.mentions.members.size === 1) {
                    return msg.mentions.members.first();
                }
                //Try to match username
                return findMemberByUsernameWithError(msg.guild, username);
            })();
            const receiver = await User_1.User.findOrCreate(receiverMember.user.id);
            const giver = await User_1.User.findOrCreate(msg.author.id);
            //Check self
            if (receiver.id == giver.id) {
                throw new types_1.CommandError("You can't offer your leg to yourself");
            }
            //Check if has legs
            if (await giver.legsGiven() === 2) {
                throw new types_1.CommandError("You have no legs left");
            }
            //Check if has already given a leg
            if (giver.hasGivenLegTo(receiver)) {
                throw new types_1.CommandError(`You have already given a leg to ${receiverMember.displayName}`);
            }
            //Comfirmation
            const confirmationMsg = await msg.channel.send("_ _");
            await confirmationMsg.edit(`Are you sure you want to give your leg to <@${receiver.discordId}>, this action is **permanent** !\nReply with "yes" to confirm it.\nWill expire in 20 seconds...`);
            const filter = (filterMsg) => filterMsg.author.id == msg.author.id;
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: 20000 });
            //Delete confirmation message if possible
            if (confirmationMsg.deletable)
                confirmationMsg.delete();
            //Give the leg
            if (collected.size > 0 && collected.first().content.toLowerCase() == "yes") {
                await giver.giveLegTo(receiver);
                await msg.channel.send(`**${giverMember.displayName}** has offered one of their legs to **${receiverMember.displayName}**`);
            }
        };
        await giveLeg(msg, fullArgs);
    },
};
exports.LegStatsCommand = {
    name: "stats",
    desc: "Get the leg stats of self (no argument) or of member (username)\nSupports partial usernames (toma for tomato50)",
    usage: "stats (username)",
    example: "stats yyao",
    aliases: ["s", "stat"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg, args, fullArgs) {
        let userId;
        //Self
        if (args.length === 0) {
            userId = msg.member.user.id;
        }
        //Try with mention
        else if (msg.mentions.members.size === 1) {
            userId = msg.mentions.members.first().user.id;
        }
        //Try to match username
        else {
            userId = findMemberByUsernameWithError(msg.guild, fullArgs).user.id;
        }
        const user = await User_1.User.findOrCreate(userId);
        await msg.channel.send(await user.getStats(msg.guild));
    },
};
//# sourceMappingURL=LegCommand.js.map