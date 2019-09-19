"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const Cache_1 = require("../Cache");
const types_1 = require("../types");
const drive = new googleapis_1.drive_v3.Drive({ auth: process.env.GOOGLE_API_KEY });
class GoogleDrive {
    static async getChapterFolderId(driveFolderId, chapterNo) {
        const folder = await drive.files.list({ q: `'${driveFolderId}' in parents and name contains 'Ch. ${chapterNo.toString().padStart(3, "0")}'` });
        if (folder.data.files.length === 0) {
            throw new types_1.CommandError(`Cannot find chapter N°${chapterNo}`);
        }
        return folder.data.files[0].id;
    }
    static async getPagesLinks(driveFolderId, chapterNo) {
        const folderId = await this.getChapterFolderId(driveFolderId, chapterNo);
        const pages = await drive.files.list({
            q: `'${folderId}' in parents`,
            orderBy: "name",
            fields: "files(webContentLink)"
        });
        return pages.data.files.map(page => page.webContentLink);
    }
}
exports.GoogleDrive = GoogleDrive;
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