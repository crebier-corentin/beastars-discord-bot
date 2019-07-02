import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed, Guild} from "discord.js";
import {User} from "../db/entities/User";


const findMemberByUsernameWithError = (guild: Guild, username: string): GuildMember => {

    const receiverMember = findMemberByUsername(guild, username);

    //Can't find member
    if (receiverMember == null) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    return receiverMember
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

        const giveLeg = async (msg: Message, username: string) => {

            const receiverMember = findMemberByUsernameWithError(msg.guild, username);

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

            const giverMember = msg.member;

            await msg.channel.send(`${giverMember.displayName} has offered one of his legs to ${receiverMember.displayName}`);
        };

        await giveLeg(msg, args.join())


    }
};

export const LegStatsCommand: Command = {
    name: "stats",
    desc: "Get the leg stats of self (no argument) or of member (username)\nSupports partial usernames (toma for tomato50)",
    usage: "stats (username)",
    example: "stats yyao",
    aliases: ["s", "stat"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {


        const userId = (args.length === 0 ? msg.member : findMemberByUsernameWithError(msg.guild, args.join())).user.id;

        const user = await User.findOrCreate(userId);

        await msg.channel.send(await user.getStats(msg.guild));


    }
};