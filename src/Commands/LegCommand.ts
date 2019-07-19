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

            let receiverMember: GuildMember;

            //Try with mention
            if (msg.mentions.members.size === 1) {
                receiverMember = msg.mentions.members.first();
            }
            //Try to match username
            else {
                receiverMember = findMemberByUsernameWithError(msg.guild, username);
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

            //Comfirmation
            const confirmationMsg = await msg.channel.send("_ _") as Message;
            await confirmationMsg.edit(`Are you sure you want to give your leg to <@${receiver.discordId}>\nReply with "yes" to confirm it.\nWill expire in 20 seconds...`);

            let filter = filterMsg => filterMsg.author.id == msg.author.id;
            const collected = await msg.channel.awaitMessages(filter, {max: 1, time: 20000});

            //Delete confirmation message if possible
            if (confirmationMsg.deletable) confirmationMsg.delete();

            //Give the leg
            if (collected.size > 0 && collected.first().content.toLowerCase() == "yes") {

                await giver.giveLegTo(receiver);

                const giverMember = msg.member;

                await msg.channel.send(`**${giverMember.displayName}** has offered one of his legs to **${receiverMember.displayName}**`);
            }

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
            userId = findMemberByUsernameWithError(msg.guild, args.join()).user.id;
        }

        const user = await User.findOrCreate(userId);

        await msg.channel.send(await user.getStats(msg.guild));


    }
};