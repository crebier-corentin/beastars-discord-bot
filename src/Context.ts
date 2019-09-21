import {Client} from "discord.js";
import {Command} from "./types";

export namespace Context {
    export let prefix: string;
    export let commands: Command[];
    export let client: Client;
}
