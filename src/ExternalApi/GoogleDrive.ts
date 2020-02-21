import axios, {AxiosResponse} from "axios";
import Cache from "../Cache";
import {CommandError} from "../types";

interface GoogleDriveFilesListResponse {
    files: {
        id?: string;
        name?: string;
        webContentLink?: string;
    }[];
}

export class GoogleDrive {
    protected static async getChapterFolderId(driveFolderId: string, chapterNo: number): Promise<string> {
        const res = <AxiosResponse<GoogleDriveFilesListResponse>>await axios.get("https://www.googleapis.com/drive/v3/files", {
            params: {
                q: `'${driveFolderId}' in parents`,
                key: process.env.GOOGLE_API_KEY
            }
        });

        const files = res.data.files;

        const folder = files.find(f => f.name.startsWith(`Ch. ${chapterNo.toString().padStart(3, "0")}`));

        if (folder == undefined) {
            throw new CommandError(`Cannot find chapter N°${chapterNo}`);
        }

        return folder.id;
    }

    protected static async getPagesLinks(driveFolderId: string, chapterNo: number): Promise<string[]> {
        const folderId = await this.getChapterFolderId(driveFolderId, chapterNo);

        const res = <AxiosResponse<GoogleDriveFilesListResponse>>await axios.get("https://www.googleapis.com/drive/v3/files", {
            params: {
                q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
                orderBy: "name",
                fields: "files(webContentLink)",
                key: process.env.GOOGLE_API_KEY
            }
        });

        return res.data.files.map((page) => page.webContentLink);
    }
}

export class GoogleDriveWithCache extends GoogleDrive {
    private cache: Cache;

    constructor() {
        super();

        //24h cache
        this.cache = new Cache(60 * 60 * 24);
    }

    private getPagesLinksWithCache(driveFolderId: string, chapterNo: number): Promise<string[]> {
        return this.cache.get(`${driveFolderId}-${chapterNo}`, GoogleDrive.getPagesLinks.bind(GoogleDrive, driveFolderId, chapterNo));
    }

    private async getPagesLinksWithRetry(driveFolderId: string, chapterNo: number): Promise<string[]> {
        let retry = true;

        while (true) {
            try {
                return await this.getPagesLinksWithCache(driveFolderId, chapterNo);
            }
            catch (e) {
                //Retry
                if (retry) {
                    this.cache.del(`${driveFolderId}-${chapterNo}`);
                    retry = false;
                }
                //Already retried throw error
                else {
                    throw e;
                }
            }
        }
    }

    async getPageLink(driveFolderId: string, chapterNo: number, pageNo: number): Promise<string> {
        const pageIndex = pageNo - 1;

        const pages = await this.getPagesLinksWithRetry(driveFolderId, chapterNo);

        //Index in range
        if (pageIndex < 0 || pageIndex > pages.length - 1) {
            throw new CommandError(`Cannot find page N°${pageNo}`);
        }

        return pages[pageNo - 1];
    }
}
