import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed} from "discord.js";
import {User} from "../db/entities/User";

const eatLeg = async (msg: Message, username: string) => {

    const preyMember = findMemberByUsername(msg.guild, username);

    //Can't find member
    if (preyMember == null) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    const prey = await User.findOrCreate(preyMember.user.id);
    const predator = await User.findOrCreate(msg.author.id);

    //Check self
    if (prey.id == predator.id) {
        throw new CommandError(`You can't eat your own leg`);
    }

    //Check if has legs
    if (prey.legs === 0) {
        throw new CommandError(`${preyMember.displayName} has no legs left`);
    }

    //Eat the leg
    prey.legs--;
    predator.legsOffered++;

    await prey.save();
    await predator.save();

    const predatorMember = predator.getDiscordMember(msg.guild);

    //Message
    const embed = new RichEmbed()
        .addField("Predator", prey.getStats(msg.guild))
        .addField("Prey", predator.getStats(msg.guild));

    await msg.channel.send(`${predatorMember.displayName} has eaten ${preyMember.displayName}'s leg !`, {embed});

};

export const LegCommand: Command = {
    name: "leg",
    desc: "Eat one of someone's leg or show self stats if no username is provided\nSupports partial usernames (toma for tomato50)",
    usage: "leg (user)",
    example: "leg yyao",
    aliases: ["l"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {

        //Get stats
        if (args.length == 0) {

            const author = await User.findOrCreate(msg.author.id);

            await msg.channel.send(await author.getStats(msg.guild));
        }
        //Eat leg
        else {
            await eatLeg(msg, args.join())
        }


    }
};