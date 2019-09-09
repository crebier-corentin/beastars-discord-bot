"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const snoowrap = require("snoowrap");
const r = new snoowrap({
    userAgent: "Beastars Discord Bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});
class RedditPostWatcher extends events.EventEmitter {
    constructor(user, previousSubmissionsId, filter) {
        super();
        this.user = user;
        this.previousSubmissionsId = previousSubmissionsId;
        this.filter = filter;
        //Launch interval
        setInterval(this.getSubmissions.bind(this), 1000 * 10);
    }
    static async create(user, filter) {
        const redditUser = r.getUser(user);
        const submissions = await redditUser.getSubmissions({ sort: "new" });
        const defaultPrevious = new Set(submissions.map(sub => sub.id));
        return new RedditPostWatcher(redditUser, defaultPrevious, filter);
    }
    async getSubmissions() {
        const latestSubmissions = await this.user.getSubmissions({ sort: "new" });
        //Filter
        let filteredSubmissions;
        if (this.filter != undefined) {
            filteredSubmissions = latestSubmissions.filter(this.filter);
        }
        //Remove already known posts
        const newSubmissions = filteredSubmissions.filter(submission => !this.previousSubmissionsId.has(submission.id));
        //Update previous submissions
        this.previousSubmissionsId = new Set(filteredSubmissions.map(submission => submission.id));
        //Send events
        for (const submission of newSubmissions) {
            this.emit("new", submission);
        }
    }
}
exports.RedditPostWatcher = RedditPostWatcher;
//# sourceMappingURL=Reddit.js.map