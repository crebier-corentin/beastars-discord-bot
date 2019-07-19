"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function findMemberByUsername(guild, name) {
    name = name.toLowerCase();
    //Remove the @ if there is one
    if (name.startsWith("@")) {
        name = name.substring(1);
    }
    for (const member of guild.members.array()) {
        //Find by nickname
        if (member.nickname != undefined) {
            const nickname = member.nickname.toLowerCase();
            if (nickname.startsWith(name)) {
                return member;
            }
        }
        const username = member.user.username.toLowerCase();
        //Find by username
        if (username.startsWith(name)) {
            return member;
        }
    }
    return null;
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
//# sourceMappingURL=helpers.js.map