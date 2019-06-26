import axios, {AxiosResponse} from 'axios';
import Cache from "./Cache";
import {CommandError, Manga} from "./types";

interface Chapter {
    id: string;
    title: string;
    chapter: number;
    volume: string;
}

interface MangadexChapters {
    [id: string]: {
        "volume": string;
        "chapter": number;
        "title": string;
        "lang_code": "gb" | string;
    };
}

interface ChapterPages {
    id: string | number;
    hash: string;
    server: string;
    page_array: string[];
}

export default class MangadexLinkGetter {
    private cache: Cache;

    constructor() {
        //1H cache
        this.cache = new Cache(60 * 60);
    }

    async getChapterLink(chapterNo: number, manga: Manga): Promise<string> {

        //Beast Complex 7
        if (manga == Manga.BeastComplex && chapterNo == 7) {
            return "https://www.dropbox.com/sh/2dfww0ylocfqpzn/AADJeQCEcb9YfyX5DQKZ1wY_a/Beast%20Complex%207?dl=0&subfolder_nav_tracking=1";
        }

        const chapter = await this.getChapterWithRetry(chapterNo, manga);

        return `https://mangadex.org/chapter/${chapter.id}`;

    }

    private async getChapterWithRetry(chapterNo: number, manga: Manga): Promise<Chapter> {
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

    private async getChapter(chapterNo: number, manga: Manga): Promise<Chapter> {

        const chapters = <Chapter[]>await this.cache.get(manga, MangadexLinkGetter.getChapterList.bind(null, manga));

        const chapter = chapters.find((el) => el.chapter == chapterNo);

        if (chapter == undefined) {
            throw new CommandError(`Cannot find chapter Nº${chapterNo}`);
        }

        return chapter;
    }

    private static async getChapterList(mangaId: Manga): Promise<Chapter[]> {
        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => {
            return [];
        });

        const chapters: Chapter[] = [];
        const mangadexChapters: MangadexChapters = result.data["chapter"];

        for (const mangadexChapterName in mangadexChapters) {
            const mangadexChapter = mangadexChapters[mangadexChapterName];

            //Ignore non english chapters
            if (mangadexChapter.lang_code != "gb") continue;

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

    async getChapterPageLink(chapterNo: number, pageNo: number, manga: Manga): Promise<string | { site: string, image: string; }> {

        //Beast Complex 7
        if (manga == Manga.BeastComplex && chapterNo == 7) {
            return "Cannot post pages from Beast Complex 7\nhttps://www.dropbox.com/sh/2dfww0ylocfqpzn/AADJeQCEcb9YfyX5DQKZ1wY_a/Beast%20Complex%207?dl=0&subfolder_nav_tracking=1";
        }

        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga);

        //Chapter pages
        const pages = <ChapterPages>await this.cache.get(`${chapter.id}-pages`, MangadexLinkGetter.getChapterPages.bind(null, chapter));

        //Filename
        const pageFilename = pages.page_array[pageNo - 1];

        if (pageFilename == null) {
            throw new CommandError(`Cannot find page Nº${pageNo} in chapter Nº${chapterNo}`);
        }

        //Return links
        return {
            site: `https://mangadex.org/chapter/${chapter.id}/${pageNo}`,
            image: `${pages.server}${pages.hash}/${pageFilename}`
        };

    }

    private static async getChapterPages(chapter: Chapter): Promise<ChapterPages> {

        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/chapter/${chapter.id}`).catch(() => {
            throw new CommandError(`Cannot find pages for chapter Nº${chapter.chapter}`);
        });

        return {
            id: result.data.id.toString(),
            hash: result.data.hash,
            server: result.data.server,
            page_array: result.data.page_array
        };

    }

}