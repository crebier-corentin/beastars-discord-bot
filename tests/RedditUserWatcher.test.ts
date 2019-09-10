import {RedditUserWatcher} from "../src/ExternalApi/Reddit";
import redditSubmitted1 from "./request-mock/reddit-submitted-1";
import redditSubmitted2 from "./request-mock/reddit-submitted-2";
import redditSubmitted3 from "./request-mock/reddit-submitted-3";
import nock = require("nock");
import {assert} from "chai";

describe("RedditUserWatcher", function () {

    let watcher: RedditUserWatcher;

    before(async () => {

        nock("https://www.reddit.com")
            .get("/user/test/submitted.json")
            .query({
                sort: "new"
            })
            .reply(200, redditSubmitted1);

        watcher = await RedditUserWatcher.create("test", submission => submission.subreddit_name_prefixed === "r/test");
    });

    describe("filter", function () {

        it("should not return a new submission if it does not pass the filter", async function () {

            nock("https://www.reddit.com")
                .get("/user/test/submitted.json")
                .query({
                    sort: "new"
                })
                .reply(200, redditSubmitted2);


            const submissions = await watcher.getNewSubmissions();
            assert.isArray(submissions);
            assert.isEmpty(submissions);

        });

        it("should return a new submission if the filter pass", async function () {

            nock("https://www.reddit.com")
                .get("/user/test/submitted.json")
                .query({
                    sort: "new"
                })
                .reply(200, redditSubmitted3);

            const submissions = await watcher.getNewSubmissions();
            assert.isArray(submissions);
            assert.isNotEmpty(submissions);
            assert.strictEqual(submissions[0].subreddit_name_prefixed, "r/test");
            assert.strictEqual(submissions[0].title, "test");
        });

    });

});