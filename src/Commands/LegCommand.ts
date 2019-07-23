import {Command, CommandError} from "../types";
import {findMemberByUsername} from "../helpers";
import {Message, GuildMember, RichEmbed, Guild} from "discord.js";
import {User} from "../db/entities/User";
import {Context} from "../Context";
import * as moment from "moment";


const findMemberByUsernameWithError = (guild: Guild, username: string): GuildMember => {

    const receiverMembers = findMemberByUsername(guild, username);

    //Can't find member
    if (receiverMembers.length == 0) {
        throw new CommandError(`Unable to find user ${username}`);
    }

    //Ambiguous
    if (receiverMembers.length > 1) {

        //Bold
        let names = receiverMembers.map(member => `**${member.displayName}** (${member.user.username}#${member.user.discriminator})`);

        throw new CommandError(`Ambiguous user between : \n${names.join("\n")}`);
    }

    return receiverMembers[0];
};

export const OfferLegCommand: Command = {
    name: "offer",
    desc: "Offer on of your leg to a member\nSupports partial usernames (toma for tomato50)",
    usage: "offer [username]",
    example: "offer yyao",
    aliases: ["o"],
    useDefaultPrefix: true,
    execute: async function (msg, args, fullArgs) {

        //Missing username
        if (args.length == 0) {
            throw new CommandError(`Missing [username]\n\`${Context.prefix} ${this.usage}\``);
        }

        const giveLeg = async (msg: Message, username: string) => {

            const giverMember = msg.member;

            //24h join cooldown
            const cooldownEnd = moment(giverMember.joinedAt).add(24, "hours");
            const now = moment();
            if(now < cooldownEnd) {

                const diff = moment.duration(cooldownEnd.diff(now));

                throw new CommandError(`You need to wait 24h after joining this server before you can offer your leg to someone (${diff.hours()} hours and ${diff.minutes()} minutes remaining).`);
            }

            const receiverMember: GuildMember = (() => {

                //Try with mention
                if (msg.mentions.members.size === 1) {
                    return msg.mentions.members.first();
                }

                //Try to match username
                return findMemberByUsernameWithError(msg.guild, username);

            })();

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
            await confirmationMsg.edit(`Are you sure you want to give your leg to <@${receiver.discordId}>, this action is **permanent** !\nReply with "yes" to confirm it.\nWill expire in 20 seconds...`);

            let filter = filterMsg => filterMsg.author.id == msg.author.id;
            const collected = await msg.channel.awaitMessages(filter, {max: 1, time: 20000});

            //Delete confirmation message if possible
            if (confirmationMsg.deletable) confirmationMsg.delete();

            //Give the leg
            if (collected.size > 0 && collected.first().content.toLowerCase() == "yes") {

                await giver.giveLegTo(receiver);

                await msg.channel.send(`**${giverMember.displayName}** has offered one of their legs to **${receiverMember.displayName}**`);
            }

        };

        await giveLeg(msg, fullArgs)


    }
};

export const LegStatsCommand: Command = {
    name: "stats",
    desc: "Get the leg stats of self (no argument) or of member (username)\nSupports partial usernames (toma for tomato50)",
    usage: "stats (username)",
    example: "stats yyao",
    aliases: ["s", "stat"],
    useDefaultPrefix: true,
    execute: async function (msg, args, fullArgs) {


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

        const user = await User.findOrCreate(userId);

        await msg.channel.send(await user.getStats(msg.guild));


    }
};