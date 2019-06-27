"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Wikia_1 = require("../ExternalApi/Wikia");
exports.WikiCommand = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
    example: "wiki Haru",
    aliases: ["w"],
    useDefaultPrefix: true,
    execute: async function (msg, args) {
        //Missing query
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [query]\n\`${this.usage}\``);
        }
        const query = args.join(" ");
        msg.channel.send(await Wikia_1.Wikia.searchFirstLink(query));
    }
};
//# sourceMappingURL=WikiCommand.js.map