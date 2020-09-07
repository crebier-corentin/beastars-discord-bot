"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedditUserWatcher = void 0;
const axios_1 = require("axios");
class RedditUserWatcher {
    constructor(user, filter) {
        this.user = user;
        this.filter = filter;
    }
    static async create(user, filter) {
        const watcher = new RedditUserWatcher(user, filter);
        const previousSubmissions = await watcher.getSubmissionsFiltered();
        watcher.previousSubmissionsId = new Set(previousSubmissions.map((sub) => sub.id));
        return watcher;
    }
    async getNewSubmissions() {
        const filteredSubmissions = await this.getSubmissionsFiltered();
        //Remove already known posts
        const newSubmissions = filteredSubmissions.filter((submission) => !this.previousSubmissionsId.has(submission.id));
        //Update previous submissions if needed
        if (newSubmissions.length > 0) {
            this.previousSubmissionsId = new Set(filteredSubmissions.map((submission) => submission.id));
        }
        return newSubmissions;
    }
    async getSubmissionsFiltered() {
        const response = await axios_1.default.get(`https://www.reddit.com/user/${this.user}/submitted.json?sort=new`);
        const latestSubmissions = response.data.data.children.map((value) => value.data);
        //Filter
        return this.filter != undefined ? latestSubmissions.filter(this.filter) : latestSubmissions;
    }
}
exports.RedditUserWatcher = RedditUserWatcher;
//# sourceMappingURL=Reddit.js.map