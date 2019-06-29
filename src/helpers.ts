import {Guild, GuildMember} from "discord.js";

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function findMemberByUsername(guild: Guild, name: string): GuildMember | null {

    name = name.toLowerCase();

    for (const member of guild.members.array()) {

        //Exact match nickname or substr
        if (member.nickname != undefined) {
            const nickname = member.nickname.toLowerCase();
            if (name === nickname || nickname.includes(name)) {
                return member;
            }
        }

        const username = member.user.username.toLowerCase();

        //Exact username or substr
        if (name === username || username.includes(name)) {
            return member;
        }

    }

    return null;

}
