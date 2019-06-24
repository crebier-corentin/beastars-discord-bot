"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Cache_1 = require("./Cache");
class MangadexLinkGetter {
    constructor() {
        //1H cache
        this.cache = new Cache_1.default(60 * 60);
    }
    async getPageLink(chapterNo) {
        const chapters = await this.cache.get("chapters", MangadexLinkGetter.getChapterList);
        const chapter = chapters.find((el) => el.chapter == chapterNo);
        //Chapter not found
        if (chapter == undefined) {
            return `Cannot find chapter Nº ${chapterNo}`;
        }
        //Return chapter Link
        return `https://mangadex.org/chapter/${chapter.id}`;
    }
    static async getChapterList() {
        const beastarsId = "20523";
        const result = await axios_1.default.get(`https://mangadex.org/api/manga/${beastarsId}`).catch(() => {
            return [];
        });
        const chapters = [];
        const mangadexChapters = result.data["chapter"];
        for (const mangadexChapterName in mangadexChapters) {
            const mangadexChapter = mangadexChapters[mangadexChapterName];
            //Ignore non english chapters
            if (mangadexChapter.lang_code != "gb")
                continue;
            //Add new chapter
            chapters.push({
                id: mangadexChapterName,
                title: mangadexChapter.title,
                chapter: mangadexChapter.chapter,
                volume: mangadexChapter.volume
            });
        }
        return chapters;
    }
}
exports.default = MangadexLinkGetter;
//# sourceMappingURL=MangadexLinkGetter.js.map