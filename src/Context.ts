import {Client} from "discord.js";
import {Command} from "./types";

export namespace Context {
    // eslint-disable-next-line import/no-mutable-exports
    export let prefix: string;
    // eslint-disable-next-line import/no-mutable-exports
    export let commands: Command[];
    // eslint-disable-next-line import/no-mutable-exports
    export let client: Client;
}
