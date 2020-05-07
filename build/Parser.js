"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const types_1 = require("./types");
const Context_1 = require("./Context");
class Parser {
    constructor(prefix, commands) {
        this.customPrefixes = new Map();
        this.defaultPrefix = helpers_1.escapeRegExp(prefix);
        this.commands = commands;
        //Add custom customPrefixes
        for (const command of commands) {
            if (!command.useDefaultPrefix) {
                this.customPrefixes.set(helpers_1.escapeRegExp(command.name), command);
            }
        }
    }
    parseCommand(str) {
        str = str.trim();
        const splitted = str.split(/\s+/);
        const prefix = splitted[0].toLowerCase();
        //Custom prefix
        const command = this.customPrefixes.get(prefix);
        if (command != undefined) {
            return {
                success: true,
                command: command,
                args: splitted.slice(1),
                fullArgs: helpers_1.getEverythingAfterMatch(/\s+/g, str, 1),
            };
        }
        //Default prefix
        if (prefix == this.defaultPrefix) {
            //Missing command
            if (splitted.length === 1) {
                throw new types_1.CommandError(`Missing command, to see the list of commands use \`${Context_1.Context.prefix} help\``);
            }
            const checkCommand = (command, comandName) => {
                const commandName = comandName.split(/\s+/g);
                const whitespacesInCommand = commandName.length - 1;
                const userCommandName = splitted.slice(1, 2 + whitespacesInCommand).map((value) => value.toLowerCase());
                //Match found
                if (helpers_1.arrayEqual(commandName, userCommandName)) {
                    return {
                        success: true,
                        command,
                        args: splitted.splice(2 + whitespacesInCommand),
                        fullArgs: helpers_1.getEverythingAfterMatch(/\s+/g, str, 2 + whitespacesInCommand),
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
            throw new types_1.CommandError(`Invalid command, to see the list of commands use \`${Context_1.Context.prefix} help\`\nIf you want to use the image feature don't forget the command name \`${Context_1.Context.prefix} i [name]\``);
        }
        return { success: false };
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map