"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function getEverythingAfterMatch(pattern, str, times = 1) {
    let count = 0;
    while (pattern.exec(str) !== null) {
        if (++count === times) {
            return str.slice(pattern.lastIndex);
        }
    }
    //No match
    return "";
}
exports.getEverythingAfterMatch = getEverythingAfterMatch;
function findMemberByUsername(guild, name) {
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
    const results = [];
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
exports.findMemberByUsername = findMemberByUsername;
async function asyncForEach(array, callback) {
    let promises = [];
    for (let a of array) {
        promises.push(callback.call(a, a));
    }
    await Promise.all(promises);
}
exports.asyncForEach = asyncForEach;
function includeStartsWith(array, search) {
    for (const str of array) {
        if (str.startsWith(search)) {
            return true;
        }
    }
    return false;
}
exports.includeStartsWith = includeStartsWith;
//# sourceMappingURL=helpers.js.map