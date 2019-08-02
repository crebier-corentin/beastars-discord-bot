import {escapeRegExp, getEverythingAfterMatch, includeStartsWith, regexCount} from "./helpers";
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
        str = str.trim();
        const splitted = str.split(/\s+/);

        const prefix = splitted[0].toLowerCase();

        //Default prefix
        if (prefix == this.defaultPrefix) {

            //Missing command
            if (splitted.length === 1) {
                throw new CommandError(`Missing command, to see the list of commands use \`${Context.prefix} help\``);
            }

            //Find command
            const commandName = getEverythingAfterMatch(/\s+/g, str, 1).toLowerCase();
            for (const command of this.commands) {
                //Found command
                if (command.useDefaultPrefix && (commandName.startsWith(command.name) || includeStartsWith(command.aliases, commandName))) {

                    const whitespacesInCommand = regexCount(/\s+/g, command.name);

                    return {
                        success: true,
                        command,
                        args: splitted.splice(2 + whitespacesInCommand),
                        fullArgs: getEverythingAfterMatch(/\s+/g, str, 2 + whitespacesInCommand)
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
