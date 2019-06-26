import {escapeRegExp} from "./helpers";
import {Command, InvalidCommand} from "./Commands";

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

    parseCommand(str: string): { success: boolean, command?: Command, args?: string[] } {
        const splitted = str.trim().split(/\s+/);

        const prefix = splitted[0].toLowerCase();

        //Default prefix
        if (prefix == this.defaultPrefix) {

            //Find command
            const commandName = splitted[1].toLowerCase();
            for (const command of this.commands) {
                //Found command
                if (command.useDefaultPrefix && (commandName === command.name || command.aliases.includes(commandName))) {
                    return {success: true, command, args: splitted.slice(2)};
                }
            }

            //Invalid command
            return {success: true, command: InvalidCommand, args: []};

        }
        //Custom prefix
        for (const custom of this.customPrefixes) {
            if (prefix === custom.prefix) {
                return {success: true, command: custom.command, args: splitted.slice(1)};
            }
        }

        return {success: false};

    }

}
