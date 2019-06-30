import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed} from "discord.js";
import {User} from "../db/entities/User";

const giveLeg = async (msg: Message, username: string) => {

    const receiverMember = findMemberByUsername(msg.guild, username);

    //Can't find member
    if (receiverMember == null) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    const receiver = await User.findOrCreate(receiverMember.user.id);
    const giver = await User.findOrCreate(msg.author.id);

    //Check self
    if (receiver.id == giver.id) {
        throw new CommandError(`You can't offer your leg to yourself`);
    }

    //Check if has legs
    if (await giver.legsGiven() === 2) {
        throw new CommandError(`You have no legs left`);
    }

    //Check if has already given a leg
    if (giver.hasGivenLegTo(receiver)) {
        throw new CommandError(`You have already given a leg to ${receiverMember.displayName}`);
    }

    //Eat the leg
    await giver.giveLegTo(receiver);

    const giverMember = giver.getDiscordMember(msg.guild);

    await msg.channel.send(`${giverMember.displayName} has offered one of his legs to ${receiverMember.displayName}`);
};

export const OfferLegCommand: Command = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer [username]",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {

        //Missing username
        if (args.length == 0) {
            throw new CommandError(`Missing [username]\n\`${this.usage}\``);
        }

        await giveLeg(msg, args.join())



    }
};