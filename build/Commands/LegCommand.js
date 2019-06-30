"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const helpers_1 = require("../helpers");
const discord_js_1 = require("discord.js");
const User_1 = require("../db/entities/User");
const giveLeg = async (msg, username) => {
    const giverMember = helpers_1.findMemberByUsername(msg.guild, username);
    //Can't find member
    if (giverMember == null) {
        throw new types_1.CommandError(`Unable to find user ${username}`);
    }
    const giver = await User_1.User.findOrCreate(giverMember.user.id);
    const receiver = await User_1.User.findOrCreate(msg.author.id);
    //Check self
    if (giver.id == receiver.id) {
        throw new types_1.CommandError(`You can't offer your leg to yourself`);
    }
    //Check if has legs
    if (await giver.legsGiven() === 2) {
        throw new types_1.CommandError(`${giverMember.displayName} has no legs left`);
    }
    //Eat the leg
    await giver.save();
    await receiver.save();
    const receiverMember = receiver.getDiscordMember(msg.guild);
    //Message
    const embed = new discord_js_1.RichEmbed()
        .addField(receiverMember.displayName, giver.getStats(msg.guild))
        .addField(giverMember.displayName, receiver.getStats(msg.guild));
    await msg.channel.send(`${giverMember.displayName} has offered one of his legs to ${giverMember.displayName}`, { embed });
};
exports.OfferLegCommand = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer (user)",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {
        //Get stats
        if (args.length == 0) {
            const author = await User_1.User.findOrCreate(msg.author.id);
            await msg.channel.send(await author.getStats(msg.guild));
        }
        //Eat leg
        else {
            await giveLeg(msg, args.join());
        }
    }
};
//# sourceMappingURL=LegCommand.js.map