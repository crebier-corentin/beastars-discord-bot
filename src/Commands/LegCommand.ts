import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed} from "discord.js";
import {User} from "../db/entities/User";


const createUserIfNotExist = async (discordId: string): Promise<User> => {

    let user = await User.findOne({where: {discordId}});
    if (user == undefined) {
        user = await User.create({discordId}).save();
    }

    return user;
};

const getStats = async (member: GuildMember): Promise<string> => {

    const user = await createUserIfNotExist(member.user.id);

    return `${member.displayName} has ${user.legs} leg(s) left and has eaten ${user.legsEaten} leg(s)!`;

};

const eatLeg = async (msg: Message, username: string) => {

    const preyMember = findMemberByUsername(msg.guild, username);

    //Can't find member
    if (preyMember == null) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    const prey = await createUserIfNotExist(preyMember.user.id);
    const predator = await createUserIfNotExist(msg.author.id);

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
    predator.legsEaten++;

    await prey.save();
    await predator.save();

    const predatorMember = msg.guild.members.get(predator.discordId);

    //Message
    const embed = new RichEmbed()
        .addField("Predator", await getStats(predatorMember))
        .addField("Prey", await getStats(preyMember));

    await msg.channel.send(`${predatorMember.displayName} has eaten ${preyMember.displayName} leg !`, {embed});

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

            const authorMember = msg.guild.members.get(msg.author.id);

            await msg.channel.send(await getStats(authorMember));
        }
        //Eat leg
        else {
            await eatLeg(msg, args.join())
        }


    }
};