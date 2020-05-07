"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const helpers_1 = require("./helpers");
class FileDownloader {
    static async Download(url, prefix = "", dir = null) {
        dir = dir !== null && dir !== void 0 ? dir : path.join(os.tmpdir(), "/bsr/");
        //Create dir if it does not exist
        if (!fs.existsSync(dir)) {
            await fs.promises.mkdir(dir);
        }
        const filename = `${prefix}${helpers_1.hash(url, "sha1")}`;
        //Check if file exists already
        const existingFilename = await FileDownloader.fileExists(dir, filename);
        if (existingFilename != undefined) {
            return path.join(dir, existingFilename);
        }
        //Download file
        const fullpath = path.join(dir, filename);
        return await this.downloadFileFromUrl(url, fullpath);
    }
    static async fileExists(dir, filename) {
        const files = await fs.promises.readdir(dir);
        return files.find(file => file.startsWith(filename));
    }
    static async downloadFileFromUrl(url, path) {
        const res = await axios_1.default.get(url, {
            responseType: "stream",
        });
        //Append extension
        path += helpers_1.mimetypeToExtension(res.headers["content-type"]);
        const writer = fs.createWriteStream(path);
        res.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve.bind(null, path)); //Return the path with the extension
            writer.on("error", reject);
        });
    }
}
exports.FileDownloader = FileDownloader;
//# sourceMappingURL=FileDownloader.js.map