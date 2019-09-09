import * as events from "events";
import {RedditUser, Submission} from "snoowrap";
import snoowrap = require("snoowrap");

const r = new snoowrap({
    userAgent: "Beastars Discord Bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});

export declare interface RedditPostWatcher {
    on(event: 'new', listener: (submission: Submission) => void): this;
}

export class RedditPostWatcher extends events.EventEmitter {
    private user: RedditUser;
    private filter: ((submission: Submission) => boolean) | undefined;

    private previousSubmissionsId: Set<string>;

    private constructor(user: RedditUser, previousSubmissionsId: Set<string>, filter: ((submission: Submission) => boolean) | undefined) {
        super();
        this.user = user;
        this.previousSubmissionsId = previousSubmissionsId;
        this.filter = filter;

        //Launch interval
        setInterval(this.getSubmissions.bind(this), 1000 * 10);

    }

    public static async create(user: string, filter?: ((submission: Submission) => boolean)): Promise<RedditPostWatcher> {

        const redditUser = r.getUser(user);

        const submissions = await redditUser.getSubmissions({sort: "new"});
        const defaultPrevious = new Set<string>(submissions.map(sub => sub.id));

        return new RedditPostWatcher(redditUser, defaultPrevious, filter);
    }

    private async getSubmissions() {
        const latestSubmissions = await this.user.getSubmissions({sort: "new"});

        //Filter
        let filteredSubmissions: Submission[];
        if (this.filter != undefined) {
            filteredSubmissions = latestSubmissions.filter(this.filter);
        }

        //Remove already known posts
        const newSubmissions = filteredSubmissions.filter(submission => !this.previousSubmissionsId.has(submission.id));

        //Update previous submissions
        this.previousSubmissionsId = new Set<string>(filteredSubmissions.map(submission => submission.id));

        //Send events
        for (const submission of newSubmissions) {
            this.emit("new", submission);
        }

    }


}