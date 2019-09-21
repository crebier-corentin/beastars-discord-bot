import {Command, CommandError} from "../types";
import {Wikia} from "../ExternalApi/Wikia";

export const WikiCommand: Command = {
    name: "wiki",
    desc: "Search on the beastars wiki",
    usage: "wiki [query]",
    example: "wiki Haru",
    aliases: ["w"],
    useDefaultPrefix: true,
    adminOnly: false,
    async execute(msg, args) {
    //Missing query
        if (args.length == 0) {
            throw new CommandError(`Missing [query]\n\`${this.usage}\``);
        }

        const query = args.join(" ");

        msg.channel.send(await Wikia.searchFirstLink(query));
    },
};
