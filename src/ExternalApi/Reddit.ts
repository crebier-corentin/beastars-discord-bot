import axios, {AxiosResponse} from "axios";

export interface RedditSubmission {
    id: string;
    permalink: string;
    subreddit_name_prefixed: string;
    title: string;

    [key: string]: any;
}


export interface RedditUserSubmittedResponse {
    data: {
        children: {
            data: RedditSubmission;
        }[];
    };
}

export class RedditUserWatcher {
    private user: string;

    private filter: ((submission: RedditSubmission) => boolean) | undefined;

    private previousSubmissionsId: Set<string>;

    private constructor(user: string, filter: ((submission: RedditSubmission) => boolean) | undefined) {
        this.user = user;
        this.filter = filter;
    }

    public static async create(user: string, filter?: ((submission: RedditSubmission) => boolean)): Promise<RedditUserWatcher> {
        const watcher = new RedditUserWatcher(user, filter);

        const previousSubmissions = await watcher.getSubmissionsFiltered();

        watcher.previousSubmissionsId = new Set<string>(previousSubmissions.map((sub) => sub.id));

        return watcher;
    }

    public async getNewSubmissions(): Promise<RedditSubmission[]> {
        const filteredSubmissions = await this.getSubmissionsFiltered();

        //Remove already known posts
        const newSubmissions = filteredSubmissions.filter((submission) => !this.previousSubmissionsId.has(submission.id));

        //Update previous submissions if needed
        if (newSubmissions.length > 0) {
            this.previousSubmissionsId = new Set<string>(filteredSubmissions.map((submission) => submission.id));
        }

        return newSubmissions;
    }

    private async getSubmissionsFiltered(): Promise<RedditSubmission[]> {
        const response = <AxiosResponse<RedditUserSubmittedResponse>> await axios.get(`https://www.reddit.com/user/${this.user}/submitted.json?sort=new`);

        const latestSubmissions: RedditSubmission[] = response.data.data.children.map((value) => value.data);

        //Filter
        return this.filter != undefined ? latestSubmissions.filter(this.filter) : latestSubmissions;
    }
}
