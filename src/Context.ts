import {Client} from "discord.js";
import {Command} from "./Commands";

export namespace Context {
    export let prefix: string;
    export let commands: Command[];
    export let client: Client;
}