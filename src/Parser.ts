import {escapeRegExp, getEverythingAfterMatch} from "./helpers";
import {Command, CommandError} from "./types";
import {Context} from "./Context";

export default class Parser {
    defaultPrefix: string;
    customPrefixes: { prefix: string, command: Command }[];

    commands: Command[];

    constructor(prefix: string, commands: Command[]) {
        this.defaultPrefix = escapeRegExp(prefix);
        this.commands = commands;

        this.customPrefixes = [];
        //Add custom customPrefixes
        for (const command of commands) {
            if (!command.useDefaultPrefix) {
                this.customPrefixes.push({prefix: escapeRegExp(command.name), command});
            }
        }
    }

    parseCommand(str: string): { success: boolean, command?: Command, args?: string[], fullArgs?: string } {
        const splitted = str.trim().split(/\s+/);

        const prefix = splitted[0].toLowerCase();

        //Default prefix
        if (prefix == this.defaultPrefix) {

            //Missing command
            if (splitted.length === 1) {
                throw new CommandError(`Missing command, to see the list of commands use \`${Context.prefix} help\``);
            }

            //Find command
            const commandName = splitted[1].toLowerCase();
            for (const command of this.commands) {
                //Found command
                if (command.useDefaultPrefix && (commandName === command.name || command.aliases.includes(commandName))) {

                    return {
                        success: true,
                        command,
                        args: splitted.slice(2),
                        fullArgs: getEverythingAfterMatch(/\s+/g, str, 2)
                    };
                }
            }

            //Invalid command
            throw new CommandError(`Invalid command, to see the list of commands use \`${Context.prefix} help\``);

        }
        //Custom prefix
        for (const custom of this.customPrefixes) {
            if (prefix === custom.prefix) {
                return {
                    success: true,
                    command: custom.command,
                    args: splitted.slice(1),
                    fullArgs: getEverythingAfterMatch(/\s+/g, str, 1)
                };
            }
        }

        return {success: false};

    }

}
