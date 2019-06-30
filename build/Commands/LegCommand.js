"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const helpers_1 = require("../helpers");
const User_1 = require("../db/entities/User");
const giveLeg = async (msg, username) => {
    const receiverMember = helpers_1.findMemberByUsername(msg.guild, username);
    //Can't find member
    if (receiverMember == null) {
        throw new types_1.CommandError(`Unable to find user ${username}`);
    }
    const receiver = await User_1.User.findOrCreate(receiverMember.user.id);
    const giver = await User_1.User.findOrCreate(msg.author.id);
    //Check self
    if (receiver.id == giver.id) {
        throw new types_1.CommandError(`You can't offer your leg to yourself`);
    }
    //Check if has legs
    if (await giver.legsGiven() === 2) {
        throw new types_1.CommandError(`You have no legs left`);
    }
    //Check if has already given a leg
    if (giver.hasGivenLegTo(receiver)) {
        throw new types_1.CommandError(`You have already given a leg to ${receiverMember.displayName}`);
    }
    //Eat the leg
    await giver.giveLegTo(receiver);
    const giverMember = giver.getDiscordMember(msg.guild);
    await msg.channel.send(`${giverMember.displayName} has offered one of his legs to ${receiverMember.displayName}`);
};
exports.OfferLegCommand = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer [username]",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {
        //Missing username
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [username]\n\`${this.usage}\``);
        }
        await giveLeg(msg, args.join());
    }
};
//# sourceMappingURL=LegCommand.js.map