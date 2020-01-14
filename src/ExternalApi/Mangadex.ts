import axios, {AxiosResponse} from "axios";
import Cache from "../Cache";
import {CommandError, Manga} from "../types";

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
        group_name: "Hot Chocolate Scans" | string
    };
}

interface ChapterPages {
    id: string | number;
    hash: string;
    server: string;
    page_array: string[];
}

export class Mangadex {
    protected static async getChapterList(mangaId: Manga | string, HCSOnly: boolean = false): Promise<Chapter[]> {
        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);

        const chapters: Chapter[] = [];
        const mangadexChapters: MangadexChapters = result.data.chapter;

        for (const mangadexChapterName in mangadexChapters) {
            const mangadexChapter = mangadexChapters[mangadexChapterName];

            //Ignore non english chapters
            if (mangadexChapter.lang_code != "gb") continue;

            //Ignore non HCS if HCS translation exists for this chapter
            if (HCSOnly
                && mangadexChapter.group_name != "Hot Chocolate Scans"
                && Object.values(mangadexChapters).find(c => c.chapter === mangadexChapter.chapter && c.group_name == "Hot Chocolate Scans") != undefined) {
                continue;
            }

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

    protected static async getChapterPages(chapter: Chapter): Promise<ChapterPages> {
        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/chapter/${chapter.id}`).catch(() => {
            throw new CommandError(`Cannot find pages for chapter Nº${chapter.chapter}`);
        });

        return {
            id: result.data.id.toString(),
            hash: result.data.hash,
            server: result.data.server,
            page_array: result.data.page_array,
        };
    }
}

export class MangadexWithCache extends Mangadex {
    private cache: Cache;

    constructor() {
        super();

        //1H cache
        this.cache = new Cache(60 * 60);
    }

    async getChapterLink(chapterNo: number, manga: Manga): Promise<string> {
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
        const chapters = <Chapter[]>await this.cache.get(manga, Mangadex.getChapterList.bind(null, manga, true));

        const chapter = chapters.find((el) => el.chapter == chapterNo);

        if (chapter == undefined) {
            throw new CommandError(`Cannot find chapter Nº${chapterNo}`);
        }

        return chapter;
    }

    async getChapterPageLink(chapterNo: number, pageNo: number, manga: Manga): Promise<{ site: string, image: string; }> {
        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga);

        //Chapter pages
        const pages = <ChapterPages>await this.cache.get(`${chapter.id}-pages`, Mangadex.getChapterPages.bind(null, chapter));

        //Filename
        const pageFilename = pages.page_array[pageNo - 1];

        if (pageFilename == null) {
            throw new CommandError(`Cannot find page Nº${pageNo} in chapter Nº${chapterNo}`);
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

export class MangadexWatcher extends Mangadex {
    private previousChaptersId: Set<string>;

    private mangaId: Manga | string;

    private constructor(mangaId: Manga | string, previousChaptersId: Set<string>) {
        super();
        this.mangaId = mangaId;
        this.previousChaptersId = previousChaptersId;
    }

    public static async create(mangaId: Manga | string): Promise<MangadexWatcher> {
        const chapters = await Mangadex.getChapterList(mangaId);

        return new MangadexWatcher(mangaId, new Set<string>(chapters.map((chapter) => chapter.id)));
    }

    public async getNewChapters(): Promise<Chapter[]> {
        const lastestChapters = await Mangadex.getChapterList(this.mangaId);

        //Remove already known chapters
        const newChapters = lastestChapters.filter((chapter) => !this.previousChaptersId.has(chapter.id));

        //Update previousChaptersId if needed
        if (newChapters.length > 0) {
            this.previousChaptersId = new Set<string>(lastestChapters.map((chapter) => chapter.id));
        }

        return newChapters;
    }
}
