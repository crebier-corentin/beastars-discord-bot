"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const Commands_1 = require("./Commands");
class Parser {
    constructor(prefix, commands) {
        this.defaultPrefix = helpers_1.escapeRegExp(prefix);
        this.commands = commands;
        this.customPrefixes = [];
        //Add custom customPrefixes
        for (const command of commands) {
            if (!command.useDefaultPrefix) {
                this.customPrefixes.push({ prefix: helpers_1.escapeRegExp(command.name), command });
            }
        }
    }
    parseCommand(str) {
        const splitted = str.trim().split(/\s+/);
        const prefix = splitted[0].toLowerCase();
        //Default prefix
        if (prefix == this.defaultPrefix) {
            //Find command
            const commandName = splitted[1];
            for (const command of this.commands) {
                //Found command
                if (command.useDefaultPrefix && (commandName === command.name || command.aliases.includes(commandName))) {
                    return { success: true, command, args: splitted.slice(2) };
                }
            }
            //Invalid command
            return { success: true, command: Commands_1.InvalidCommand, args: [] };
        }
        //Custom prefix
        for (const custom of this.customPrefixes) {
            if (prefix === custom.prefix) {
                return { success: true, command: custom.command, args: splitted.slice(1) };
            }
        }
        return { success: false };
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map