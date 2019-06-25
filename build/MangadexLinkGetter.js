"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Cache_1 = require("./Cache");
const types_1 = require("./types");
class MangadexLinkGetter {
    constructor() {
        //1H cache
        this.cache = new Cache_1.default(60 * 60);
    }
    async getChapterLink(chapterNo, manga) {
        //Beast Complex 7
        if (manga == types_1.Manga.BeastComplex && chapterNo == 7) {
            return "https://www.dropbox.com/sh/2dfww0ylocfqpzn/AADJeQCEcb9YfyX5DQKZ1wY_a/Beast%20Complex%207?dl=0&subfolder_nav_tracking=1";
        }
        const chapter = await this.getChapterWithRetry(chapterNo, manga);
        if (chapter == null) {
            return `Cannot find chapter Nº${chapterNo}`;
        }
        return `https://mangadex.org/chapter/${chapter.id}`;
    }
    async getChapterWithRetry(chapterNo, manga) {
        let retry = true;
        while (true) {
            const chapter = await this.getChapter(chapterNo, manga);
            //Chapter not found
            if (chapter == null) {
                //Clear cache and retry
                if (retry) {
                    this.cache.del(manga);
                    retry = false;
                }
                //Return error message
                else {
                    return null;
                }
            }
            //Chapter found
            else {
                return chapter;
            }
        }
    }
    async getChapter(chapterNo, manga) {
        const chapters = await this.cache.get(manga, MangadexLinkGetter.getChapterList.bind(null, manga));
        const chapter = chapters.find((el) => el.chapter == chapterNo);
        return chapter == undefined ? null : chapter;
    }
    static async getChapterList(mangaId) {
        const result = await axios_1.default.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => {
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
    async getChapterPageLink(chapterNo, pageNo, manga) {
        //Beast Complex 7
        if (manga == types_1.Manga.BeastComplex && chapterNo == 7) {
            return "Cannot post pages from Beast Complex 7\nhttps://www.dropbox.com/sh/2dfww0ylocfqpzn/AADJeQCEcb9YfyX5DQKZ1wY_a/Beast%20Complex%207?dl=0&subfolder_nav_tracking=1";
        }
        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga);
        if (chapter == null) {
            return `Cannot find chapter Nº${chapterNo}`;
        }
        //Chapter pages
        const pages = await this.cache.get(`${chapter.id}-pages`, MangadexLinkGetter.getChapterPages.bind(null, chapter));
        if (pages == null) {
            return `Cannot find chapter Nº${chapterNo}`;
        }
        //Filename
        const pageFilename = pages.page_array[pageNo - 1];
        if (pageFilename == null) {
            return `Cannot find page Nº${pageNo} in chapter Nº${chapterNo}`;
        }
        //Return links
        return {
            site: `https://mangadex.org/chapter/${chapter.id}/${pageNo}`,
            image: `${pages.server}${pages.hash}/${pageFilename}`
        };
    }
    static async getChapterPages(chapter) {
        const result = await axios_1.default.get(`https://mangadex.org/api/chapter/${chapter.id}`).catch(() => {
            return null;
        });
        if (result == null)
            return null;
        return {
            id: result.data.id.toString(),
            hash: result.data.hash,
            server: result.data.server,
            page_array: result.data.page_array
        };
    }
}
exports.default = MangadexLinkGetter;
//# sourceMappingURL=MangadexLinkGetter.js.map