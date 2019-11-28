import axios, {AxiosResponse} from "axios";
import {Stream} from "stream";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {hash, mimetypeToExtension} from "./helpers";

export class FileDownloader {

    public static async Download(url: string, prefix: string = "", dir: string | null = null) {
        dir = dir ?? path.join(os.tmpdir(), "/bsr/");

        //Create dir if it does not exist
        if (!fs.existsSync(dir)) {
            await fs.promises.mkdir(dir);
        }

        const filename = `${prefix}${hash(url, "sha1")}`;

        //Check if file exists already
        const existingFilename = await FileDownloader.fileExists(dir, filename);
        if (existingFilename != undefined) {
            return path.join(dir, existingFilename);
        }

        //Download file
        const fullpath = path.join(dir, filename);
        return await this.downloadFileFromUrl(url, fullpath);
    }

    private static async fileExists(dir: string, filename: string): Promise<string | undefined> {
        const files = await fs.promises.readdir(dir);
        return files.find(file => {
            file.startsWith(filename);
        });
    }

    private static async downloadFileFromUrl(url: string, path: string): Promise<string> {
        const res: AxiosResponse<Stream> = await axios.get(url, {
            responseType: "stream",
        });

        //Append extension
        path += mimetypeToExtension(res.headers["content-type"]);

        const writer = fs.createWriteStream(path);
        res.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve.bind(null, path)); //Return the path with the extension
            writer.on("error", reject);
        });
    }
}
