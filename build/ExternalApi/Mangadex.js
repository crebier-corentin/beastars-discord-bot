"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Cache_1 = require("../Cache");
const types_1 = require("../types");
class Mangadex {
    static async getChapterList(mangaId, HCSOnly = false) {
        const result = await axios_1.default.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);
        const chapters = [];
        const mangadexChapters = result.data.chapter;
        for (const mangadexChapterName in mangadexChapters) {
            const mangadexChapter = mangadexChapters[mangadexChapterName];
            //Ignore non english chapters
            if (mangadexChapter.lang_code != "gb")
                continue;
            //Ignore non HCS
            if (HCSOnly && mangadexChapter.group_name != "Hot Chocolate Scans")
                continue;
            //Add new chapter
            chapters.push({
                id: mangadexChapterName,
                title: mangadexChapter.title,
                chapter: mangadexChapter.chapter,
                volume: mangadexChapter.volume,
            });
        }
        return chapters;
    }
    static async getChapterPages(chapter) {
        const result = await axios_1.default.get(`https://mangadex.org/api/chapter/${chapter.id}`).catch(() => {
            throw new types_1.CommandError(`Cannot find pages for chapter Nº${chapter.chapter}`);
        });
        return {
            id: result.data.id.toString(),
            hash: result.data.hash,
            server: result.data.server,
            page_array: result.data.page_array,
        };
    }
}
exports.Mangadex = Mangadex;
class MangadexWithCache extends Mangadex {
    constructor() {
        super();
        //1H cache
        this.cache = new Cache_1.default(60 * 60);
    }
    async getChapterLink(chapterNo, manga) {
        const chapter = await this.getChapterWithRetry(chapterNo, manga);
        return `https://mangadex.org/chapter/${chapter.id}`;
    }
    async getChapterWithRetry(chapterNo, manga) {
        let retry = true;
        while (true) {
            try {
                return await this.getChapter(chapterNo, manga);
            }
            catch (e) {
                //Retry
                if (retry) {
                    this.cache.del(manga);
                    retry = false;
                }
                //Already retried throw error
                else {
                    throw e;
                }
            }
        }
    }
    async getChapter(chapterNo, manga) {
        const chapters = await this.cache.get(manga, Mangadex.getChapterList.bind(null, manga, true));
        const chapter = chapters.find((el) => el.chapter == chapterNo);
        if (chapter == undefined) {
            throw new types_1.CommandError(`Cannot find chapter Nº${chapterNo}`);
        }
        return chapter;
    }
    async getChapterPageLink(chapterNo, pageNo, manga) {
        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga);
        //Chapter pages
        const pages = await this.cache.get(`${chapter.id}-pages`, Mangadex.getChapterPages.bind(null, chapter));
        //Filename
        const pageFilename = pages.page_array[pageNo - 1];
        if (pageFilename == null) {
            throw new types_1.CommandError(`Cannot find page Nº${pageNo} in chapter Nº${chapterNo}`);
        }
        //Fix server url
        if (pages.server.startsWith("/")) {
            pages.server = `https://mangadex.org${pages.server}`;
        }
        //Return links
        return {
            site: `https://mangadex.org/chapter/${chapter.id}/${pageNo}`,
            image: `${pages.server}${pages.hash}/${pageFilename}`,
        };
    }
}
exports.MangadexWithCache = MangadexWithCache;
class MangadexWatcher extends Mangadex {
    constructor(mangaId, previousChaptersId) {
        super();
        this.mangaId = mangaId;
        this.previousChaptersId = previousChaptersId;
    }
    static async create(mangaId) {
        const chapters = await Mangadex.getChapterList(mangaId);
        return new MangadexWatcher(mangaId, new Set(chapters.map((chapter) => chapter.id)));
    }
    async getNewChapters() {
        const lastestChapters = await Mangadex.getChapterList(this.mangaId);
        //Remove already known chapters
        const newChapters = lastestChapters.filter((chapter) => !this.previousChaptersId.has(chapter.id));
        //Update previousChaptersId if needed
        if (newChapters.length > 0) {
            this.previousChaptersId = new Set(lastestChapters.map((chapter) => chapter.id));
        }
        return newChapters;
    }
}
exports.MangadexWatcher = MangadexWatcher;
//# sourceMappingURL=Mangadex.js.map