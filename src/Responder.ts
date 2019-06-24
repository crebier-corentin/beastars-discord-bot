import {Action, ActionType, ChapterAction} from "./types";
import MangadexLinkGetter from "./MangadexLinkGetter";

export default class Responder {

    prefix: string;
    mangadex: MangadexLinkGetter;

    constructor(prefix: string) {
        this.prefix = prefix;
        this.mangadex = new MangadexLinkGetter();
    }

    async respond(action: Action): Promise<string> {
        switch (action.type) {
            case ActionType.Invalid:
                return this.invalidCommand();
            case ActionType.Help:
                return this.helpCommand();
            case ActionType.Chapter:
                return await this.chapterCommand((<ChapterAction>action).chapter);
        }
    }

    private invalidCommand(): string {
        return `Invalid command, to see the list of commands use \`${this.prefix} help\``;
    }

    private helpCommand(): string {
        return `
        \`${this.prefix} help\` or \`${this.prefix} h\`
        Show this help command
        
         \`${this.prefix} chapter [chapter]\` or \`${this.prefix} c [chapter]\`
         Send link to chapter Nº[chapter] 
         Example : \`${this.prefix} chapter 10\`
        `
    }

    private async chapterCommand(chapter: number): Promise<string> {
        return await this.mangadex.getPageLink(chapter);
    }


}