"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const helpers_1 = require("../helpers");
const discord_js_1 = require("discord.js");
const User_1 = require("../db/entities/User");
const createUserIfNotExist = async (discordId) => {
    let user = await User_1.User.findOne({ where: { discordId } });
    if (user == undefined) {
        user = await User_1.User.create({ discordId }).save();
    }
    return user;
};
const getStats = async (member) => {
    const user = await createUserIfNotExist(member.user.id);
    return `${member.displayName} has ${user.legs} leg(s) left and has eaten ${user.legsEaten} leg(s)!`;
};
const eatLeg = async (msg, username) => {
    const preyMember = helpers_1.findMemberByUsername(msg.guild, username);
    //Can't find member
    if (preyMember == null) {
        throw new types_1.CommandError(`Unable to find user ${username}`);
    }
    const prey = await createUserIfNotExist(preyMember.user.id);
    const predator = await createUserIfNotExist(msg.author.id);
    //Check self
    if (prey.id == predator.id) {
        throw new types_1.CommandError(`You can't eat your own leg`);
    }
    //Check if has legs
    if (prey.legs === 0) {
        throw new types_1.CommandError(`${preyMember.displayName} has no legs left`);
    }
    //Eat the leg
    prey.legs--;
    predator.legsEaten++;
    await prey.save();
    await predator.save();
    const predatorMember = msg.guild.members.get(predator.discordId);
    //Message
    const embed = new discord_js_1.RichEmbed()
        .addField("Predator", await getStats(predatorMember))
        .addField("Prey", await getStats(preyMember));
    await msg.channel.send(`${predatorMember.displayName} has eaten ${preyMember.displayName} leg !`, { embed });
};
exports.LegCommand = {
    name: "leg",
    desc: "Eat one of someone's leg or show self stats if no username is provided\nSupports partial usernames (toma for tomato50)",
    usage: "leg (user)",
    example: "leg yyao",
    aliases: ["l"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {
        //Get stats
        if (args.length == 0) {
            const authorMember = msg.guild.members.get(msg.author.id);
            await msg.channel.send(await getStats(authorMember));
        }
        //Eat leg
        else {
            await eatLeg(msg, args.join());
        }
    }
};
//# sourceMappingURL=LegCommand.js.map