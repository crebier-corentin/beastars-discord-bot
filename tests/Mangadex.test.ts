import nock = require("nock");
import {assert} from "chai";
import {MangadexWatcher} from "../src/ExternalApi/Mangadex";
import mangadexManga1 from "./request-mock/mangadex-manga-1";
import mangadexManga2 from "./request-mock/mangadex-manga-2";

describe("MangadexWatcher", function () {

    let watcher: MangadexWatcher;

    before(async () => {

        nock("https://mangadex.org")
            .get("/api/manga/12345")
            .reply(200, mangadexManga1);

        watcher = await MangadexWatcher.create("12345");
    });


    it("should not return a new chapter if no new chapter are released", async function () {

        nock("https://mangadex.org")
            .get("/api/manga/12345")
            .reply(200, mangadexManga1);


        const submissions = await watcher.getNewChapters();
        assert.isArray(submissions);
        assert.isEmpty(submissions);

    });


    it("should return a new chapter if a new chapter is released", async function () {

        nock("https://mangadex.org")
            .get("/api/manga/12345")
            .reply(200, mangadexManga2);

        const submissions = await watcher.getNewChapters();
        assert.isArray(submissions);
        assert.isNotEmpty(submissions);
        assert.strictEqual(submissions[0].id, "12345");
        assert.strictEqual(submissions[0].title, "test");
    });

});