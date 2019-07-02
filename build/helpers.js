"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function findMemberByUsername(guild, name) {
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