import axios, {AxiosResponse} from 'axios';
import Cache from "./Cache";
import {Manga} from "./types";

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

export default class MangadexLinkGetter {
    private cache: Cache;

    constructor() {
        //1H cache
        this.cache = new Cache(60 * 60);
    }

    async getPageLink(chapterNo: number, manga: Manga): Promise<string> {

        //Beast Complex 7
        if (manga == Manga.BeastComplex && chapterNo == 7) {
            return "https://www.dropbox.com/sh/2dfww0ylocfqpzn/AADJeQCEcb9YfyX5DQKZ1wY_a/Beast%20Complex%207?dl=0&subfolder_nav_tracking=1";
        }

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
                    return `Cannot find chapter Nº${chapterNo}`;
                }
            }
            //Chapter found
            else {
                return `https://mangadex.org/chapter/${chapter.id}`;
            }

        }

    }

    private async getChapter(chapterNo: number, manga: Manga): Promise<Chapter | null> {

        const chapters = <Chapter[]>await this.cache.get(manga, MangadexLinkGetter.getChapterList.bind(null, manga));

        const chapter = chapters.find((el) => el.chapter == chapterNo);

        return chapter == undefined ? null : chapter;
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
}