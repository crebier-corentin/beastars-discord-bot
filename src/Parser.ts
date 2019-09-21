import {arrayEqual, escapeRegExp, getEverythingAfterMatch} from "./helpers";
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

            const checkCommand = (command: Command, comandName: string) => {
                const commandName = comandName.split(/\s+/g);
                const whitespacesInCommand = commandName.length - 1;
                const userCommandName = splitted.slice(1, 2 + whitespacesInCommand).map((value) => value.toLowerCase());

                //Match found
                if (arrayEqual(commandName, userCommandName)) {
                    return {
                        success: true,
                        command,
                        args: splitted.splice(2 + whitespacesInCommand),
                        fullArgs: getEverythingAfterMatch(/\s+/g, str, 2 + whitespacesInCommand),
                    };
                }

                return {
                    success: false,
                };
            };

            //Find command
            for (const command of this.commands) {
                //Try with command name
                if (command.useDefaultPrefix) {
                    const res = checkCommand(command, command.name);
                    if (res.success) {
                        return res;
                    }
                }

                //Try with aliases
                for (const alias of command.aliases || []) {
                    const res = checkCommand(command, alias);
                    if (res.success) {
                        return res;
                    }
                }
            }

            //Invalid command
            throw new CommandError(`Invalid command, to see the list of commands use \`${Context.prefix} help\`\nIf you want to use the image feature don't forget the command name \`${Context.prefix} i [name]\``);
        }
        //Custom prefix
        for (const custom of this.customPrefixes) {
            if (prefix === custom.prefix) {
                return {
                    success: true,
                    command: custom.command,
                    args: splitted.slice(1),
                    fullArgs: getEverythingAfterMatch(/\s+/g, str, 1),
                };
            }
        }

        return {success: false};
    }
}
