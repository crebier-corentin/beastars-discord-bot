import {Guild, GuildMember} from "discord.js";

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function findMemberByUsername(guild: Guild, name: string): GuildMember | null {

    name = name.toLowerCase();

    //Remove the @ if there is one
    if(name.startsWith("@")) {
        name = name.substring(1);
    }

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

export async function asyncForEach<T>(array: T[], callback: (item: T) => Promise<any>) {

    let promises: Array<(() => any)> = [];

    for (let a of array) {
        promises.push(callback.call(a, a));
    }

    await Promise.all(promises);

}