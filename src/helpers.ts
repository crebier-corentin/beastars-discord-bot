import {Guild, GuildMember} from "discord.js";

const os = require("os");
const path = require("path");

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function getEverythingAfterMatch(pattern: RegExp, str: string, times: number = 1): string {
    let count = 0;

    while (pattern.exec(str) !== null) {
        if (++count === times) {
            return str.slice(pattern.lastIndex);
        }
    }

    //No match
    return "";
}

export function regexCount(re: RegExp, str: string): number {
    return ((str || "").match(re) || []).length;
}

export function findMemberByUsername(guild: Guild, name: string): GuildMember[] {
    let lowerCaseName = name.toLowerCase();

    //Remove the @ if there is one
    if (lowerCaseName.startsWith("@")) {
        lowerCaseName = lowerCaseName.substring(1);
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
        if (name == `${member.user.username}#${member.user.discriminator}`) {
            return [member];
        }

        //Find by nickname
        if (member.nickname != undefined) {
            const nickname = member.nickname.toLowerCase();

            if (lowerCaseName === nickname) {
                results.push(member);
                continue;
            }
            if (nickname.startsWith(lowerCaseName)) {
                results.push(member);
                continue;
            }
            if (nickname.includes(lowerCaseName)) {
                results.push(member);
                continue;
            }
        }

        const username = member.user.username.toLowerCase();

        //Find by username
        if (username.startsWith(lowerCaseName)) {
            if (lowerCaseName === username) {
                results.push(member);
                continue;
            }
            if (username.startsWith(lowerCaseName)) {
                results.push(member);
                continue;
            }
            if (username.includes(lowerCaseName)) {
                results.push(member);
                continue;
            }
        }
    }

    return results;
}

export async function asyncForEach<T>(array: T[], callback: (item: T) => Promise<any>) {
    const promises: Array<(() => any)> = [];

    for (const a of array) {
        promises.push(callback.call(a, a));
    }

    await Promise.all(promises);
}

export function includeStartsWith(array: string[], search: string): boolean {
    for (const str of array) {
        if (search.startsWith(str)) {
            return true;
        }
    }

    return false;
}

export function arrayEqual<T>(a: Array<T>, b: Array<T>): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

export function chunkArray<T>(arr: T[], len: number): Array<Array<T>> {
    const chunks = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}

export function maxArray<T>(arr: T[], func: (t: T) => number): T {
    let maxVal = func(arr[0]);
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        const val = func(arr[0]);

        //New maximum
        if (val > maxVal) {
            maxVal = val;
            max = arr[0];
        }
    }

    return max;
}

export function isAdministrator(member: GuildMember): boolean {
    //TODO Chaneg to ADMINISTRATOR when yyao is promoted
    return member.hasPermission("BAN_MEMBERS");
}

export function tmpFilename(name: string): string {
    return path.join(os.tmpdir(), `${Date.now()}-${name}`);
}

export function mimetypeToExtension(mimetype: string): string {
    const ext = mimetype.split("/")[1];

    if (ext === "svg+xml") {
        return ".svg";
    }

    return `.${ext}`;
}
