import {RedditUserSubmittedResponse} from "../../src/ExternalApi/Reddit";

export default <RedditUserSubmittedResponse>{
    "kind": "Listing",
    "data": {
        "modhash": "5yy5boy73o3ee2cc70efdf6cb08116f2324535e5779ca9db54", "dist": 21,
        "children": [
            {
                "data": {
                    "title": "test",
                    "subreddit_name_prefixed": "r/test",
                    "id": "123",
                    "permalink": "/r/test/comments/123/test/",
                }
            },
            {
                "data": {
                    "title": "filter",
                    "subreddit_name_prefixed": "r/haha",
                    "id": "d26c6697b7",
                    "permalink": "/r/haha/comments/d26c6697b7/filter/",
                }
            },
            {
                "data": {
                    "title": "malicious npm package",
                    "subreddit_name_prefixed": "r/ProgrammerHumor",
                    "id": "d26cb7",
                    "permalink": "/r/ProgrammerHumor/comments/d26cb7/malicious_npm_package/",
                }
            }, {
                "data": {
                    "title": "example",
                    "subreddit_name_prefixed": "r/test",
                    "id": "deaze6cb5",
                    "permalink": "/r/test/comments/deaze6cb5/example/",
                }
            }], "after": null, "before": null
    }
};