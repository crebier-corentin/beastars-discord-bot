import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed} from "discord.js";
import {User} from "../db/entities/User";

const giveLeg = async (msg: Message, username: string) => {

    const giverMember = findMemberByUsername(msg.guild, username);

    //Can't find member
    if (giverMember == null) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    const giver = await User.findOrCreate(giverMember.user.id);
    const receiver = await User.findOrCreate(msg.author.id);

    //Check self
    if (giver.id == receiver.id) {
        throw new CommandError(`You can't offer your leg to yourself`);
    }

    //Check if has legs
    if (await giver.legsGiven() === 2) {
        throw new CommandError(`${giverMember.displayName} has no legs left`);
    }

    //Eat the leg
    await giver.save();
    await receiver.save();

    const receiverMember = receiver.getDiscordMember(msg.guild);

    //Message
    const embed = new RichEmbed()
        .addField(receiverMember.displayName, giver.getStats(msg.guild))
        .addField(giverMember.displayName, receiver.getStats(msg.guild));

    await msg.channel.send(`${giverMember.displayName} has offered one of his legs to ${giverMember.displayName}`, {embed});

};

export const OfferLegCommand: Command = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer (user)",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {

        //Get stats
        if (args.length == 0) {

            const author = await User.findOrCreate(msg.author.id);

            await msg.channel.send(await author.getStats(msg.guild));
        }
        //Eat leg
        else {
            await giveLeg(msg, args.join())
        }


    }
};