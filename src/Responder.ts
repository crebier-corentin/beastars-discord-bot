import {Action, ActionType, ChapterAction, Manga} from "./types";
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
                const chapterAction = <ChapterAction>action;
                return await this.chapterCommand(chapterAction.chapter, chapterAction.manga);
        }
    }

    private invalidCommand(): string {
        return `Invalid command, to see the list of commands use \`${this.prefix} help\``;
    }

    private helpCommand(): string {

        const delimiter = "=====================================================================";

        return `
\`${this.prefix} help\` or \`${this.prefix} h\`
Show this help command
${delimiter}
\`bs! [chapter]\`
Send link to Beastars chapter Nº[chapter]

**Example :** \`bs! 10\`
${delimiter}
\`bc! [chapter]\`
Send link to Beast Complex chapter Nº[chapter]

**Example :** \`bc! 2\`
`
    }

    private async chapterCommand(chapter: number, manga: Manga): Promise<string> {
        return await this.mangadex.getPageLink(chapter, manga);
    }


}