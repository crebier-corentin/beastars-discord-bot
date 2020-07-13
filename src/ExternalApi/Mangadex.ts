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

interface ChapterByChapterNoByGroup {
    [chapter: number]: {
        [group: string]: Chapter;
    }
}

export class Mangadex {

    protected static async getChapterList(mangaId: Manga | string): Promise<Chapter[]> {
        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);

        const mangadexChapters: MangadexChapters = result.data.chapter;

        return Object.keys(mangadexChapters).reduce((chapters, chapterId) => {

            const chapter = mangadexChapters[chapterId];

            //Ignore non english chapters
            if (chapter.lang_code != "gb") return chapters;

            chapters.push({
                id: chapterId,
                title: chapter.title,
                chapter: chapter.chapter,
                volume: chapter.volume,
            });

            return chapters;
        }, []);

    }

    protected static async getChapterByChapterNoByGroup(mangaId: Manga | string): Promise<ChapterByChapterNoByGroup> {
        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/manga/${mangaId}`).catch(() => []);

        const mangadexChapters: MangadexChapters = result.data.chapter;

        return Object.keys(mangadexChapters).reduce((chapterMap, chapterId) => {
            const chapter = mangadexChapters[chapterId];

            //Ignore non english chapters
            if (chapter.lang_code != "gb") return chapterMap;

            return {
                ...chapterMap, [chapter.chapter]: {
                    ...chapterMap[chapter.chapter], [chapter.group_name]: {
                        id: chapterId,
                        title: chapter.title,
                        chapter: chapter.chapter,
                        volume: chapter.volume,
                    }
                }
            };

        }, {});
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

    private async getChapter(chapterNo: number, manga: Manga, group: string | null = null): Promise<Chapter> {
        const chapters = <ChapterByChapterNoByGroup>await this.cache.get(manga, Mangadex.getChapterByChapterNoByGroup.bind(null, manga, true));

        const chapterGroups = chapters[chapterNo];

        if (chapterGroups == undefined) {
            throw new CommandError(`Cannot find chapter Nº${chapterNo}`);
        }

        //Group specification
        if (group != null) {
            const chapter = chapterGroups[group];
            if (chapter == undefined) throw new CommandError(`Cannot find chapter Nº${chapterNo} from group '${group}'`);

            return chapter;
        }

        //Prefers HCS over other groups
        return chapterGroups["Hot Chocolate Scans"] ?? Object.values(chapterGroups)[0];
    }

    private async getChapterWithRetry(chapterNo: number, manga: Manga, group: string | null = null): Promise<Chapter> {
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

    async getChapterLink(chapterNo: number, manga: Manga, group: string | null = null): Promise<string> {
        const chapter = await this.getChapterWithRetry(chapterNo, manga, group);

        return `https://mangadex.org/chapter/${chapter.id}`;
    }

    async getChapterPageLink(chapterNo: number, pageNo: number, manga: Manga, group: string | null = null): Promise<{ site: string, image: string; }> {
        //Chapter
        const chapter = await this.getChapterWithRetry(chapterNo, manga, group);

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
