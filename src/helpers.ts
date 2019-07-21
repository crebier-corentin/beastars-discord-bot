import {Guild, GuildMember} from "discord.js";

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getEverythingAfterMatch(pattern: RegExp, str: string, times: number = 1): string {

    let count = 0;

    while (pattern.exec(str) !== null) {
        if (++count === times) {
            return str.slice(pattern.lastIndex)
        }
    }

    //No match
    return "";
}

export function findMemberByUsername(guild: Guild, name: string): GuildMember[] {

    name = name.toLowerCase();

    //Remove the @ if there is one
    if (name.startsWith("@")) {
        name = name.substring(1);
    }

    /*Priotities
    7 : Exact username#discrimator
    6 : Exact nickname
    5 : Starts with nickname
    4 : Substring nickname
    3 : Exact username
    2 : Starts with username
    1 : Substring nickname
     */
    const results: GuildMember[] = [];

    for (const member of guild.members.array()) {

        if(name == `${member.user.username}#${member.user.discriminator}`) {
            return [member];
        }

        //Find by nickname
        if (member.nickname != undefined) {
            const nickname = member.nickname.toLowerCase();

            if (name === nickname) {
                results.push(member);
                continue;
            }
            if (nickname.startsWith(name)) {
                results.push(member);
                continue;
            }
            if (nickname.includes(name)) {
                results.push(member);
                continue;
            }
        }

        const username = member.user.username.toLowerCase();

        //Find by username
        if (username.startsWith(name)) {
            if (name === username) {
                results.push(member);
                continue;
            }
            if (username.startsWith(name)) {
                results.push(member);
                continue;
            }
            if (username.includes(name)) {
                results.push(member);
                continue;
            }
        }

    }

    return results;

}

export async function asyncForEach<T>(array: T[], callback: (item: T) => Promise<any>) {

    let promises: Array<(() => any)> = [];

    for (let a of array) {
        promises.push(callback.call(a, a));
    }

    await Promise.all(promises);

}