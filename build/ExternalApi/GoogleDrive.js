"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveWithCache = exports.GoogleDrive = void 0;
const axios_1 = require("axios");
const Cache_1 = require("../Cache");
const types_1 = require("../types");
class GoogleDrive {
    static async getChapterFolderId(driveFolderId, chapterNo) {
        const res = await axios_1.default.get("https://www.googleapis.com/drive/v3/files", {
            params: {
                q: `'${driveFolderId}' in parents`,
                fields: "files(id, name)",
                pageSize: 500,
                key: process.env.GOOGLE_API_KEY
            }
        });
        const files = res.data.files;
        //Pad before '.'
        const [int, decimal] = chapterNo.toString().split(".");
        const folder = files.find(f => {
            const [, intName, decimalName] = GoogleDrive.chapterRegex.exec(f.name);
            return Number(int) === Number(intName) && ((decimal == undefined && decimalName === undefined) || Number(decimal) === Number(decimalName));
        });
        if (folder == undefined) {
            throw new types_1.CommandError(`Cannot find chapter N°${chapterNo}`);
        }
        return folder.id;
    }
    static async getPagesLinks(driveFolderId, chapterNo) {
        const folderId = await this.getChapterFolderId(driveFolderId, chapterNo);
        const res = await axios_1.default.get("https://www.googleapis.com/drive/v3/files", {
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
exports.GoogleDrive = GoogleDrive;
GoogleDrive.chapterRegex = /Ch. (\d{3})(?:\.(\d+))?/;
class GoogleDriveWithCache extends GoogleDrive {
    constructor() {
        super();
        //24h cache
        this.cache = new Cache_1.default(60 * 60 * 24);
    }
    getPagesLinksWithCache(driveFolderId, chapterNo) {
        return this.cache.get(`${driveFolderId}-${chapterNo}`, GoogleDrive.getPagesLinks.bind(GoogleDrive, driveFolderId, chapterNo));
    }
    async getPagesLinksWithRetry(driveFolderId, chapterNo) {
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
    async getPageLink(driveFolderId, chapterNo, pageNo) {
        const pageIndex = pageNo - 1;
        const pages = await this.getPagesLinksWithRetry(driveFolderId, chapterNo);
        //Index in range
        if (pageIndex < 0 || pageIndex > pages.length - 1) {
            throw new types_1.CommandError(`Cannot find page N°${pageNo}`);
        }
        return pages[pageNo - 1];
    }
}
exports.GoogleDriveWithCache = GoogleDriveWithCache;
//# sourceMappingURL=GoogleDrive.js.map