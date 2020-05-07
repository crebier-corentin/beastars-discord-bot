"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Cache_1 = require("../Cache");
const types_1 = require("../types");
class Mangadex {
    static async getChapterList(mangaId) {
        const result = await axios_1.default.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);
        const mangadexChapters = result.data.chapter;
        return Object.keys(mangadexChapters).reduce((chapters, chapterId) => {
            const chapter = mangadexChapters[chapterId];
            //Ignore non english chapters
            if (chapter.lang_code != "gb")
                return chapters;
            chapters.push({
                id: chapterId,
                title: chapter.title,
                chapter: chapter.chapter,
                volume: chapter.volume,
            });
            return chapters;
        }, []);
    }
    static async getChapterByIdByGroup(mangaId) {
        const result = await axios_1.default.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);
        const mangadexChapters = result.data.chapter;
        return Object.keys(mangadexChapters).reduce((chapterMap, chapterId) => {
            const chapter = mangadexChapters[chapterId];
            //Ignore non english chapters
            if (chapter.lang_code != "gb")
                return chapterMap;
            return Object.assign(Object.assign({}, chapterMap), { [chapter.chapter]: Object.assign(Object.assign({}, chapterMap[chapter.chapter]), { [chapter.group_name]: {
                        id: chapterId,
                        title: chapter.title,
                        chapter: chapter.chapter,
                        volume: chapter.volume,
                    } }) });
        }, {});
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
    async getChapter(chapterNo, manga, group = null) {
        var _a;
        const chapters = await this.cache.get(manga, Mangadex.getChapterByIdByGroup.bind(null, manga, true));
        const chapterGroups = chapters[chapterNo];
        if (chapterGroups == undefined) {
            throw new types_1.CommandError(`Cannot find chapter Nº${chapterNo}`);
        }
        //Group specification
        if (group != null) {
            const chapter = chapterGroups[group];
            if (chapter == undefined)
                throw new types_1.CommandError(`Cannot find chapter Nº${chapterNo} from group '${group}'`);
            return chapter;
        }
        //Prefers HCS over other groups
        return (_a = chapterGroups["Hot Chocolate Scans"]) !== null && _a !== void 0 ? _a : Object.values(chapterGroups)[0];
    }
    async getChapterWithRetry(chapterNo, manga, group = null) {
        let retry = true;
        while (true) {
            try {
                return await this.getChapter(chapterNo, manga, group);
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
    async getChapterLink(chapterNo, manga, group = null) {
        const chapter = await this.getChapterWithRetry(chapterNo, manga, group);
        return `https://mangadex.org/chapter/${chapter.id}`;
    }
    async getChapterPageLink(chapterNo, pageNo, manga, group = null) {
        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga, group);
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